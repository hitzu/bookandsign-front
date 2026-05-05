import { EventThemes } from "./eventThemes";

export interface SessionPhoto {
  url: string;
  position: number;
}

export interface SessionEventTheme extends EventThemes {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface SessionEventData {
  honoreesNames: string;
  date: string;
  albumPhrase?: string;
  albumPhase?: string;
  eventToken?: string;
  eventType?: string;
  eventTheme?: SessionEventTheme;
}

export interface SessionResponse {
  sessionToken: string;
  status: "active" | "complete";
  gifUrl?: string | null;
  photos: SessionPhoto[];
  event: SessionEventData;
}

export interface GallerySessionItem {
  sessionToken: string;
  coverPhoto: string;
  photoCount: number;
  time?: string;
}

export interface GalleryResponse {
  event: SessionEventData;
  sessions: GallerySessionItem[];
}
