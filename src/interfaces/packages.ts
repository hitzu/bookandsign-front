import { GetBrandsResponse } from "./brands";
import { GetProductsResponse } from "./products";

export interface Package {
  id: number;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  discount: number | null;
  status: string;
  brandId: number;
}

export interface GetPackagesResponse {
  id: number;
  code: string;
  name: string;
  description: string;
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
