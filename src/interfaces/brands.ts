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
}
