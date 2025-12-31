import {
  CreatePackagePayload,
  GetPackagesResponse,
  UpdatePackagePayload,
} from "../../interfaces/packages";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getPackages = async ({
  brandId,
  term,
}: {
  brandId?: number;
  term?: string;
}): Promise<GetPackagesResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (brandId) {
      queryParams.append("brandId", brandId.toString());
    }
    if (term) {
      queryParams.append("term", term);
    }
    const url =
      "/packages" + (brandId || term ? `?${queryParams.toString()}` : "");
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const deletePackageById = async (id: number): Promise<void> => {
  try {
    await axiosInstanceWithToken.delete(`/packages/${id}`);
  } catch (error) {
    console.error("Error deleting package by id:", error);
    throw error;
  }
};

export const updatePackageById = async (
  id: number,
  payload: UpdatePackagePayload
): Promise<void> => {
  try {
    await axiosInstanceWithToken.patch(`/packages/${id}`, payload);
  } catch (error) {
    console.error("Error updating package by id:", error);
    throw error;
  }
};

export const getPackageById = async (
  id: number
): Promise<GetPackagesResponse> => {
  try {
    const response = await axiosInstanceWithToken.get<GetPackagesResponse>(
      `/packages/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package by id:", error);
    throw error;
  }
};

export const getPackagesStatuses = async (): Promise<string[]> => {
  try {
    const response = await axiosInstanceWithToken.get<string[]>(
      "/packages/statuses"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching packages statuses:", error);
    throw error;
  }
};

export const uploadProductsBulk = async (
  id: number,
  products: number[]
): Promise<void> => {
  try {
    const payload = {
      products: products.map((productId) => ({
        productId,
        quantity: 1,
      })),
    };
    await axiosInstanceWithToken.post(`/packages/${id}/products/bulk`, payload);
  } catch (error) {
    console.error("Error uploading products:", error);
    throw error;
  }
};

export const createPackage = async (
  payload: CreatePackagePayload
): Promise<GetPackagesResponse> => {
  try {
    const response = await axiosInstanceWithToken.post<GetPackagesResponse>(
      "/packages",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};
