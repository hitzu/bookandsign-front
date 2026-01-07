import { GetSlotResponse, Slot } from "../../interfaces";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const getSlots = async (date: string): Promise<GetSlotResponse[]> => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("date", date);

    const url = `/slots?${queryParams.toString()}`;
    const response = await axiosInstanceWithToken.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
};

export const holdSlot = async (payload: {
  eventDate: string;
  period: string;
  leadName: string;
  leadEmail: string | null;
  leadPhone: string | null;
}) => {
  try {
    const response = await axiosInstanceWithToken.post(`/slots/hold`, payload);
    return response.data;
  } catch (error) {
    console.error("Error holding slot:", error);
    throw error;
  }
};

export const cancelHoldSlot = async (slotId: number) => {
  try {
    const response = await axiosInstanceWithToken.delete(`/slots/${slotId}`);
    return response.data;
  } catch (error) {
    console.error("Error canceling hold slot:", error);
    throw error;
  }
};

export const getSlotById = async (slotId: number): Promise<Slot> => {
  try {
    const response = await axiosInstanceWithToken.get(`/slots/${slotId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slot by id:", error);
    throw error;
  }
};

export const updateLeadInfo = async (
  slotId: number,
  payload: {
    leadName?: string;
    leadEmail?: string;
    leadPhone?: string;
  }
) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `/slots/${slotId}/lead-info`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating lead info:", error);
    throw error;
  }
};

export const bookSlot = async ({
  slotId,
  contractId,
}: {
  slotId: number;
  contractId: number;
}) => {
  try {
    const response = await axiosInstanceWithToken.patch(
      `/slots/${slotId}/book`,
      {
        contractId: contractId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error booking slot:", error);
    throw error;
  }
};
