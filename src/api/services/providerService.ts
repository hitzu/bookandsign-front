import {
  CreateProviderPayload,
  Provider,
  UpdateProviderPayload,
} from "../../interfaces";
import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getProviders = async (): Promise<Provider[]> => {
  try {
    const response = await axiosInstanceWithToken.get(`/providers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
};

export const createProvider = async (
  payload: CreateProviderPayload
): Promise<void> => {
  try {
    await axiosInstanceWithToken.post("/providers", payload);
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};

export const getProviderById = async (id: number): Promise<Provider> => {
  try {
    const response = await axiosInstanceWithToken.get<Provider>(
      `/providers/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching provider by id:", error);
    throw error;
  }
};

export const updateProviderById = async (
  id: number,
  payload: UpdateProviderPayload
): Promise<void> => {
  try {
    await axiosInstanceWithToken.patch(`/providers/${id}`, payload);
  } catch (error) {
    console.error("Error updating provider by id:", error);
    throw error;
  }
};

export const deleteProviderById = async (id: number): Promise<void> => {
  try {
    await axiosInstanceWithToken.delete(`/providers/${id}`);
  } catch (error) {
    console.error("Error deleting provider by id:", error);
    throw error;
  }
};
