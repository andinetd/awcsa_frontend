// Measure the printable form template's cell positions using pdfjs-dist.
// Outputs a TypeScript file with the constants for measured.ts.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF_PATH = join(
  import.meta.dirname,
  "../public/assets/templates/association-form.pdf",
);
const OUT_PATH = join(
  import.meta.dirname,
  "../src/lib/pdf/association-form-measured.ts",
);

const PAGE_W_PT = 842;
const PAGE_H_PT = 595;

const pdfBytes = readFileSync(PDF_PATH);
const doc = await getDocument({ data: new Uint8Array(pdfBytes) }).promise;

console.log("Pages:", doc.numPages);
for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const viewport = page.getViewport({ scale: 1 });
  console.log(`\nPage ${p}: ${viewport.width.toFixed(1)} x ${viewport.height.toFixed(1)} pt`);
  const text = await page.getTextContent();
  for (const item of text.items) {
    const s = item.str.trim();
    if (!s) continue;
    const [a, b, c, d, e, f] = item.transform;
    const x = e;
    const y = f;
    const w = item.width;
    const h = item.height;
    console.log(`  [x=${x.toFixed(1)} y=${y.toFixed(1)} w=${w.toFixed(1)} h=${h.toFixed(1)}] "${s.substring(0, 60)}"`);
  }
}
