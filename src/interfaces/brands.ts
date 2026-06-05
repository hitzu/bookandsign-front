export interface BrandTheme {
  primaryColor?: string;
  secondaryColor?: string;
}

export interface GetBrandsResponse {
  id: number;
  key: string;
  name: string;
  logoUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  theme: BrandTheme | null;
  minAmountHoldSlot: number | null;
}

export interface GetBrandByIdResponse {
  id: number;
  name: string;
  logoUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  expoMonthlyRiskEnabled: boolean;
  minAmountHoldSlot: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
