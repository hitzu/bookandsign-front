import { Promotion } from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getPromotionsByBrandId = async ({
  brandId,
}: {
  brandId?: number;
}): Promise<Promotion[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (brandId) {
      queryParams.append("brandId", brandId.toString());
    }

    const url = "/promotions" + (brandId ? `?${queryParams.toString()}` : "");
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
};
