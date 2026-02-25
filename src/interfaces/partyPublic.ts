export interface PublicEvent {
  token: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventPhoto {
  id: number;
  storagePath: string;
  publicUrl: string;
  consentAt: string;
  createdAt: string;
}
export interface PublicEventResponse {
  id?: number;
  token?: string;
  name?: string;
  title?: string;
  eventName?: string;
  description?: string;
  cover_url?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
