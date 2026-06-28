import { Promotion } from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getPromotionsByBrandId = async ({
  brandId,
  status = "active",
}: {
  brandId?: number;
  status?: string;
}): Promise<Promotion[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (brandId) {
      queryParams.append("brandId", brandId.toString());
    }
    if (status) {
      queryParams.append("status", status);
    }

    const url = "/promotions" + (queryParams.toString() ? `?${queryParams.toString()}` : "");
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
};

export const getPromotions = async (): Promise<Promotion[]> => {
  try {
    const response = await axiosInstanceWithToken.get("/promotions");
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
};
