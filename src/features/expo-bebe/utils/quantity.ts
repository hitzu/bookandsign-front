export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 999;

/** Keeps a quantity inside the contract line-item range (integer, 1..999). */
export function clampQuantity(value: number): number {
  if (Number.isNaN(value)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(value)));
}
