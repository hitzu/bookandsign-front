import { GetEventServiceTypesResponse } from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getEventServiceTypes = async (): Promise<
  GetEventServiceTypesResponse[]
> => {
  try {
    const response = await axiosInstanceWithToken.get("events/service-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching event service types:", error);
    throw error;
  }
};
