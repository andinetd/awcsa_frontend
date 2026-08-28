#!/usr/bin/env python3
"""
Build the A4 landscape printable form template (.docx).

The template defines the pre-printed labels that the frontend's
`fillAssociationForm()` writes dynamic text into.

Coordinate system: PDF points. Origin = top-left of the page.
1 cm = 28.3465 pt
1 inch = 72 pt

The .docx is structured as:
- Page 1 (A4 landscape, 29.7 x 21.0 cm):
    - Top: header band with 2 lines
    - Body: 2-column structure
        - LEFT (~6.5 cm wide): leadership column with 5 leader blocks
        - RIGHT (~21.0 cm wide): 3-group x 8-row member grid
- Page 2 (A4 landscape, 29.7 x 21.0 cm):
    - Top: 3-group x 2-row continuation (rows 9, 10) + leader 5
    - Middle: 2 signature lines
    - Bottom: stamp box

Each label is a text box (mc:AlternateContent) anchored at absolute
(x, y) on the page. The frontend draws dynamic text on top of these.
"""
import copy
from docx import Document
from docx.shared import Pt, Cm, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement
from lxml import etree

# Page dimensions in cm
PAGE_W_CM = 29.7
PAGE_H_CM = 21.0

# Margins (cm) - we want a tight printable area so the form fills the page
MARGIN_L = 1.0
MARGIN_R = 1.0
MARGIN_T = 0.6
MARGIN_B = 0.6

def cm_to_emu(cm: float) -> int:
    return int(cm * 360000)

def cm_to_pt(cm: float) -> float:
    return cm * 28.3465

# Page-1 absolute (x, y, width, height) in cm, with origin = top-left.
# These come from the existing measured.ts (Letter landscape) re-scaled
# to A4 landscape. The conversion: A4 is 842/792 = 1.063x wider and
# 595/612 = 0.972x shorter. We keep the original layout's relative
# positions and scale by these factors.

# === HEADER (page 1) ===
# Line 1: "የልማት ህብረቱ የሚገኝበት ክ/ከተማ: <subcity>     ወረዳ: <woreda>     ብሎክ: <block>"
HEADER_LINE1_Y_CM = 1.4
HEADER_LINE1_HEIGHT_CM = 0.6
# Line 2: "የልማቱ ህብረት ስያሜ: <name>     የአባላት ብዛት: <count>"
HEADER_LINE2_Y_CM = 2.4
HEADER_LINE2_HEIGHT_CM = 0.6

# Field positions on line 1 (cm from top-left)
# "የልማት ህብረቱ የሚገኝበት ክ/ከተማ" label ends at ~6cm, then subcity value
HEADER_SUBCITY_LABEL_X = 0.5
HEADER_SUBCITY_LABEL_W = 5.5
HEADER_SUBCITY_VALUE_X = 6.0
HEADER_SUBCITY_VALUE_W = 9.0

# "ወረዳ" label
HEADER_WOREDA_LABEL_X = 15.0
HEADER_WOREDA_LABEL_W = 1.5
HEADER_WOREDA_VALUE_X = 16.5
HEADER_WOREDA_VALUE_W = 4.0

# "ብሎክ" label
HEADER_BLOCK_LABEL_X = 20.5
HEADER_BLOCK_LABEL_W = 1.5
HEADER_BLOCK_VALUE_X = 22.0
HEADER_BLOCK_VALUE_W = 7.0

# Field positions on line 2
# "የልማቱ ህብረት ስያሜ" label
HEADER_NAME_LABEL_X = 0.5
HEADER_NAME_LABEL_W = 5.5
HEADER_NAME_VALUE_X = 6.0
HEADER_NAME_VALUE_W = 10.0

# "የአባላት ብዛት" label
HEADER_COUNT_LABEL_X = 16.0
HEADER_COUNT_LABEL_W = 4.0
HEADER_COUNT_VALUE_X = 20.0
HEADER_COUNT_VALUE_W = 9.0

# === LEADERSHIP COLUMN (page 1) ===
# 5 leader blocks stacked vertically. Each block: title + subtitle + name + phone.
# The column is widened to fit ~16 Amharic chars for the name.
LEADERSHIP_X = 0.5
LEADERSHIP_W = 7.0

# y positions for each leader block's name label (cm from top)
# Each block is ~3.2 cm tall
LEADER_NAME_Y = {
    1: 4.5,
    2: 7.7,
    3: 10.5,
    4: 13.3,
}

# === MEMBER GRID (page 1) ===
# 3 groups side-by-side. Each group: 3 columns (No. / Name / Phone).
# Top of grid at y=4.0 cm, bottom at y=18.0 cm.
GRID_TOP_Y = 4.0
GRID_BOTTOM_Y = 18.0
GRID_LEFT_X = 7.0
GRID_RIGHT_X = 29.2
GRID_WIDTH = GRID_RIGHT_X - GRID_LEFT_X  # 22.2 cm
GROUP_W = GRID_WIDTH / 3  # 7.4 cm per group

# Within each group: No. / Name / Phone
NUMBER_W = 1.0
NAME_W = 3.4
PHONE_W = GROUP_W - NUMBER_W - NAME_W  # ~3.0 cm

# y of each row's "N" digit (cm from top)
ROW_Y = {}
GRID_INNER_TOP = 5.4   # just below column headers
GRID_INNER_BOTTOM = 17.5
ROWS_ON_PAGE1 = 8
ROW_STEP = (GRID_INNER_BOTTOM - GRID_INNER_TOP) / (ROWS_ON_PAGE1 - 1)
for i in range(1, ROWS_ON_PAGE1 + 1):
    ROW_Y[i] = GRID_INNER_TOP + (i - 1) * ROW_STEP

# === PAGE 2 ===
# Top: 3-group x 2-row continuation (rows 9, 10) + leader 5
P2_GRID_TOP_Y = 1.0
P2_ROW_Y = {
    9: 1.4,
    10: 3.6,
}
# Leader 5 (on page 2)
LEADER5_NAME_Y = 6.5
LEADER5_PHONE_Y = 7.2

# Bottom: signature lines + stamp box
SECTION_DATA_COLLECTOR_Y = 9.0
SECTION_APPROVER_Y = 11.0
SECTION_NAME_X = 4.0
SECTION_NAME_W = 5.0
SECTION_SIG_X = 9.0
SECTION_SIG_W = 4.0
SECTION_DATE_X = 13.0
SECTION_DATE_W = 7.0

# Stamp box
STAMP_X = 22.0
STAMP_Y = 8.5
STAMP_W = 6.5
STAMP_H = 3.5

# === BUILD THE DOCUMENT ===
doc = Document()

# Configure section: A4 landscape
section = doc.sections[0]
section.orientation = WD_ORIENT.LANDSCAPE
section.page_width = Cm(PAGE_W_CM)
section.page_height = Cm(PAGE_H_CM)
section.top_margin = Cm(MARGIN_T)
section.bottom_margin = Cm(MARGIN_B)
section.left_margin = Cm(MARGIN_L)
section.right_margin = Cm(MARGIN_R)

# Helper: insert an anchored text box with absolute position.
# python-docx doesn't have first-class text box support, so we use
# the underlying XML to insert <w:drawing> with a positioned shape.
# This is the only reliable way to get pixel-precise placement in a .docx.
def insert_anchored_textbox(
    paragraph,
    text: str,
    x_cm: float,
    y_cm: float,
    w_cm: float,
    h_cm: float,
    font_size_pt: float = 9.0,
    bold: bool = False,
    align: str = "left",
    underline: bool = False,
    border: bool = False,
):
    """Insert an absolutely-positioned text box into the paragraph."""
    # Convert cm to EMU (English Metric Units) for OOXML positioning
    x_emu = cm_to_emu(x_cm)
    y_emu = cm_to_emu(y_cm)
    w_emu = cm_to_emu(w_cm)
    h_emu = cm_to_emu(h_cm)

    # Build the drawing XML
    # We use VML (mc:AlternateContent with wps:txbx) for max compatibility
    # with LibreOffice. DrawingML (wp:anchor with a:txbx) is the modern
    # alternative but LibreOffice's soffice has better VML support.
    bold_str = "true" if bold else "false"
    align_str = align  # left | center | right
    underline_str = "true" if underline else "false"
    border_str = "1pt solid #000" if border else "none"

    # The shape needs a unique ID
    shape_id = abs(hash(text)) % 100000

    # Build the VML shape
    vml = f'''<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w10="urn:schemas-microsoft-com:office:word">
  <w:pict>
    <v:shapetype id="_x0000_t202_s{shape_id}" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe">
      <v:stroke joinstyle="miter"/>
      <v:path gradientshapeok="t" o:connecttype="rect"/>
    </v:shapetype>
    <v:shape id="shape_{shape_id}" type="#_x0000_t202_s{shape_id}" style="position:absolute;margin-left:{x_emu / 9525}px;margin-top:{y_emu / 9525}px;width:{w_emu / 9525}px;height:{h_emu / 9525}px;z-index:251660288;mso-position-horizontal-absolute:no;mso-position-vertical-absolute:no" filled="f" stroked="{('t' if border else 'f')}" o:allowincell="f">
      <v:textbox style="mso-fit-shape-to-t:f" inset="0,0,0,0">
        <w:txbxContent>
          <w:p>
            <w:pPr>
              <w:jc w:val="{align_str}"/>
              <w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Noto Sans Ethiopic" w:hAnsi="Noto Sans Ethiopic" w:cs="Noto Sans Ethiopic" w:eastAsia="Noto Sans Ethiopic"/>
                <w:sz w:val="{int(font_size_pt * 2)}"/>
                <w:szCs w:val="{int(font_size_pt * 2)}"/>
                <w:b w:val="{bold_str}"/>
                <w:u w:val="{'single' if underline else 'none'}"/>
              </w:rPr>
              <w:t xml:space="preserve">{text}</w:t>
            </w:r>
          </w:p>
        </w:txbxContent>
      </v:textbox>
    </v:shape>
  </w:pict>
</w:r>'''
    # Append the raw XML to the paragraph
    new_run = etree.fromstring(vml)
    paragraph._element.append(new_run)


# Build page 1 content as a single paragraph with anchored text boxes.
# The paragraph itself is empty (no text flow), and each label is a
# positioned shape. This is the standard way to do absolute positioning
# in .docx.

p1 = doc.add_paragraph()
p1_pf = p1.paragraph_format
p1_pf.space_before = Pt(0)
p1_pf.space_after = Pt(0)
p1_pf.line_spacing = 1.0

# Header band
insert_anchored_textbox(p1, "የልማት ህብረቱ የሚገኝበት ክ/ከተማ:", HEADER_SUBCITY_LABEL_X, HEADER_LINE1_Y_CM, HEADER_SUBCITY_LABEL_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9, bold=True)
insert_anchored_textbox(p1, "___________________", HEADER_SUBCITY_VALUE_X, HEADER_LINE1_Y_CM, HEADER_SUBCITY_VALUE_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9)
insert_anchored_textbox(p1, "ወረዳ:", HEADER_WOREDA_LABEL_X, HEADER_LINE1_Y_CM, HEADER_WOREDA_LABEL_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9, bold=True)
insert_anchored_textbox(p1, "___________________", HEADER_WOREDA_VALUE_X, HEADER_LINE1_Y_CM, HEADER_WOREDA_VALUE_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9)
insert_anchored_textbox(p1, "ብሎክ:", HEADER_BLOCK_LABEL_X, HEADER_LINE1_Y_CM, HEADER_BLOCK_LABEL_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9, bold=True)
insert_anchored_textbox(p1, "___________________", HEADER_BLOCK_VALUE_X, HEADER_LINE1_Y_CM, HEADER_BLOCK_VALUE_W, HEADER_LINE1_HEIGHT_CM, font_size_pt=9)

insert_anchored_textbox(p1, "የልማቱ ህብረት ስያሜ:", HEADER_NAME_LABEL_X, HEADER_LINE2_Y_CM, HEADER_NAME_LABEL_W, HEADER_LINE2_HEIGHT_CM, font_size_pt=9, bold=True)
insert_anchored_textbox(p1, "___________________", HEADER_NAME_VALUE_X, HEADER_LINE2_Y_CM, HEADER_NAME_VALUE_W, HEADER_LINE2_HEIGHT_CM, font_size_pt=9)
insert_anchored_textbox(p1, "የአባላት ብዛት:", HEADER_COUNT_LABEL_X, HEADER_LINE2_Y_CM, HEADER_COUNT_LABEL_W, HEADER_LINE2_HEIGHT_CM, font_size_pt=9, bold=True)
insert_anchored_textbox(p1, "___________________", HEADER_COUNT_VALUE_X, HEADER_LINE2_Y_CM, HEADER_COUNT_VALUE_W, HEADER_LINE2_HEIGHT_CM, font_size_pt=9, align="right")

# Leadership column - 4 leaders on page 1
LEADER_DATA = [
    (1, "1.የልማት ህብረቱ ሊቀ መንበር", "(የመልካም አስተዳደርና የሴት አደረጃጀት ተጠሪ)", "ሙሉ ስም......................", "ስልክ ቁጥር..........."),
    (2, "2.የልማት ህብረቱ ም/ሊቀ መንበር", "(የሴቶች ጉዳይ ተጠሪ)", "ሙሉ ስም......................", "ስልክ ቁጥር..........."),
    (3, "3.የልማት ህብረቱ ዋና ፀሐፊ", "(የጤና ተጠሪ)", "ሙሉ ስም......................", "ስልክ ቁጥር..........."),
    (4, "4.የልማት ህብረቱ አባል", "(የስራና ክህሎት ተጠሪ)", "ሙሉ ስም......................", "ስልክ ቁጥር..........."),
]

LEADER_BLOCK_H = 2.5  # cm per leader block
for idx, (n, title, subtitle, name_blanks, phone_blanks) in enumerate(LEADER_DATA):
    block_y = LEADER_NAME_Y[n]
    # Title (bold, larger)
    insert_anchored_textbox(p1, title, LEADERSHIP_X, block_y - 0.4, LEADERSHIP_W, 0.6, font_size_pt=9, bold=True)
    # Subtitle (italic, smaller) - we can't italicize in our helper, so use regular
    insert_anchored_textbox(p1, subtitle, LEADERSHIP_X, block_y, LEADERSHIP_W, 0.5, font_size_pt=8)
    # Name blank at the title row's bottom
    insert_anchored_textbox(p1, name_blanks, LEADERSHIP_X, block_y + 0.55, LEADERSHIP_W, 0.5, font_size_pt=9)
    # Phone blank: same y as name baseline (use the same y_cm value)
    insert_anchored_textbox(p1, phone_blanks, LEADERSHIP_X, block_y + 0.55, LEADERSHIP_W, 0.5, font_size_pt=9)
# Member grid headers (page 1) - "ቡድን 1", "ቡድን 2", "ቡድን 3"
GRID_HEADER_Y = 4.0
GRID_COL_HEADERS_Y = 4.7
for g in range(1, 4):
    gx = GRID_LEFT_X + (g - 1) * GROUP_W
    # Group header
    insert_anchored_textbox(p1, f"ቡድን {g}", gx, GRID_HEADER_Y, GROUP_W, 0.5, font_size_pt=10, bold=True, align="center")
    # Column headers
    insert_anchored_textbox(p1, "ተ.ቁ", gx, GRID_COL_HEADERS_Y, NUMBER_W, 0.4, font_size_pt=8, align="center")
    insert_anchored_textbox(p1, "ሙሉ ስም", gx + NUMBER_W, GRID_COL_HEADERS_Y, NAME_W, 0.4, font_size_pt=8, align="center")
    insert_anchored_textbox(p1, "ስልክ ቁጥር", gx + NUMBER_W + NAME_W, GRID_COL_HEADERS_Y, PHONE_W, 0.4, font_size_pt=8, align="center")

# Right edge column header (notes column)
insert_anchored_textbox(p1, "ማስታወሻ", GRID_RIGHT_X - 1.0, GRID_HEADER_Y, 1.0, 0.5, font_size_pt=9, bold=True, align="center")

# Member rows 1-8 (page 1) - number + name blank + phone blank, all on the same y
for row in range(1, ROWS_ON_PAGE1 + 1):
    row_y = ROW_Y[row]
    for g in range(1, 4):
        gx = GRID_LEFT_X + (g - 1) * GROUP_W
        # Number
        insert_anchored_textbox(p1, str(row), gx, row_y, NUMBER_W, 0.5, font_size_pt=9, align="center")
        # Name blank (long enough to accommodate 3-word Amharic names with
        # the small (7pt) font used for dynamic data)
        insert_anchored_textbox(p1, "__________________________", gx + NUMBER_W, row_y, NAME_W, 0.5, font_size_pt=9)
        # Phone blank (long enough for +251 9X XXX XXXX, about 64pt)
        insert_anchored_textbox(p1, "________________", gx + NUMBER_W + NAME_W, row_y, PHONE_W, 0.5, font_size_pt=9)

# === PAGE 2 ===
# Use a page break
p_break = doc.add_paragraph()
p_break_pPr = p_break._element.get_or_add_pPr()
run = p_break.add_run()
br = OxmlElement("w:br")
br.set(qn("w:type"), "page")
run._element.append(br)

# Now add a new paragraph for page 2 content
p2 = doc.add_paragraph()
p2_pf = p2.paragraph_format
p2_pf.space_before = Pt(0)
p2_pf.space_after = Pt(0)
p2_pf.line_spacing = 1.0

# Member rows 9-10 (page 2) - same structure as page 1
GRID_LEFT_X_P2 = 0.5
GRID_RIGHT_X_P2 = GRID_LEFT_X_P2 + GROUP_W * 3 + 1.0
for row in [9, 10]:
    row_y = P2_ROW_Y[row]
    for g in range(1, 4):
        gx = GRID_LEFT_X_P2 + (g - 1) * GROUP_W
        insert_anchored_textbox(p2, str(row), gx, row_y, NUMBER_W, 0.5, font_size_pt=9, align="center")
        insert_anchored_textbox(p2, "__________________________", gx + NUMBER_W, row_y, NAME_W, 0.5, font_size_pt=9)
        insert_anchored_textbox(p2, "________________", gx + NUMBER_W + NAME_W, row_y, PHONE_W, 0.5, font_size_pt=9)

# Leader 5 (page 2)
LEADER5_TITLE = "5.የልማት ህብረቱ አባል"
LEADER5_SUBTITLE = "(የትምህርት ተጠሪ)"
insert_anchored_textbox(p2, LEADER5_TITLE, LEADERSHIP_X, LEADER5_NAME_Y - 0.4, LEADERSHIP_W, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, LEADER5_SUBTITLE, LEADERSHIP_X, LEADER5_NAME_Y, LEADERSHIP_W, 0.5, font_size_pt=8)
# Name blank and phone blank on the same y
insert_anchored_textbox(p2, "ሙሉ ስም: __________________________   ስልክ: ____________", LEADERSHIP_X, LEADER5_NAME_Y + 0.55, LEADERSHIP_W, 0.5, font_size_pt=9)

# Bottom: signature lines
insert_anchored_textbox(p2, "መረጃ(ው)ን የሞላው ባለሞያ ስም", 0.5, SECTION_DATA_COLLECTOR_Y, 4.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________________", SECTION_NAME_X, SECTION_DATA_COLLECTOR_Y, SECTION_NAME_W, 0.5, font_size_pt=9)
insert_anchored_textbox(p2, "ፊርማ", SECTION_SIG_X, SECTION_DATA_COLLECTOR_Y, 1.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________", SECTION_SIG_X + 1.0, SECTION_DATA_COLLECTOR_Y, SECTION_SIG_W - 1.0, 0.5, font_size_pt=9)
insert_anchored_textbox(p2, "ቀን", SECTION_DATE_X, SECTION_DATA_COLLECTOR_Y, 1.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________________", SECTION_DATE_X + 1.0, SECTION_DATA_COLLECTOR_Y, SECTION_DATE_W - 1.0, 0.5, font_size_pt=9)

insert_anchored_textbox(p2, "መረጃ(ው)ን ያጸደቀው አካል ስም", 0.5, SECTION_APPROVER_Y, 4.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________________", SECTION_NAME_X, SECTION_APPROVER_Y, SECTION_NAME_W, 0.5, font_size_pt=9)
insert_anchored_textbox(p2, "ፊርማ", SECTION_SIG_X, SECTION_APPROVER_Y, 1.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________", SECTION_SIG_X + 1.0, SECTION_APPROVER_Y, SECTION_SIG_W - 1.0, 0.5, font_size_pt=9)
insert_anchored_textbox(p2, "ቀን", SECTION_DATE_X, SECTION_APPROVER_Y, 1.0, 0.5, font_size_pt=9, bold=True)
insert_anchored_textbox(p2, "________________________", SECTION_DATE_X + 1.0, SECTION_APPROVER_Y, SECTION_DATE_W - 1.0, 0.5, font_size_pt=9)

# Stamp box
insert_anchored_textbox(p2, "የቢሮ ማህተም", STAMP_X, STAMP_Y, STAMP_W, 0.6, font_size_pt=10, bold=True, align="center", border=True)
insert_anchored_textbox(p2, " ", STAMP_X, STAMP_Y + 0.6, STAMP_W, STAMP_H - 1.2, font_size_pt=8, border=True)
insert_anchored_textbox(p2, "አዲስ አበባ ከተማ አስተዳደር\nሴቶች እና ህፃናት ጉዳዮች ጽ/ቤት", STAMP_X, STAMP_Y + STAMP_H - 0.6, STAMP_W, 0.6, font_size_pt=7, align="center", border=True)

# Save relative to the project root (parent of scripts/).
from pathlib import Path
project_root = Path(__file__).resolve().parent.parent
out = project_root / "templates" / "ልማት ህብረት ቅጽ.docx"
out.parent.mkdir(parents=True, exist_ok=True)
doc.save(str(out))
print(f"Saved: {out}")
