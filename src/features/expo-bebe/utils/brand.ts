import type { ExpoBebeBrandKey } from "../types";

export const DEFAULT_EXPO_BEBE_BRAND: ExpoBebeBrandKey = "lusso";

const BRAND_ID_MAP: Record<ExpoBebeBrandKey, number> = {
  lusso: 4,
  photobooth: 3,
};

const BRAND_KEY_BY_ID: Record<number, ExpoBebeBrandKey> = {
  4: "lusso",
  3: "photobooth",
};

export const getBrandId = (brand: ExpoBebeBrandKey): number =>
  BRAND_ID_MAP[brand];

export const getBrandKeyById = (id: number): ExpoBebeBrandKey =>
  BRAND_KEY_BY_ID[id] ?? DEFAULT_EXPO_BEBE_BRAND;

export const isExpoBebeBrandKey = (
  value: unknown
): value is ExpoBebeBrandKey =>
  value === "lusso" || value === "photobooth";

export const parseExpoBebeBrand = (value: unknown): ExpoBebeBrandKey => {
  if (Array.isArray(value)) return parseExpoBebeBrand(value[0]);
  if (typeof value !== "string") return DEFAULT_EXPO_BEBE_BRAND;

  const normalized = value.trim().toLowerCase();
  return isExpoBebeBrandKey(normalized)
    ? normalized
    : DEFAULT_EXPO_BEBE_BRAND;
};
