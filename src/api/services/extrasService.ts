import { CreateExtraPayload, Extra, UpdateExtraPayload } from "../../interfaces/extras";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getExtras = async ({
  brandId,
  term,
}: {
  brandId?: number;
  term?: string;
}): Promise<Extra[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (brandId) {
      queryParams.append("brandId", brandId.toString());
    }
    if (term) {
      queryParams.append("term", term);
    }
    const url =
      "/extras" + (brandId || term ? `?${queryParams.toString()}` : "");
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching extras:", error);
    throw error;
  }
};

export const getExtraById = async (id: number): Promise<Extra> => {
  try {
    const response = await axiosInstanceWithToken.get<Extra>(`/extras/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching extra by id:", error);
    throw error;
  }
};

export const getExtrasStatuses = async (): Promise<string[]> => {
  try {
    const response = await axiosInstanceWithToken.get<string[]>(
      "/extras/statuses"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching extras statuses:", error);
    throw error;
  }
};

export const createExtra = async (
  payload: CreateExtraPayload
): Promise<Extra> => {
  try {
    const response = await axiosInstanceWithToken.post<Extra>(
      "/extras",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating extra:", error);
    throw error;
  }
};

export const updateExtraById = async (
  id: number,
  payload: UpdateExtraPayload
): Promise<void> => {
  try {
    await axiosInstanceWithToken.patch(`/extras/${id}`, payload);
  } catch (error) {
    console.error("Error updating extra by id:", error);
    throw error;
  }
};

export const deleteExtraById = async (id: number): Promise<void> => {
  try {
    await axiosInstanceWithToken.delete(`/extras/${id}`);
  } catch (error) {
    console.error("Error deleting extra by id:", error);
    throw error;
  }
};
