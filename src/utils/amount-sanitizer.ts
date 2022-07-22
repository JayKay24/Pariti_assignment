/**
 * Remove the fractional part of the number
 * @param amount
 * @returns integer
 */
export function sanitizeAmount(amount: number): number {
  return Math.trunc(amount);
}
