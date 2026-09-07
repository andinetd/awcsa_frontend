import { PDFDocument, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const FONT_ETHIOPIC_REGULAR_URL = "/assets/fonts/NotoSansEthiopic-Regular.ttf";
const FONT_ETHIOPIC_BOLD_URL = "/assets/fonts/NotoSansEthiopic-Bold.ttf";
const FONT_LATIN_REGULAR_URL = "/assets/fonts/DejaVuSans.ttf";
const FONT_LATIN_BOLD_URL = "/assets/fonts/DejaVuSans-Bold.ttf";

export type EthiopicVariant = "regular" | "bold";
export type LatinVariant = "regular" | "bold";
export type Script = "ethiopic" | "latin";

type FontVariant = "regular" | "bold";

export interface FontCache {
  ethiopic: Record<FontVariant, PDFFont>;
  latin: Record<FontVariant, PDFFont>;
}

const fontBytesCache = new Map<string, Uint8Array>();
const fontCache = new Map<PDFDocument, FontCache>();
const fontkitRegistered = new WeakSet<PDFDocument>();

async function loadFontBytes(key: string, url: string): Promise<Uint8Array> {
  const cached = fontBytesCache.get(key);
  if (cached) return cached;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to load font ${key} from ${url}: ${response.status} ${response.statusText}`
    );
  }
  const buffer = new Uint8Array(await response.arrayBuffer());
  fontBytesCache.set(key, buffer);
  return buffer;
}

export async function getFonts(pdfDoc: PDFDocument): Promise<FontCache> {
  const cached = fontCache.get(pdfDoc);
  if (cached) return cached;

  if (!fontkitRegistered.has(pdfDoc)) {
    pdfDoc.registerFontkit(fontkit);
    fontkitRegistered.add(pdfDoc);
  }

  const [
    ethiopicRegularBytes,
    ethiopicBoldBytes,
    latinRegularBytes,
    latinBoldBytes,
  ] = await Promise.all([
    loadFontBytes("ethiopic-regular", FONT_ETHIOPIC_REGULAR_URL),
    loadFontBytes("ethiopic-bold", FONT_ETHIOPIC_BOLD_URL),
    loadFontBytes("latin-regular", FONT_LATIN_REGULAR_URL),
    loadFontBytes("latin-bold", FONT_LATIN_BOLD_URL),
  ]);

  const [ethiopicRegular, ethiopicBold, latinRegular, latinBold] = await Promise.all([
    pdfDoc.embedFont(ethiopicRegularBytes, { subset: false }),
    pdfDoc.embedFont(ethiopicBoldBytes, { subset: false }),
    pdfDoc.embedFont(latinRegularBytes, { subset: false }),
    pdfDoc.embedFont(latinBoldBytes, { subset: false }),
  ]);

  const cache: FontCache = {
    ethiopic: { regular: ethiopicRegular, bold: ethiopicBold },
    latin: { regular: latinRegular, bold: latinBold },
  };
  fontCache.set(pdfDoc, cache);
  return cache;
}

export function isEthiopic(text: string): boolean {
  return /[\u1200-\u137F]/.test(text);
}

export function isLatinOnly(text: string): boolean {
  // Pure Latin: letters, digits, whitespace, basic punctuation.
  return /^[\x20-\x7E]*$/.test(text);
}

export function pickFont(
  fonts: FontCache,
  text: string,
  variant: FontVariant = "regular"
): { font: PDFFont; script: Script } {
  if (isEthiopic(text)) {
    return { font: fonts.ethiopic[variant], script: "ethiopic" };
  }
  return { font: fonts.latin[variant], script: "latin" };
}

export const FONTS_URLS = {
  ethiopic: { regular: FONT_ETHIOPIC_REGULAR_URL, bold: FONT_ETHIOPIC_BOLD_URL },
  latin: { regular: FONT_LATIN_REGULAR_URL, bold: FONT_LATIN_BOLD_URL },
};
