export interface PublicEvent {
  token: string;
  name?: string;
}

export interface EventPhoto {
  id: number;
  storagePath: string;
  publicUrl: string;
  consentAt: string;
  createdAt: string;
}
export interface PublicEventResponse {
  name?: string;
  title?: string;
  eventName?: string;
}

export interface EventPhotoResponse {
  id: number;
  storagePath: string;
  publicUrl: string;
  consentAt: string;
  createdAt: string;
}
