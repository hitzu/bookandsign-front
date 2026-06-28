export interface PromotionTier {
  order: number;
  discountPercentage: number;
}

export interface PromotionPackage {
  packageId: number;
  packageName: string;
  tiers: PromotionTier[];
}

export interface Promotion {
  id: number;
  brandId: number;
  name: string;
  status: string;
  /** Flat discount applied to packages of this brand. */
  type: "percentage" | "fixed";
  value: number;
  /** Per-package tiered discount applied to extras, by order added. Not present on the lightweight promotion summary nested in contract responses. */
  packages?: PromotionPackage[];
}
