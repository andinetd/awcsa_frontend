#!/usr/bin/env python3
"""
Build the A4 landscape official-form template (.docx).

The template defines the pre-printed structure of the official
association form. Dynamic data is drawn on top of this template
by the frontend's fill-association-form.ts using pdf-lib.

Layout:

  Page 1 (A4 landscape, 29.7 x 21.0 cm):
  ┌──────────────────────────────────────────────┐
  │       ASSOCIATION INFORMATION                 │  <- top header band
  │ Location | Name | Members | Established       │
  ├────────────────┬─────────────────────────────┤
  │   LEADERSHIP   │       1-to-10 MEMBERS        │
  │ (5 leaders     │  Group 1 │ Group 2 │ Group 3 │
  │  stacked)      │  No Name │ No Name │ No Name │
  │                │  Phone   │ Phone   │ Phone   │
  │                │  1..8    │ 1..8    │ 1..8    │
  └────────────────┴──────────┴────────┴─────────┘
  Page 1 of 2

  Page 2 (A4 landscape, 29.7 x 21.0 cm):
  ┌──────────────────────────────────────────────┐
  │       1-to-10 MEMBERS — CONTINUATION         │
  ├────────────────┬──────────┬──────────┬───────┤
  │  (rows 9, 10)  │ Group 1  │ Group 2  │Group 3│
  ├────────────────┴──────────┴──────────┴───────┤
  │ Data Collector: ___  Signature: ___           │
  │ Approver:        ___  Signature: ___           │
  │                                  ┌────────┐   │
  │                                  │ STAMP  │   │
  │                                  └────────┘   │
  └──────────────────────────────────────────────┘
  Page 2 of 2

The template uses python-docx native tables (not anchored textboxes)
because table cells have stable, predictable positions when LibreOffice
converts the .docx to PDF. Anchored textboxes proved unreliable — the
rendered baseline depended on textbox height and content length, making
it impossible to align the dynamic data with the static pre-printed
labels.

────────────────────────────────────────────────────────────────────────
IMPORTANT — per-cell paragraph layout
────────────────────────────────────────────────────────────────────────
Each leadership block and each member cell MUST be authored as a stack
of separate paragraphs, NOT as a single inline string. The previous
implementation packed "ሙሉ ስም: ____ ስልክ: ____" onto a single line, which
caused pdf-lib (drawing dynamic values via fill-association-form.ts) to
stamp names on top of inline labels. Splitting them into separate
paragraphs gives each underscore blank its own baseline so the dynamic
text lands cleanly between the labels.

Per-leader cell:
    para 1: <position title>
    para 2: <subtitle in italics>
    para 3: "ሙሉ ስም:" (bold)
    para 4: "____________________________"   <- dynamic name lands here
    para 5: "ስልክ:" (bold)
    para 6: "____________________________"   <- dynamic phone lands here

Per-member cell:
    para 1: <row number>  (centered, bold)
    para 2: "ሙሉ ስም:" (bold)
    para 3: "____________________________"   <- dynamic name lands here
    para 4: "ስልክ:" (bold)
    para 5: "____________________________"   <- dynamic phone lands here

────────────────────────────────────────────────────────────────────────
IMPORTANT — .docx → .pdf conversion
────────────────────────────────────────────────────────────────────────
This script writes the canonical .docx to
    templates/ልማት ህብረት ቅጽ.docx
That .docx is then converted to .pdf via:

    soffice --headless --convert-to pdf \
        --outdir public/assets/templates \
        "templates/ልማት ህብረት ቅጽ.docx"

After running that, the new template lands at:
    public/assets/templates/association-form.pdf

The frontend pdf-lib code reads that .pdf as the pre-printed base.
If you change layout here, you MUST re-run the soffice conversion
BEFORE testing, otherwise the browser will keep using the old .pdf.
"""
from pathlib import Path
from docx import Document
from docx.shared import Pt, Cm, Inches, Emu, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement
from lxml import etree

# Page dimensions (A4 landscape, in cm)
PAGE_W_CM = 29.7
PAGE_H_CM = 21.0

# Margins (cm)
MARGIN_L = 1.0
MARGIN_R = 1.0
MARGIN_T = 0.6
MARGIN_B = 0.6


def set_cell_border(cell, color="000000", size=4):
    """Add a thin border to a single table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        border = OxmlElement(f"w:{side}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), str(size))
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), color)
        tc_borders.append(border)
    tc_pr.append(tc_borders)


def set_cell_shading(cell, fill="DDDDDD"):
    """Add background fill to a single table cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tc_pr.append(shd)


def set_table_borders(table, color="666666", size=4):
    """Add outer + inner borders to a table."""
    tbl_pr = table._element.find(qn("w:tblPr"))
    if tbl_pr is None:
        tbl_pr = OxmlElement("w:tblPr")
        table._element.insert(0, tbl_pr)
    borders = OxmlElement("w:tblBorders")
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = OxmlElement(f"w:{side}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), str(size))
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), color)
        borders.append(border)
    tbl_pr.append(borders)


def write_cell(cell, text, size=8, bold=False, align="left", valign="center"):
    """Write text into a table cell with tight padding."""
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = {
        "left": WD_ALIGN_PARAGRAPH.LEFT,
        "center": WD_ALIGN_PARAGRAPH.CENTER,
        "right": WD_ALIGN_PARAGRAPH.RIGHT,
    }[align]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    run = p.add_run(text)
    run.font.name = "Noto Sans Ethiopic"
    run.font.size = Pt(size)
    run.font.bold = bold
    # Set East Asian font for CJK fallback (not used but good practice)
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    rFonts.set(qn("w:ascii"), "Noto Sans Ethiopic")
    rFonts.set(qn("w:hAnsi"), "Noto Sans Ethiopic")
    rFonts.set(qn("w:cs"), "Noto Sans Ethiopic")
    rFonts.set(qn("w:eastAsia"), "Noto Sans Ethiopic")
    cell.vertical_alignment = {
        "top": WD_ALIGN_VERTICAL.TOP,
        "center": WD_ALIGN_VERTICAL.CENTER,
        "bottom": WD_ALIGN_VERTICAL.BOTTOM,
    }[valign]
    # Reduce cell margins (default is 100/100/100/100 dxa = 0.07 inch)
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = OxmlElement("w:tcMar")
    for side in ("top", "left", "bottom", "right"):
        m = OxmlElement(f"w:{side}")
        m.set(qn("w:w"), "30")  # ~0.5 mm
        m.set(qn("w:type"), "dxa")
        tc_mar.append(m)
    tc_pr.append(tc_mar)


def write_underlines(cell, count=24, size=8, color="000000"):
    """Write underscore blanks for the user to fill in."""
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run("_" * count)
    run.font.name = "Noto Sans Ethiopic"
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER


def write_label_then_underline(cell, label, underline_count=24,
                               label_size=8, label_bold=True,
                               underline_size=8):
    """
    Write a label paragraph followed by an underscore paragraph, both as
    separate paragraphs inside the cell.

    This is the canonical authoring pattern for any cell that the
    frontend will stamp dynamic data onto. The underscore paragraph
    becomes the visual target for the dynamic text, and the label
    paragraph sits immediately above it so pdf-lib's drawText lands
    on the baseline of the underscores rather than on top of an
    inline "ሙሉ ስም: ____ ስልክ: ____" string.
    """
    # Label paragraph
    p_label = cell.paragraphs[0]
    p_label.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_label.paragraph_format.space_before = Pt(0)
    p_label.paragraph_format.space_after = Pt(0)
    p_label.paragraph_format.line_spacing = 1.0
    r_label = p_label.add_run(label)
    r_label.font.name = "Noto Sans Ethiopic"
    r_label.font.size = Pt(label_size)
    r_label.font.bold = label_bold

    # Underscore paragraph
    p_underline = cell.add_paragraph()
    p_underline.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_underline.paragraph_format.space_before = Pt(0)
    p_underline.paragraph_format.space_after = Pt(0)
    p_underline.paragraph_format.line_spacing = 1.0
    r_underline = p_underline.add_run("_" * underline_count)
    r_underline.font.name = "Noto Sans Ethiopic"
    r_underline.font.size = Pt(underline_size)

    cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP


# === DOCUMENT ===
doc = Document()

# A4 landscape
section = doc.sections[0]
section.orientation = WD_ORIENT.LANDSCAPE
section.page_width = Cm(PAGE_W_CM)
section.page_height = Cm(PAGE_H_CM)
section.top_margin = Cm(MARGIN_T)
section.bottom_margin = Cm(MARGIN_B)
section.left_margin = Cm(MARGIN_L)
section.right_margin = Cm(MARGIN_R)

# === PAGE 1 ===
# The page has 3 stacked elements:
# 1. Header band (association info)
# 2. Two-column body (leadership | members)
# 3. Footer (page number)

# --- Element 1: Header band (1 row, 4 columns) ---
header_table = doc.add_table(rows=2, cols=4)
header_table.autofit = False
header_table.allow_autofit = False
# Total width: ~27.7 cm (A4 - margins)
# Allocation: 30% Location | 40% Name | 15% Members | 15% Date
col_widths_cm = [8.0, 11.0, 4.0, 4.0]
for i, w in enumerate(col_widths_cm):
    header_table.columns[i].width = Cm(w)
# Row 0: bold labels
# Row 1: pre-printed blanks
# Let rows auto-size

# Set row 0 cells: bold labels
write_cell(header_table.rows[0].cells[0], "የሚገኝበት ክ/ከተማ / Sub-city", size=8, bold=True, align="left")
write_cell(header_table.rows[0].cells[1], "የልማት ማህበር ስያሜ / Association name", size=8, bold=True, align="left")
write_cell(header_table.rows[0].cells[2], "የአባላት ብዛት / Members", size=8, bold=True, align="left")
write_cell(header_table.rows[0].cells[3], "የተመሰረተበት ቀን / Established", size=8, bold=True, align="left")

# Row 1: pre-printed blanks (underlines) for the user-entered data
write_underlines(header_table.rows[1].cells[0], count=28)
write_underlines(header_table.rows[1].cells[1], count=42)
write_underlines(header_table.rows[1].cells[2], count=12)
write_underlines(header_table.rows[1].cells[3], count=12)

# Header table styling
for row in header_table.rows:
    for cell in row.cells:
        set_cell_border(cell, color="333333", size=8)
        set_cell_shading(cell, fill="F2F2F2")
set_table_borders(header_table, color="333333", size=8)

# Add a small space after the header
spacer = doc.add_paragraph()
spacer.paragraph_format.space_after = Pt(0)
spacer_run = spacer.add_run("")
spacer_run.font.size = Pt(2)

# --- Element 2: Two-column body ---
# The body has 2 columns: leadership (left, narrow) and members (right, wide).
# Within the members column, there's a sub-table for the 3 groups.
# The cleanest way to do this in python-docx is to use ONE table for the whole
# outer layout, and NESTED tables for the inner structure.
#
# Outer table: 2 columns, 1 row
#   - Col 0 (leadership): 5 rows of leader info
#   - Col 1 (members): nested 3-column member table
#
# But python-docx nested tables are tricky. Simpler: 2 stacked elements
# side by side using a single 1-row 2-column table where the right cell
# contains a nested 3-column table.

# We need a 2-col outer table.
body_table = doc.add_table(rows=1, cols=2)
body_table.autofit = False
body_table.allow_autofit = False
# Leadership: 5.5 cm wide; Members: 22.0 cm wide
body_table.columns[0].width = Cm(5.5)
body_table.columns[1].width = Cm(22.0)
# Let row auto-size to content

# --- Cell 0: Leadership ---
leadership_cell = body_table.rows[0].cells[0]
# A 1-column nested table with 6 rows:
#   row 0: "LEADERSHIP" title (centered, bold, shaded)
#   rows 1-5: 5 leader blocks. Each block is a single cell containing
#             6 stacked paragraphs (title, subtitle, name-label,
#             name-underscore, phone-label, phone-underscore). The
#             dynamic name + phone land on the underscore paragraphs.
leadership_table = leadership_cell.add_table(rows=6, cols=1)
leadership_table.autofit = False
leadership_table.columns[0].width = Cm(5.3)
# Set explicit row heights
leadership_table.rows[0].height = Cm(0.6)  # Title row
for i in range(1, 6):
    leadership_table.rows[i].height = Cm(2.4)  # 5 leader blocks

LEADER_LABELS = [
    ("የልማት ህብረቱ ሊቀ መንበር", "የመልካም አስተዳደርና የሴት አደረጃጀት ተጠሪ", "CHAIRPERSON"),
    ("የልማት ህብረቱ ም/ሊቀ መንበር", "የሴቶች ጉዳይ ተጠሪ", "VICE_CHAIRPERSON"),
    ("የልማት ህብረቱ ዋና ፀሐፊ", "የጤና ተጠሪ", "SECRETARY"),
    ("የልማት ህብረቱ አባል", "የስራና ክህሎት ተጠሪ", "WORK_SKILLS_RESPONSIBLE"),
    ("የልማት ህብረቱ አባል", "የትምህርት ተጠሪ", "EDUCATION_RESPONSIBLE"),
]

# Row 0: title
write_cell(leadership_table.rows[0].cells[0], "LEADERSHIP", size=9, bold=True, align="center", valign="center")
set_cell_shading(leadership_table.rows[0].cells[0], fill="333333")
# White text on dark background
for p in leadership_table.rows[0].cells[0].paragraphs:
    for r in p.runs:
        r.font.color.rgb = RGBColor.from_string("FFFFFF")

# Rows 1-5: 5 leaders, one cell per leader. Each cell contains the
# following 6 paragraphs:
#   para 1: position title (bold, e.g. "1. የልማት ህብረቱ ሊቀ መንበር")
#   para 2: subtitle (italic, e.g. "(የመልካም አስተዳደርና የሴት አደረጃጀት ተጠሪ)")
#   para 3: "ሙሉ ስም:" label (bold)
#   para 4: "____________"  <- dynamic name lands here
#   para 5: "ስልክ:" label (bold)
#   para 6: "____________"  <- dynamic phone lands here
for i, (title, subtitle, pos) in enumerate(LEADER_LABELS):
    leader_cell = leadership_table.rows[i + 1].cells[0]
    leader_cell.text = ""

    # para 1: position title
    p_title = leader_cell.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(0)
    p_title.paragraph_format.line_spacing = 1.0
    r_title = p_title.add_run(f"{i+1}. {title}")
    r_title.font.name = "Noto Sans Ethiopic"
    r_title.font.size = Pt(8)
    r_title.font.bold = True

    # para 2: subtitle (italic)
    p_sub = leader_cell.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(0)
    p_sub.paragraph_format.line_spacing = 1.0
    r_sub = p_sub.add_run(subtitle)
    r_sub.font.name = "Noto Sans Ethiopic"
    r_sub.font.size = Pt(7)
    r_sub.font.italic = True

    # para 3: name label
    p_name_label = leader_cell.add_paragraph()
    p_name_label.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_name_label.paragraph_format.space_before = Pt(0)
    p_name_label.paragraph_format.space_after = Pt(0)
    p_name_label.paragraph_format.line_spacing = 1.0
    r_name_label = p_name_label.add_run("ሙሉ ስም:")
    r_name_label.font.name = "Noto Sans Ethiopic"
    r_name_label.font.size = Pt(7)
    r_name_label.font.bold = True

    # para 4: name underscore  <- dynamic name lands here
    p_name_us = leader_cell.add_paragraph()
    p_name_us.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_name_us.paragraph_format.space_before = Pt(0)
    p_name_us.paragraph_format.space_after = Pt(0)
    p_name_us.paragraph_format.line_spacing = 1.0
    r_name_us = p_name_us.add_run("_" * 18)
    r_name_us.font.name = "Noto Sans Ethiopic"
    r_name_us.font.size = Pt(8)

    # para 5: phone label
    p_phone_label = leader_cell.add_paragraph()
    p_phone_label.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_phone_label.paragraph_format.space_before = Pt(0)
    p_phone_label.paragraph_format.space_after = Pt(0)
    p_phone_label.paragraph_format.line_spacing = 1.0
    r_phone_label = p_phone_label.add_run("ስልክ:")
    r_phone_label.font.name = "Noto Sans Ethiopic"
    r_phone_label.font.size = Pt(7)
    r_phone_label.font.bold = True

    # para 6: phone underscore  <- dynamic phone lands here
    p_phone_us = leader_cell.add_paragraph()
    p_phone_us.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_phone_us.paragraph_format.space_before = Pt(0)
    p_phone_us.paragraph_format.space_after = Pt(0)
    p_phone_us.paragraph_format.line_spacing = 1.0
    r_phone_us = p_phone_us.add_run("_" * 13)
    r_phone_us.font.name = "Noto Sans Ethiopic"
    r_phone_us.font.size = Pt(8)

    leader_cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP

# Apply leadership table styling
for row in leadership_table.rows:
    for cell in row.cells:
        set_cell_border(cell, color="666666", size=4)
# No outer borders for the inner leadership table
for i in range(1, 6):
    set_cell_border(leadership_table.rows[i].cells[0], color="CCCCCC", size=4)

# --- Cell 1: Members grid (3 groups × 8 rows) ---
members_cell = body_table.rows[0].cells[1]
# Nested 3-column table for the groups
members_table = members_cell.add_table(rows=9, cols=3)
members_table.autofit = False
for i in range(3):
    members_table.columns[i].width = Cm(7.0)
# Set explicit row heights so the table doesn't overflow
# the printable area on page 1. With 9 rows × 1.8cm + 0.6cm header
# = 16.8cm, leaving room for the page header and footer.
members_table.rows[0].height = Cm(0.6)  # Group header
for i in range(1, 9):
    members_table.rows[i].height = Cm(1.8)  # 8 data rows
# Force the last row to be tiny so it disappears visually
members_table.rows[8].height = Cm(0.1)
# Row 0: "1-to-10 MEMBERS" title spanning all 3 groups
# Use cell merge for the title
# Row 0: each cell has a group header (1, 2, 3)
for g in range(3):
    write_cell(members_table.rows[0].cells[g], f"ቡድን {g+1}", size=10, bold=True, align="center")
    set_cell_shading(members_table.rows[0].cells[g], fill="333333")
    for p in members_table.rows[0].cells[g].paragraphs:
        for r in p.runs:
            r.font.color.rgb = RGBColor.from_string("FFFFFF")

# Rows 1-8: 8 member rows per group.
# Per-cell layout (5 stacked paragraphs):
#   para 1: serial number (centered, bold)         e.g. "1"
#   para 2: "ሙሉ ስም:" label (bold)
#   para 3: "____________"  underscore blank       <- dynamic name lands here
#   para 4: "ስልክ:" label (bold)
#   para 5: "____________"  underscore blank       <- dynamic phone lands here
for row_idx in range(8):
    row_num = row_idx + 1
    for g in range(3):
        cell = members_table.rows[row_idx + 1].cells[g]
        cell.text = ""

        # para 1: serial number
        p1 = cell.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.line_spacing = 1.0
        r1 = p1.add_run(str(row_num))
        r1.font.name = "Noto Sans Ethiopic"
        r1.font.size = Pt(9)
        r1.font.bold = True

        # para 2: name label
        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.0
        r2 = p2.add_run("ሙሉ ስም:")
        r2.font.name = "Noto Sans Ethiopic"
        r2.font.size = Pt(7)
        r2.font.bold = True

        # para 3: name underscore blank  <- dynamic name lands here
        p3 = cell.add_paragraph()
        p3.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        p3.paragraph_format.line_spacing = 1.0
        r3 = p3.add_run("_" * 14)
        r3.font.name = "Noto Sans Ethiopic"
        r3.font.size = Pt(8)

        # para 4: phone label
        p4 = cell.add_paragraph()
        p4.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        p4.paragraph_format.line_spacing = 1.0
        r4 = p4.add_run("ስልክ:")
        r4.font.name = "Noto Sans Ethiopic"
        r4.font.size = Pt(7)
        r4.font.bold = True

        # para 5: phone underscore blank  <- dynamic phone lands here
        p5 = cell.add_paragraph()
        p5.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p5.paragraph_format.space_before = Pt(0)
        p5.paragraph_format.space_after = Pt(0)
        p5.paragraph_format.line_spacing = 1.0
        r5 = p5.add_run("_" * 12)
        r5.font.name = "Noto Sans Ethiopic"
        r5.font.size = Pt(8)

        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP

# Row 9: spacer (empty)
members_table.rows[8].cells[0].text = ""
# Force the last row to be tiny so it disappears visually
members_table.rows[8].height = Cm(0.1)

# Apply members table styling
for row in members_table.rows:
    for cell in row.cells:
        set_cell_border(cell, color="666666", size=4)

# Body table styling: only show outer border (no inner vertical)
# Actually we DO want a vertical separator between leadership and members
# at the body table level.
set_table_borders(body_table, color="333333", size=8)

# Add a small spacer after the body
spacer2 = doc.add_paragraph()
spacer2.paragraph_format.space_after = Pt(0)
spacer2_run = spacer2.add_run("")
spacer2_run.font.size = Pt(2)

# --- Element 3: Footer (page 1) ---
footer_p = doc.add_paragraph()
footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
footer_p.paragraph_format.space_before = Pt(0)
footer_p.paragraph_format.space_after = Pt(0)
footer_run = footer_p.add_run("Page 1 of 2")
footer_run.font.name = "Noto Sans Ethiopic"
footer_run.font.size = Pt(8)
footer_run.font.color.rgb = RGBColor.from_string("888888")

# === PAGE BREAK ===
p_break = doc.add_paragraph()
p_break_pPr = p_break._element.get_or_add_pPr()
run = p_break.add_run()
br = OxmlElement("w:br")
br.set(qn("w:type"), "page")
run._element.append(br)

# === PAGE 2 ===
# Top: continuation header band
p2_header = doc.add_table(rows=1, cols=1)
p2_header.autofit = False
p2_header.columns[0].width = Cm(27.5)
write_cell(p2_header.rows[0].cells[0], "1-to-10 MEMBERS — CONTINUATION", size=12, bold=True, align="center")
set_cell_shading(p2_header.rows[0].cells[0], fill="333333")
for p in p2_header.rows[0].cells[0].paragraphs:
    for r in p.runs:
        r.font.color.rgb = RGBColor.from_string("FFFFFF")
p2_header.rows[0].height = Cm(1.0)
set_table_borders(p2_header, color="333333", size=8)

# Spacer
spacer3 = doc.add_paragraph()
spacer3.paragraph_format.space_after = Pt(0)
spacer3_run = spacer3.add_run("")
spacer3_run.font.size = Pt(2)

# Member rows 9-10 (continuation)
p2_members = doc.add_table(rows=3, cols=3)
p2_members.autofit = False
for i in range(3):
    p2_members.columns[i].width = Cm(7.0)
# Row 0: group labels
for g in range(3):
    write_cell(p2_members.rows[0].cells[g], f"ቡድን {g+1}", size=10, bold=True, align="center")
    set_cell_shading(p2_members.rows[0].cells[g], fill="333333")
    for p in p2_members.rows[0].cells[g].paragraphs:
        for r in p.runs:
            r.font.color.rgb = RGBColor.from_string("FFFFFF")
# Rows 1-2: members 9 and 10.
# Same 5-paragraph layout as page 1: number / "ሙሉ ስም:" /
# underscore blank / "ስልክ:" / underscore blank.
for row_idx in range(2):
    row_num = row_idx + 9
    for g in range(3):
        cell = p2_members.rows[row_idx + 1].cells[g]
        cell.text = ""

        # para 1: serial number
        p1 = cell.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.line_spacing = 1.0
        r1 = p1.add_run(str(row_num))
        r1.font.name = "Noto Sans Ethiopic"
        r1.font.size = Pt(9)
        r1.font.bold = True

        # para 2: name label
        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.0
        r2 = p2.add_run("ሙሉ ስም:")
        r2.font.name = "Noto Sans Ethiopic"
        r2.font.size = Pt(7)
        r2.font.bold = True

        # para 3: name underscore blank
        p3 = cell.add_paragraph()
        p3.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p3.paragraph_format.space_before = Pt(0)
        p3.paragraph_format.space_after = Pt(0)
        p3.paragraph_format.line_spacing = 1.0
        r3 = p3.add_run("_" * 14)
        r3.font.name = "Noto Sans Ethiopic"
        r3.font.size = Pt(8)

        # para 4: phone label
        p4 = cell.add_paragraph()
        p4.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p4.paragraph_format.space_before = Pt(0)
        p4.paragraph_format.space_after = Pt(0)
        p4.paragraph_format.line_spacing = 1.0
        r4 = p4.add_run("ስልክ:")
        r4.font.name = "Noto Sans Ethiopic"
        r4.font.size = Pt(7)
        r4.font.bold = True

        # para 5: phone underscore blank
        p5 = cell.add_paragraph()
        p5.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p5.paragraph_format.space_before = Pt(0)
        p5.paragraph_format.space_after = Pt(0)
        p5.paragraph_format.line_spacing = 1.0
        r5 = p5.add_run("_" * 12)
        r5.font.name = "Noto Sans Ethiopic"
        r5.font.size = Pt(8)

        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP
for row in p2_members.rows:
    for cell in row.cells:
        set_cell_border(cell, color="666666", size=4)

# Spacer
spacer4 = doc.add_paragraph()
spacer4.paragraph_format.space_after = Pt(0)
spacer4_run = spacer4.add_run("")
spacer4_run.font.size = Pt(4)

# Bottom: signature + stamp (1-row 2-col table)
# Left: signature lines, Right: stamp box
bottom_table = doc.add_table(rows=1, cols=2)
bottom_table.autofit = False
bottom_table.columns[0].width = Cm(20.0)
bottom_table.columns[1].width = Cm(7.5)
bottom_table.rows[0].height = Cm(6.0)

# Left: signature section.
# Layout: 2 sections × 3 rows per section = 6 rows in the inner sig_table.
# Each section has:
#   row N:    "name label:"     + "____________"
#   row N+1:  "ፊርማ:" (signature) + "____________" + "ቀን:" (date) + "____"
#   row N+2:  spacer
#
# This gives the dynamic data a separate underscore paragraph per field
# so pdf-lib stamps land cleanly on the blank rather than on an inline
# label.
sig_cell = bottom_table.rows[0].cells[0]
sig_table = sig_cell.add_table(rows=6, cols=4)
sig_table.autofit = False
sig_table.columns[0].width = Cm(4.5)  # name label
sig_table.columns[1].width = Cm(8.5)  # name underscore
sig_table.columns[2].width = Cm(3.0)  # sig/date label
sig_table.columns[3].width = Cm(4.0)  # sig/date underscore

def write_sig_row(row, label_text, underline_count, sig_label, sig_count):
    """Helper: write a name+signature+date row into sig_table at `row`."""
    name_label_cell = sig_table.rows[row].cells[0]
    name_blank_cell = sig_table.rows[row].cells[1]
    sig_label_cell = sig_table.rows[row].cells[2]
    sig_blank_cell = sig_table.rows[row].cells[3]

    write_cell(name_label_cell, label_text, size=8, bold=True, align="left")
    write_underlines(name_blank_cell, count=underline_count, size=8)
    write_cell(sig_label_cell, sig_label, size=8, bold=True, align="left")
    write_underlines(sig_blank_cell, count=sig_count, size=8)


# Data collector section (rows 0-1)
write_sig_row(0, "መረጃውን የሞላው ባለሞያ ስም:", underline_count=40, sig_label="ፊርማ / ቀን:", sig_count=22)

# Approver section (rows 2-3)
write_sig_row(2, "ያጸደቀው አካል ስም:", underline_count=40, sig_label="ፊርማ / ቀን:", sig_count=22)

# Spacer rows (1 and 4-5)
for spacer_row in (1, 4, 5):
    for c in sig_table.rows[spacer_row].cells:
        c.text = ""

# Right: stamp box
stamp_cell = bottom_table.rows[0].cells[1]
stamp_cell.text = ""
sp = stamp_cell.paragraphs[0]
sp.alignment = WD_ALIGN_PARAGRAPH.CENTER
sp.paragraph_format.space_before = Pt(2)
sp.paragraph_format.space_after = Pt(2)
sr = sp.add_run("የቢሮ ማህተም\n\n\n\n")
sr.font.name = "Noto Sans Ethiopic"
sr.font.size = Pt(10)
sr.font.bold = True
sr.font.color.rgb = RGBColor.from_string("666666")
stamp_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
set_cell_border(stamp_cell, color="333333", size=12)

# Apply bottom table styling
set_table_borders(bottom_table, color="333333", size=8)

# Page 2 footer
p2_footer = doc.add_paragraph()
p2_footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
p2_footer.paragraph_format.space_before = Pt(2)
p2_footer.paragraph_format.space_after = Pt(0)
p2_footer_run = p2_footer.add_run("Page 2 of 2")
p2_footer_run.font.name = "Noto Sans Ethiopic"
p2_footer_run.font.size = Pt(8)
p2_footer_run.font.color.rgb = RGBColor.from_string("888888")

# Save relative to the project root
project_root = Path(__file__).resolve().parent.parent
out = project_root / "templates" / "ልማት ህብረት ቅጽ.docx"
out.parent.mkdir(parents=True, exist_ok=True)
doc.save(str(out))
print(f"Saved: {out}")
