import {
  EventPhoto,
  EventPhotosPage,
  EventPhotosPageResponse,
  EventPhotoResponse,
  PublicEvent,
  PublicEventResponse,
  EventPhraseResponse,
  GalleryResponse,
  SessionResponse
} from "../../interfaces";
import { axiosInstanceWithoutToken } from "../config/axiosConfig";

const normalizePublicEvent = (
  token: string,
  payload?: PublicEventResponse,
): PublicEvent => ({
  id: payload?.id,
  token: payload?.token || token,
  name: payload?.honoreesNames,
  description: payload?.albumPhrase,
  createdAt: payload?.createdAt,
  updatedAt: payload?.updatedAt,
});

export const getPublicEventByToken = async (
  token: string,
): Promise<PublicEvent> => {
  const normalizedToken = encodeURIComponent(token);
  const candidates = [`/events/${normalizedToken}`];

  for (const candidate of candidates) {
    try {
      const response = await axiosInstanceWithoutToken.get<PublicEventResponse>(
        candidate,
      );
      return normalizePublicEvent(token, response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) continue;
      throw error;
    }
  }

  return normalizePublicEvent(token);
};

type EventPhotosPageParams = {
  limit?: number;
  cursor?: string | null;
  signal?: AbortSignal;
};

export const getEventPhotosPage = async (
  token: string,
  params: EventPhotosPageParams = {},
): Promise<EventPhotosPage> => {
  const { limit = 60, cursor, signal } = params;
  const normalizedToken = encodeURIComponent(token);
  const response = await axiosInstanceWithoutToken.get<
    EventPhotoResponse[] | EventPhotosPageResponse
  >(`/photos/event/${normalizedToken}`, {
    signal,
    params: {
      limit,
      ...(cursor ? { cursor } : {}),
    },
  });

  const payload = response.data;
  const normalizedPayload = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && "data" in payload
      ? (payload as { data?: EventPhotosPageResponse }).data || payload
      : payload;

  if (Array.isArray(normalizedPayload)) {
    return {
      items: normalizedPayload,
      hasMore: false,
      nextCursor: null,
    };
  }

  const items = Array.isArray(normalizedPayload.items)
    ? normalizedPayload.items
    : [];
  return {
    event: normalizedPayload.event
      ? normalizePublicEvent(token, normalizedPayload.event)
      : undefined,
    items,
    hasMore: Boolean(normalizedPayload.hasMore),
    nextCursor: normalizedPayload.nextCursor || null,
  };
};



export const getEventPhrases = async (
  token: string,
  signal?: AbortSignal,
): Promise<EventPhraseResponse[]> => {
  const normalizedToken = encodeURIComponent(token);
  const response = await axiosInstanceWithoutToken.get<EventPhraseResponse[]>(
    `/events/phrases/${normalizedToken}`,
    { signal },
  );
  return response.data;
};

export const getPublicPhotosByEventToken = async (
  token: string,
  signal?: AbortSignal,
): Promise<EventPhoto[]> => {
  const response = await getEventPhotosPage(token, {
    limit: 200,
    signal,
  });
  return response.items;
};


export const getEventGalleryV2 = async (
  token: string,
): Promise<GalleryResponse> => {
  const normalizedToken = encodeURIComponent(token);

  const response = await axiosInstanceWithoutToken.get<GalleryResponse>(
    `/sessions/gallery/${normalizedToken}`,
  );

  return response.data
};

export const getEventGallerySessionV2 = async (
  token: string,
): Promise<SessionResponse> => {
  const normalizedToken = encodeURIComponent(token);

  const response = await axiosInstanceWithoutToken.get<SessionResponse>(
    `/sessions/${normalizedToken}`,
  );

  return response.data;
};

