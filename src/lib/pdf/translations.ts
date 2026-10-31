export const SUB_CITY_TRANSLATIONS_AM: Record<string, string> = {
  BOLE: "ቦሌ",
  LIDETA: "ልደታ",
  KIRKOS: "ቂርቆስ",
  YEKA: "የካ",
  ARADA: "አራዳ",
  ADDIS_KETEMA: "አዲስ ከተማ",
  ADDIS_KETEMA_SUB_CITY: "አዲስ ከተማ",
  AKAKI_KALITY: "አቃቂ ቃሊቲ",
  AKAKY_KALITI: "አቃቂ ቃሊቲ",
  GULLELE: "ጉለሌ",
  GULELE: "ጉለሌ",
  KOLFE_KERANIO: "ኮልፌ ቀራኒዮ",
  KOLFE_KERANYO: "ኮልፌ ቀራኒዮ",
  NIFAS_SILK_LAFTO: "ንፋስ ስልክ ላፍቶ",
  NEFAS_SILK_LAFTO: "ንፋስ ስልክ ላፍቶ",
  LEMI_KURA: "ለሚ ኩራ",
};

export const LEVEL_TRANSLATIONS_AM: Record<string, string> = {
  WOREDA: "ወረዳ",
  SUB_CITY: "ክፍለ ከተማ",
  SUBCITY: "ክፍለ ከተማ",
  CITY: "ከተማ",
};

export const STATUS_TRANSLATIONS_AM: Record<string, string> = {
  ACTIVE: "ንቁ",
  INACTIVE: "ቦዘኔ",
  EXPIRED: "ጊዜው ያለፈበት",
  REVOKED: "የታገደ",
  CANCELLED: "የተሰረዘ",
  PENDING: "በመጠባበቅ ላይ",
};

export const ROLE_TRANSLATIONS_AM: Record<string, string> = {
  CHAIRPERSON: "ሰብሳቢ",
  PRESIDENT: "ፕሬዚዳንት",
  VICE_CHAIRPERSON: "ምክትል ሰብሳቢ",
  VICE_PRESIDENT: "ምክትል ፕሬዚዳንት",
  SECRETARY: "ጸሐፊ",
  TREASURER: "ገንዘብ ያዥ",
  DEPUTY_TREASURER: "ምክትል ገንዘብ ያዥ",
  ACCOUNTANT: "ሒሳብ ሹም",
  DEPUTY_ACCOUNTANT: "ምክትል ሒሳብ ሹም",
  AUDITOR: "ኦዲተር",
  STOREKEEPER: "ንብረት ክፍል",
  GUARD: "ጥበቃ",
  LEADER: "ሊቀመንበር",
  DEPUTY_LEADER: "ምክትል ሊቀመንበር",
  MEMBER: "አባል",
};

export const EDIR_TYPE_TRANSLATIONS_AM: Record<string, string> = {
  COMMUNITY: "ማኅበረሰብ",
  WOMENS: "የሴቶች",
  WOMEN: "የሴቶች",
  WORKPLACE: "የሥራ ቦታ",
  INSTITUTIONAL: "ተቋማዊ",
  SPECIALIZED: "ልዩ",
  TRADITIONAL: "ባህላዊ",
  DEVELOPMENT: "ልማት",
};

export const TENURE_TRANSLATIONS_AM: Record<string, string> = {
  OWNED_WITH_TITLE_DEED: "የባለቤትነት ካርታ ያለው",
  KEBELE_LEASE: "የቀበሌ ኪራይ",
  TEMPORARY_PERMIT: "ጊዜያዊ ፈቃድ",
  NO_PREMISES: "መነሻ ቦታ የሌለው",
  OWNED: "የግል",
  RENTED: "የተከራየ",
  COMMUNAL: "የጋራ",
  FREE_USE: "ከክፍያ ነፃ",
  MUNICIPAL_ALLOCATED: "በማዘጋጃ ቤት የተሰጠ",
};

export function translateSubCity(subCity?: string | null, isAm = true): string {
  if (!subCity) return "";
  if (!isAm) return subCity;
  const normalized = subCity.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return SUB_CITY_TRANSLATIONS_AM[normalized] || subCity;
}

export function formatWoreda(woreda?: string | number | null, isAm = true): string {
  if (woreda === null || woreda === undefined || woreda === "") return "";
  const str = String(woreda).trim();
  const digits = str.match(/\d+/);
  if (digits) {
    const num = digits[0].padStart(2, "0");
    return isAm ? `ወረዳ ${num}` : `Woreda ${num}`;
  }
  return str;
}

export function translateLevel(level?: string | null, isAm = true): string {
  if (!level) return "";
  if (!isAm) return level;
  const normalized = level.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return LEVEL_TRANSLATIONS_AM[normalized] || level;
}

export function translateStatus(status?: string | null, isAm = true): string {
  if (!status) return "";
  if (!isAm) return status;
  const normalized = status.trim().toUpperCase();
  return STATUS_TRANSLATIONS_AM[normalized] || status;
}

export function translateRole(role?: string | null, isAm = true): string {
  if (!role) return "";
  if (!isAm) return role;
  const normalized = role.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return ROLE_TRANSLATIONS_AM[normalized] || role;
}
