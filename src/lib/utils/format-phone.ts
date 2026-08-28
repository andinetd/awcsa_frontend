// Mirrored in /awcsa/src/modules/women/utils/format-phone.ts — keep in sync.

/**
 * Group Ethiopian phone numbers with spaces so that downstream
 * word-wrappers (e.g. the printable association form's `wrapText` in
 * `fill-association-form.ts`) have legal break points.
 *
 * Returns an empty string for falsy / whitespace-only input.
 *
 * Test vectors:
 *   "0911234567"            -> "091 123 4567"        (local 10-digit)
 *   "091-123-4567"          -> "091 123 4567"        (idempotent)
 *   "091 123 4567"          -> "091 123 4567"        (idempotent)
 *   "911234567"             -> "91 123 4567"         (local 9-digit, no leading 0)
 *   "+251911234567"         -> "+251 91 123 4567"    (12-digit intl)
 *   "+251 91 123 4567"      -> "+251 91 123 4567"    (idempotent)
 *   "251911234567"          -> "+251 91 123 4567"    (normalised)
 *   ""                      -> ""
 *   null / undefined        -> ""
 *   "-"                     -> "-"
 */
export function formatPhone(raw: string | null | undefined): string {
  if (raw === null || raw === undefined) {
    return "";
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }

  if (digits.length === 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }

  if (digits.length === 12 && digits.startsWith("251")) {
    return `+251 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)}`;
  }

  if (digits.length === 12 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 12)}`;
  }

  return trimmed;
}
