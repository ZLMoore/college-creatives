/** Returns true if the email's domain is a .edu address (e.g. name@school.edu). */
export function isEduEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at < 1 || at === normalized.length - 1) return false;
  const domain = normalized.slice(at + 1);
  return domain === "edu" || domain.endsWith(".edu");
}
