import { CreatePaymentPayload, Payment } from "../../interfaces";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const createPayment = async (
  payload: CreatePaymentPayload
): Promise<Payment> => {
  try {
    const contractId = payload.contractId;
    const response = await axiosInstanceWithToken.post<Payment>(
      `/contracts/${contractId}/payments`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const getPayments = async (
  slotId: number,
  scope: string
): Promise<Payment[]> => {
  try {
    const response = await axiosInstanceWithToken.get<Payment[]>(
      `/notes/${scope}/${slotId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};
