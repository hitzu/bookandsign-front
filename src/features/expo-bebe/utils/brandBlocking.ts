/**
 * Brand availability rule.
 *
 * Business rule: a brand is offered at most once per calendar month. If a month
 * already has an event booked for a given brand, that brand can no longer be
 * offered for that month. The primary case is Lusso (brand id 4): once a month
 * has a Lusso event, Lusso is no longer offered that month.
 */

export const LUSSO_BRAND_ID = 4;

/**
 * Returns true when the brand already has an event booked in the month and can
 * no longer be offered. `bookedBrandIds` is the set of brand ids with at least
 * one event in the target month (provided by the backend). When the data is
 * missing (null/undefined), the brand is treated as available so the UI never
 * blocks on incomplete data.
 */
export const isBrandBlockedForMonth = (
  bookedBrandIds: number[] | null | undefined,
  brandId: number,
): boolean => {
  if (!bookedBrandIds || bookedBrandIds.length === 0) return false;
  return bookedBrandIds.includes(brandId);
};

/** Discreet message shown when Lusso is no longer offerable for the month. */
export const brandBlockedMessage = (brandName: string) =>
  `${brandName} ya no está disponible para este mes.`;
