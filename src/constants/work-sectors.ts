export type WorkSectorCode =
  | "TEXTILE_GARMENT"
  | "LEATHER_WORK"
  | "BAKERY"
  | "CHIPS_PRODUCTION"
  | "HAIRDRESSING"
  | "POULTRY_FARMING"
  | "SHEEP_REARING"
  | "URBAN_AGRICULTURE"
  | "AGRICULTURE"
  | "BUSINESS"
  | "HOTEL_HOSPITALITY"
  | "HOUSE_CONSTRUCTION"
  | "AUTOMOTIVE"
  | "ELECTRICITY"
  | "ICT"
  | "MUNICIPALITY_ADMIN"
  | "ROAD_CONSTRUCTION"
  | "AGRO_PROCESSING"
  | "FURNITURE_MAKING"
  | "METAL_WORKING"
  | "OTHER";

/**
 * Tailored Desired Work Sectors for Persons with Disabilities (አካል ጉዳተኞች)
 * 1. የልብስ ስፌት (Tailoring / Garment)
 * 2. የቆዳ ስራ (Leatherwork)
 * 3. የዳቦ መጋገር (Bakery / Bread Making)
 * 4. ቺብስ ስራ (Potato Chips / Snack Making)
 * 5. ፀጉር ሙያ (Hairdressing / Barbering)
 * 6. ሌሎች (Other)
 */
export const DISABLED_WORK_SECTORS: WorkSectorCode[] = [
  "TEXTILE_GARMENT",
  "LEATHER_WORK",
  "BAKERY",
  "CHIPS_PRODUCTION",
  "HAIRDRESSING",
  "OTHER",
];

/**
 * Tailored Desired Work Sectors for the Elderly (አረጋውያን)
 * 1. የዳቦ መጋገር (Bakery / Bread Making)
 * 2. ዶሮ እርባታ (Poultry Farming)
 * 3. በግ እርባታ (Sheep / Livestock Rearing)
 * 4. የጓሮ አትክልት / ከተማ ግብርና (Backyard Gardening / Urban Agriculture)
 * 5. ሌሎች (Other)
 */
export const ELDERLY_WORK_SECTORS: WorkSectorCode[] = [
  "BAKERY",
  "POULTRY_FARMING",
  "SHEEP_REARING",
  "URBAN_AGRICULTURE",
  "OTHER",
];

export interface WorkSectorMeta {
  code: WorkSectorCode;
  labelEn: string;
  labelAm: string;
}

export const WORK_SECTOR_REGISTRY: Record<string, WorkSectorMeta> = {
  TEXTILE_GARMENT: {
    code: "TEXTILE_GARMENT",
    labelEn: "Tailoring & Garment",
    labelAm: "የልብስ ስፌት",
  },
  LEATHER_WORK: {
    code: "LEATHER_WORK",
    labelEn: "Leatherwork",
    labelAm: "የቆዳ ስራ",
  },
  BAKERY: {
    code: "BAKERY",
    labelEn: "Bakery & Bread Making",
    labelAm: "የዳቦ መጋገር",
  },
  CHIPS_PRODUCTION: {
    code: "CHIPS_PRODUCTION",
    labelEn: "Potato Chips & Snack Making",
    labelAm: "ቺብስ ስራ",
  },
  HAIRDRESSING: {
    code: "HAIRDRESSING",
    labelEn: "Hairdressing & Barbering",
    labelAm: "ፀጉር ሙያ",
  },
  POULTRY_FARMING: {
    code: "POULTRY_FARMING",
    labelEn: "Poultry Farming",
    labelAm: "ዶሮ እርባታ",
  },
  SHEEP_REARING: {
    code: "SHEEP_REARING",
    labelEn: "Sheep / Livestock Rearing",
    labelAm: "በግ እርባታ",
  },
  URBAN_AGRICULTURE: {
    code: "URBAN_AGRICULTURE",
    labelEn: "Backyard Gardening / Urban Agriculture",
    labelAm: "የጓሮ አትክልት / ከተማ ግብርና",
  },
  OTHER: {
    code: "OTHER",
    labelEn: "Other",
    labelAm: "ሌሎች",
  },
  // Legacy mappings for backwards compatibility
  AGRICULTURE: {
    code: "AGRICULTURE",
    labelEn: "Agriculture",
    labelAm: "ግብርና",
  },
  BUSINESS: {
    code: "BUSINESS",
    labelEn: "Business",
    labelAm: "ንግድ",
  },
  HOTEL_HOSPITALITY: {
    code: "HOTEL_HOSPITALITY",
    labelEn: "Hotel & Hospitality",
    labelAm: "ሆቴልና መስተንግዶ",
  },
  HOUSE_CONSTRUCTION: {
    code: "HOUSE_CONSTRUCTION",
    labelEn: "House Construction",
    labelAm: "ቤት ግንባታ",
  },
  AUTOMOTIVE: {
    code: "AUTOMOTIVE",
    labelEn: "Automotive",
    labelAm: "አውቶሞቲቭ",
  },
  ELECTRICITY: {
    code: "ELECTRICITY",
    labelEn: "Electricity",
    labelAm: "ኤሌክትሪክ",
  },
  ICT: {
    code: "ICT",
    labelEn: "ICT",
    labelAm: "ኢንፎርሜሽን ቴክኖሎጂ",
  },
  MUNICIPALITY_ADMIN: {
    code: "MUNICIPALITY_ADMIN",
    labelEn: "Municipality Admin",
    labelAm: "ማዘጋጃ ቤት አስተዳደር",
  },
  ROAD_CONSTRUCTION: {
    code: "ROAD_CONSTRUCTION",
    labelEn: "Road Construction",
    labelAm: "መንገድ ግንባታ",
  },
  AGRO_PROCESSING: {
    code: "AGRO_PROCESSING",
    labelEn: "Agro Processing",
    labelAm: "ግብርና ማቀነባበሪያ",
  },
  FURNITURE_MAKING: {
    code: "FURNITURE_MAKING",
    labelEn: "Furniture Making",
    labelAm: "የእንጨትና ፈርኒቸር ስራ",
  },
  METAL_WORKING: {
    code: "METAL_WORKING",
    labelEn: "Metal Working",
    labelAm: "የብረታ ብረት ስራ",
  },
};

export function getWorkSectorOptions(beneficiaryType: "DISABLED" | "ELDERLY"): WorkSectorCode[] {
  return beneficiaryType === "DISABLED" ? DISABLED_WORK_SECTORS : ELDERLY_WORK_SECTORS;
}

export function getWorkSectorDisplayLabel(
  code: string | null | undefined,
  locale: "am" | "en" = "am"
): string {
  if (!code) return locale === "am" ? "ያልተመረጠ" : "None";
  const entry = WORK_SECTOR_REGISTRY[code];
  if (!entry) return code;
  return locale === "am" ? entry.labelAm : entry.labelEn;
}
