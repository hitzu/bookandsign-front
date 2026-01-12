import { GetBrandsResponse } from "./brands";
import { GetProductsResponse } from "./products";
import { GetPackageTermsResponse, Terms } from "./terms";

export interface Package {
  id: number;
  name: string;
  brandId: number;
  packages: GetPackagesResponse[];
  packageProducts: GetPackageProductsResponse[];
  terms?: Terms[];
}

export interface GetPackagesResponse {
  id: number;
  name: string;
  basePrice: number;
  discount: number | null;
  status: string;
  brandId: number;
  brand: GetBrandsResponse;
  packageProducts: GetPackageProductsResponse[];
}

export interface GetPackageProductsResponse {
  id: number;
  packageId: number;
  productId: number;
  product: Omit<GetProductsResponse, "brand">;
  quantity: number;
}

export interface CreatePackagePayload {
  name: string;
  description: string;
  basePrice: number;
  discount: number | null;
  status: string;
  brandId: number;
}

export interface UpdatePackagePayload extends CreatePackagePayload {}
