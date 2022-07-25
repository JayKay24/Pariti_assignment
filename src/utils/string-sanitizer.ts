/**
 * Convert the string to lowercase then remove beginning &
 * trailinig whitespace
 *
 * @param str
 * @returns sanitized string
 */
export function sanitizeString(str: string): string {
  return str.toLowerCase().trim();
}
