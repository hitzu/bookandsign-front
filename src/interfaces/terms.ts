import { GetPackagesResponse } from "./packages";

export interface Terms {
  id: number;
  code: string;
  title: string;
  content: string;
  scope: "global" | "package";
}

export interface GetTermsResponse {
  id: number;
  code: string;
  title: string;
  content: string;
  scope: "global" | "package";
  packageTerms?: GetPackageTermsResponse[];
}

export interface GetPackageTermsResponse {
  id: number;
  packageId: number;
  termId: number;
  package: Omit<GetPackagesResponse, "brand" | "packageProducts">;
}

export interface CreateTermPayload {
  scope: "global" | "package";
  title: string;
  content: string;
}

export interface UpdateTermsPayload {
  scope: "global" | "package";
  title: string;
  content: string;
}
