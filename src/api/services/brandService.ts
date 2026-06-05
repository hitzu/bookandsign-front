import { axiosInstanceWithToken } from "../config/axiosConfig";
import type { GetBrandByIdResponse, GetBrandsResponse } from "../../interfaces";

export const getBrands = async (): Promise<GetBrandsResponse[]> => {
  try {
    const brands = await axiosInstanceWithToken.get("/brands");
    return brands.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const getBrandById = async (
  id: number
): Promise<GetBrandByIdResponse> => {
  const response = await axiosInstanceWithToken.get(`/brands/${id}`);
  return response.data;
};
