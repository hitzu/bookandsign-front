export interface PublicEvent {
  token: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
