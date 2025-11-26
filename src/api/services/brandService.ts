import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getBrands = async () => {
  try {
    const brands = await axiosInstanceWithToken.get("/brands");
    return brands.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};
