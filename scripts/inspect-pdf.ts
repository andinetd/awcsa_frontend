/**
 * Re-measure field positions in the printable form template PDF.
 *
 * Usage:
 *   npx tsx scripts/inspect-pdf.ts
 *
 * Reads `public/assets/templates/association-form.pdf`, walks each page's
 * text content with `pdfjs-dist`, locates the pre-printed labels (e.g.
 * "የልማት ህብረቱ የሚገኝበት ክ/ከተማ:"), and emits a TypeScript file with the
 * constants for `src/lib/pdf/association-form-measured.ts`.
 *
 * The label-to-field mapping is in `LABEL_TO_FIELD` below. Add new
 * entries there when adding new fields to the template.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF_PATH = join(
  process.cwd(),
  "public/assets/templates/association-form.pdf",
);
const OUTPUT_PATH = join(
  process.cwd(),
  "src/lib/pdf/association-form-measured.generated.ts",
);

type TextItem = {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
};

type FieldDef = {
  /** unique key for this field */
  id: string;
  /** substring of the pre-printed label text in the PDF (Amharic) */
  label: string;
  /** pdf page (1 or 2) */
  page: 1 | 2;
};

/**
 * Map of label text -> field id. Add new entries when adding new
 * pre-printed labels to the template.
 */
const LABEL_TO_FIELD: FieldDef[] = [
  // Header (page 1)
  { id: "header.subCity", label: "የልማት ህብረቱ የሚገኝበት ክ/ከተማ", page: 1 },
  { id: "header.woreda", label: "ወረዳ", page: 1 },
  { id: "header.block", label: "ብሎክ", page: 1 },
  { id: "header.associationName", label: "የልማቱ ህብረት ስያሜ", page: 1 },
  { id: "header.memberCount", label: "የአባላት ብዛት", page: 1 },

  // Leadership column (page 1 + page 2)
  { id: "leader.1.fullName", label: "1.የልማት ህብረቱ ሊቀ መንበር", page: 1 },
  { id: "leader.2.fullName", label: "2.የልማት ህብረቱ ም/ሊቀ መንበር", page: 1 },
  { id: "leader.3.fullName", label: "3.የልማት ህብረቱ ዋና ፀሐፊ", page: 1 },
  { id: "leader.4.fullName", label: "4.የልማት ህብረቱ አባል", page: 1 },
  { id: "leader.5.fullName", label: "5.የልማት ህብረቱ አባል", page: 2 },

  // Member grid headers (page 1)
  { id: "grid.group.1", label: "ቡድን 1", page: 1 },
  { id: "grid.group.2", label: "ቡድን 2", page: 1 },
  { id: "grid.group.3", label: "ቡድን 3", page: 1 },
  { id: "grid.colHeader.no", label: "ተ.ቁ", page: 1 },
  { id: "grid.colHeader.name", label: "ሙሉ ስም", page: 1 },
  { id: "grid.colHeader.phone", label: "ስልክ ቁጥር", page: 1 },

  // Member row numbers (page 1: rows 1-8, page 2: rows 9-10)
  { id: "row.1", label: "1", page: 1 },
  { id: "row.2", label: "2", page: 1 },
  { id: "row.3", label: "3", page: 1 },
  { id: "row.4", label: "4", page: 1 },
  { id: "row.5", label: "5", page: 1 },
  { id: "row.6", label: "6", page: 1 },
  { id: "row.7", label: "7", page: 1 },
  { id: "row.8", label: "8", page: 1 },
  { id: "row.9", label: "9", page: 2 },
  { id: "row.10", label: "10", page: 2 },

  // Bottom sections (page 2)
  { id: "section.dataCollectorName", label: "መረጃ(ው)ን የሞላው ባለሞያ ስም", page: 2 },
  { id: "section.approverName", label: "መረጃ(ው)ን ያጸደቀው አካል ስም", page: 2 },
  { id: "section.signature", label: "ፊርማ", page: 2 },
  { id: "section.date", label: "ቀን", page: 2 },

  // Stamp
  { id: "stamp.title", label: "የቢሮ ማህተም", page: 2 },
];

interface Matched {
  field: FieldDef;
  x: number;
  y: number;
  width: number;
  height: number;
}

async function main() {
  if (!existsSync(PDF_PATH)) {
    console.error(`PDF not found at ${PDF_PATH}`);
    process.exit(1);
  }

  const data = readFileSync(PDF_PATH);
  const doc = await getDocument({ data: new Uint8Array(data) }).promise;
  const matched: Matched[] = [];
  const missing: FieldDef[] = [];

  for (const field of LABEL_TO_FIELD) {
    const page = await doc.getPage(field.page);
    const text = await page.getTextContent();
    const items = text.items as TextItem[];

    let best: { x: number; y: number; w: number; h: number } | null = null;
    let bestScore = -Infinity;

    for (const item of items) {
      // Score by overlap between item.str and field.label.
      // We pick the item with the longest matching prefix.
      const score = commonPrefixLength(item.str, field.label);
      if (score > bestScore && score >= 3) {
        bestScore = score;
        const tr = item.transform; // [a, b, c, d, e, f]
        // e, f = x, y of the text baseline
        // Width and height in PDF user units
        const x = tr[4];
        const y = tr[5];
        const w = item.width;
        const h = item.height;
        best = { x, y, w, h };
      }
    }

    if (best) {
      matched.push({ field, x: best.x, y: best.y, width: best.w, height: best.h });
    } else {
      missing.push(field);
    }
  }

  const page1 = await doc.getPage(1);
  const viewport = page1.getViewport({ scale: 1 });

  // Emit a TypeScript file with the matched fields as constants.
  // The caller is expected to copy these into `association-form-measured.ts`.
  const lines: string[] = [
    `/* eslint-disable */`,
    `/**`,
    ` * Auto-generated by scripts/inspect-pdf.ts. Do not edit by hand.`,
    ` *`,
    ` * Coordinate system: PDF points. Origin = bottom-left of the page.`,
    ` * y values below are text baselines (i.e. the bottom of the glyphs).`,
    ` */`,
    ``,
    `export const PAGE_WIDTH = ${Math.round(viewport.width)};`,
    `export const PAGE_HEIGHT = ${Math.round(viewport.height)};`,
    ``,
    `export const FIELDS = {`,
    ...matched.map((m) => {
      const k = m.field.id.replace(/\W/g, "_");
      const t = `${k}: { page: ${m.field.page}, x: ${m.x.toFixed(1)}, y: ${m.y.toFixed(1)}, width: ${m.width.toFixed(1)}, height: ${m.height.toFixed(1)} }`;
      return `  ${t},`;
    }),
    `} as const;`,
  ];

  writeFileSync(OUTPUT_PATH, lines.join("\n"), "utf8");

  console.log(`Matched ${matched.length}/${LABEL_TO_FIELD.length} fields`);
  if (missing.length) {
    console.warn(`Missing labels (${missing.length}):`);
    for (const m of missing) {
      console.warn(`  - page ${m.page}: ${m.label}`);
    }
  }
  console.log(`Wrote: ${OUTPUT_PATH}`);
}

function commonPrefixLength(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i += 1;
  }
  return i;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
