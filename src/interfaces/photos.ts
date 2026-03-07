import type { PublicEvent, PublicEventResponse } from "./partyPublic";

export interface EventPhoto {
  id: number;
  storagePath: string;
  publicUrl: string;
  consentAt: string;
  createdAt: string;
}

export interface EventPhotoResponse {
  id: number;
  storagePath: string;
  publicUrl: string;
  consentAt: string;
  createdAt: string;
}

export interface EventPhotosPageResponse {
  event?: PublicEventResponse;
  items?: EventPhotoResponse[];
  hasMore?: boolean;
  nextCursor?: string | null;
}

export interface EventPhotosPage {
  event?: PublicEvent;
  items: EventPhoto[];
  hasMore: boolean;
  nextCursor: string | null;
}
