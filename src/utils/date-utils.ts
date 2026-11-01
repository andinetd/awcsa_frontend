/**
 * Date and Month translation utilities for Addis Ababa Women, Children & Social Affairs
 */

export const AMHARIC_MONTHS = [
  "ጥር", // 0: January
  "የካቲት", // 1: February
  "መጋቢት", // 2: March
  "ሚያዝያ", // 3: April
  "ግንቦት", // 4: May
  "ሰኔ", // 5: June
  "ሐምሌ", // 6: July
  "ነሐሴ", // 7: August
  "መስከረም", // 8: September
  "ጥቅምት", // 9: October
  "ህዳር", // 10: November
  "ታህሳስ", // 11: December
] as const;

export const ENGLISH_MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const ENGLISH_MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_NAME_MAP: Record<string, string> = {
  jan: "ጥር",
  january: "ጥር",
  feb: "የካቲት",
  february: "የካቲት",
  mar: "መጋቢት",
  march: "መጋቢት",
  apr: "ሚያዝያ",
  april: "ሚያዝያ",
  may: "ግንቦት",
  jun: "ሰኔ",
  june: "ሰኔ",
  jul: "ሐምሌ",
  july: "ሐምሌ",
  aug: "ነሐሴ",
  august: "ነሐሴ",
  sep: "መስከረም",
  sept: "መስከረም",
  september: "መስከረም",
  oct: "ጥቅምት",
  october: "ጥቅምት",
  nov: "ህዳር",
  november: "ህዳር",
  dec: "ታህሳስ",
  december: "ታህሳስ",
};

/**
 * Returns translated month name given a 0-indexed month number (0 = Jan, 11 = Dec)
 */
export function getMonthName(monthIndex: number, isAm: boolean): string {
  const normalizedIndex = ((monthIndex % 12) + 12) % 12;
  return isAm
    ? AMHARIC_MONTHS[normalizedIndex]
    : ENGLISH_MONTHS_SHORT[normalizedIndex];
}

/**
 * Translates any month string or number to actual Amharic or English
 */
export function translateMonth(
  val: string | number | undefined | null,
  isAm: boolean
): string {
  if (val === undefined || val === null || val === "") return "";

  if (typeof val === "number") {
    // Determine whether 1-based (1..12) or 0-based (0..11)
    const idx = val >= 1 && val <= 12 ? val - 1 : val;
    return getMonthName(idx, isAm);
  }

  const str = String(val).trim();

  // If numeric string
  const num = parseInt(str, 10);
  if (!isNaN(num) && String(num) === str) {
    const idx = num >= 1 && num <= 12 ? num - 1 : num;
    return getMonthName(idx, isAm);
  }

  if (!isAm) return str;

  // Look up lowercase month string
  const lower = str.toLowerCase();
  if (MONTH_NAME_MAP[lower]) {
    return MONTH_NAME_MAP[lower];
  }

  // Handle strings like "2026-04" or "2026-04-12"
  if (/^\d{4}-\d{2}/.test(str)) {
    const monthNum = parseInt(str.substring(5, 7), 10);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      return AMHARIC_MONTHS[monthNum - 1];
    }
  }

  // Check prefix matches e.g. "January 2026" or "Apr 2026"
  for (const [key, amharic] of Object.entries(MONTH_NAME_MAP)) {
    if (lower.startsWith(key)) {
      return str.replace(new RegExp(`^${key}\\w*`, "i"), amharic);
    }
  }

  return str;
}

/**
 * Formats a date into a localized date string with actual Amharic month names
 */
export function formatLocalizedDate(date: Date, isAm: boolean): string {
  if (isNaN(date.getTime())) return "";
  if (isAm) {
    const day = date.getDate();
    const month = AMHARIC_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}፣ ${year}`;
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

