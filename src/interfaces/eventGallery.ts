import { EventThemes } from "./eventThemes";

export interface SessionPhoto {
  url: string;
  position: number;
}

export interface SessionEventData {
  honoreesNames: string;
  date: string;
  albumPhrase?: string;
  albumPhase?: string;
  eventToken?: string;
  eventType?: string;
  eventTheme?: EventThemes
}

export interface SessionResponse {
  sessionToken: string;
  status: 'active' | 'complete';
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
