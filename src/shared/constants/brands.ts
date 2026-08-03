/** Brand ids shared across features. */
export const LUSSO_BRAND_ID = 4;

/**
 * Brands whose events happen at the venue itself, so no transport fee is
 * quoted on top of the remaining balance.
 */
export const VENUE_ONLY_BRAND_IDS: number[] = [LUSSO_BRAND_ID];

/** True when the brand's events never incur a transport (traslado) fee. */
export const brandIncludesTransportFee = (
  brandId: number | null | undefined,
): boolean => !VENUE_ONLY_BRAND_IDS.includes(Number(brandId));
