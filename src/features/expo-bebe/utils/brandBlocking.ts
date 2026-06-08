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
 * Brands that occupy the whole venue for the day. If either slot of a day is
 * booked by one of these brands, the sibling slot must also render as occupied
 * — even if the API still reports it as available — because the venue is
 * physically unavailable for the rest of the day.
 */
export const WHOLE_DAY_BLOCKING_BRAND_IDS: number[] = [LUSSO_BRAND_ID];

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
