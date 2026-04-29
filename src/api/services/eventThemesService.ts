import { EventThemes } from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getEventThemes = async (): Promise<EventThemes[]> => {
  try {
    const response = await axiosInstanceWithToken.get("events/themes");
    return response.data;
  } catch (error) {
    console.error("Error fetching event themes:", error);
    throw error;
  }
};
