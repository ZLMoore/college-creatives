/**
 * Format check: hostname must sit under `.edu` (e.g. name@school.edu).
 * Does not prove enrollment or that the inbox exists.
 */
export function isEduEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized || /\s/.test(normalized)) return false;
  const at = normalized.lastIndexOf("@");
  if (at < 1 || at === normalized.length - 1) return false;
  const domain = normalized.slice(at + 1);
  if (!domain || domain.startsWith(".") || domain.endsWith(".") || !domain.includes(".")) return false;
  if (domain.includes("..")) return false;
  return domain.endsWith(".edu");
}

/** Use on `<input type="email" pattern={EDU_EMAIL_HTML_PATTERN} />`; keep in sync with {@link isEduEmail}. */
export const EDU_EMAIL_HTML_PATTERN = "[^\\s@]+@[^\\s@]+\\.edu";
