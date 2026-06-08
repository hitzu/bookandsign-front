const BRAND_TINT_BY_ID: Record<number, string> = {
  1: "slotOcupBrand1",
  2: "slotOcupBrand2",
  3: "slotOcupBrand3",
  4: "slotOcupBrand4",
};

export const getOccupiedTintClass = (
  brandId: number | null | undefined,
): string => (brandId != null && BRAND_TINT_BY_ID[brandId]) || "slotOcupBrandDefault";
