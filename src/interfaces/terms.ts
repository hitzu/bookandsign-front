import { GetBrandsResponse } from "./brands";
import { GetPackagesResponse } from "./packages";

export type TermScope = "global" | "package" | "brand";

export interface Terms {
  id: number;
  code: string;
  title: string;
  content: string;
  scope: TermScope;
}

export interface GetTermsResponse {
  id: number;
  code: string;
  title: string;
  content: string;
  scope: TermScope;
  packageTerms?: GetPackageTermsResponse[];
  brandTerms?: GetBrandTermsResponse[];
}

export interface GetPackageTermsResponse {
  id: number;
  packageId: number;
  termId: number;
  package: Omit<GetPackagesResponse, "brand" | "packageProducts">;
}

export interface GetBrandTermsResponse {
  id: number;
  brandId: number;
  termId: number;
  brand: GetBrandsResponse;
}

export interface CreateTermPayload {
  scope: TermScope;
  title: string;
  content: string;
}

export interface UpdateTermsPayload {
  scope: TermScope;
  title: string;
  content: string;
}
