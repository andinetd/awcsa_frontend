import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
} from "pdf-lib";
import type { WomenAssociationRecord } from "@/api/womens/associations";
import {
  ASSOCIATION_FORM_IMAGE_SLOTS,
  buildFields,
  type AssociationFormFormat,
  type FormFieldDef,
  resolveFieldValue,
} from "./association-form-field-map";
import { getFonts, pickFont, type FontCache } from "./register-amharic-font";

const TEMPLATE_URL = "/assets/templates/association-form.pdf";

export interface AssociationFormFillerOptions {
  record: WomenAssociationRecord;
  format?: AssociationFormFormat;
  signatureBlobs?: {
    entry?: Blob | null;
    approval?: Blob | null;
  };
}

export async function fillAssociationForm(
  options: AssociationFormFillerOptions
): Promise<Uint8Array> {
  const { record, format = "printable_form", signatureBlobs } = options;

  const pdfDoc = await loadTemplateDocument();
  const fonts = await getFonts(pdfDoc);
  const fields = buildFields(format);

  for (const field of fields) {
    const pageIndex = field.page - 1;
    const page = pdfDoc.getPages()[pageIndex];
    if (!page) continue;
    drawField(page, field, fonts, record);
  }

  if (format === "printable_form") {
    await drawSignatureImages(pdfDoc, signatureBlobs);
  }

  return await pdfDoc.save();
}

async function loadTemplateDocument(): Promise<PDFDocument> {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to load association form template (${TEMPLATE_URL}): ${res.status} ${res.statusText}`
    );
  }
  const buffer = await res.arrayBuffer();
  return await PDFDocument.load(buffer, { ignoreEncryption: true });
}

function drawField(
  page: PDFPage,
  field: FormFieldDef,
  fonts: FontCache,
  record: WomenAssociationRecord
) {
  const value = resolveFieldValue(field, record);
  const text = value?.trim() ? value : "";

  if (!text) return;

  const variant = field.font === "bold" ? "bold" : "regular";
  const { font } = pickFont(fonts, text, variant);

  const fontSize = field.size ?? 9;
  const lines = wrapText(text, font, fontSize, field.width);

  const lineHeight = fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight;
  const startY = field.y + (field.height - totalTextHeight) / 2 + lineHeight - 2;

  lines.forEach((line, idx) => {
    const y = startY - idx * lineHeight;
    const x = getAlignedX(line, font, fontSize, field);
    page.drawText(line, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function getAlignedX(
  text: string,
  font: PDFFont,
  size: number,
  field: FormFieldDef
): number {
  const align = field.align ?? "left";
  if (align === "left") return field.x;
  const textWidth = safeWidthOfTextAtSize(font, text, size);
  if (align === "right") return field.x + field.width - textWidth;
  return field.x + (field.width - textWidth) / 2;
}

function safeWidthOfTextAtSize(
  font: PDFFont,
  text: string,
  size: number
): number {
  try {
    return font.widthOfTextAtSize(text, size);
  } catch {
    return text.length * size * 0.5;
  }
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  if (!text) return [];

  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const w = safeWidthOfTextAtSize(font, candidate, size);
    if (w <= maxWidth) {
      current = candidate;
      continue;
    }

    // The next word doesn't fit on the current line.
    if (current) {
      lines.push(current);
      current = word;
      continue;
    }

    // A single word is wider than the cell — truncate character-by-character
    // rather than letting it overflow onto neighbouring cells / labels.
    let truncated = word;
    while (
      truncated.length > 1 &&
      safeWidthOfTextAtSize(font, truncated, size) > maxWidth
    ) {
      truncated = truncated.slice(0, -1);
    }
    lines.push(truncated);
    current = "";
  }
  if (current) lines.push(current);
  return lines;
}

async function drawSignatureImages(
  pdfDoc: PDFDocument,
  signatureBlobs?: { entry?: Blob | null; approval?: Blob | null }
) {
  if (!signatureBlobs) return;

  const tasks: Array<Promise<void>> = [];

  if (signatureBlobs.entry) {
    tasks.push(embedAndDraw(pdfDoc, signatureBlobs.entry, "entrySignature"));
  }
  if (signatureBlobs.approval) {
    tasks.push(embedAndDraw(pdfDoc, signatureBlobs.approval, "approvalSignature"));
  }

  await Promise.all(tasks);
}

async function embedAndDraw(
  pdfDoc: PDFDocument,
  blob: Blob,
  kind: "entrySignature" | "approvalSignature"
) {
  const slot = ASSOCIATION_FORM_IMAGE_SLOTS.find((s) => s.kind === kind);
  if (!slot) return;

  const buffer = new Uint8Array(await blob.arrayBuffer());
  const isPng = blob.type.includes("png");
  const image = isPng
    ? await pdfDoc.embedPng(buffer)
    : await pdfDoc.embedJpg(buffer);

  const page = pdfDoc.getPages()[slot.page - 1];
  if (!page) return;

  const scale = Math.min(
    slot.width / image.width,
    slot.height / image.height,
    1
  );
  const w = image.width * scale;
  const h = image.height * scale;
  const x = slot.x + (slot.width - w) / 2;
  const y = slot.y + (slot.height - h) / 2;

  page.drawImage(image, { x, y, width: w, height: h });
}
