import {
  Contract,
  GenerateContractPayload,
  GetContractByIdResponse,
} from "../../interfaces";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getContractById = async (
  id: number
): Promise<GetContractByIdResponse> => {
  try {
    const url = `/contracts/${id}`;
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching contract:", error);
    throw error;
  }
};

export const generateContract = async (
  payload: GenerateContractPayload
): Promise<Contract> => {
  try {
    const response = await axiosInstanceWithToken.post<Contract>(
      `/contracts`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error generating contract:", error);
    throw error;
  }
};
