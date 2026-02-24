import {
  EventPhoto,
  EventPhotoResponse,
  PublicEvent,
  PublicEventResponse,
} from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

export const getPublicEventByToken = async (
  token: string,
): Promise<PublicEvent> => {
  const normalizedToken = encodeURIComponent(token);
  const candidates = [
    `/events/get-by-token/${normalizedToken}`,
    `/events/public/${normalizedToken}`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await axiosInstanceWithoutToken.get<PublicEventResponse>(
        candidate,
      );
      return {
        token,
        name:
          response.data?.name ||
          response.data?.title ||
          response.data?.eventName ||
          "Experiencia Brillipoint",
      };
    } catch (error: any) {
      if (error?.response?.status === 404) continue;
      throw error;
    }
  }

  return { token, name: "Experiencia Brillipoint" };
};

export const getPublicPhotosByEventToken = async (
  token: string,
  signal?: AbortSignal,
): Promise<EventPhoto[]> => {
  const normalizedToken = encodeURIComponent(token);
  const response = await axiosInstanceWithoutToken.get<EventPhotoResponse[]>(
    `/photos/event/${normalizedToken}`,
    { signal },
  );
  return response.data;
};
