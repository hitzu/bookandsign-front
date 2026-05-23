import { EventThemes } from "./eventThemes";

export const EVENT_ACCESS_STATUS = {
  ACTIVE: "active",
  COMPLETE: "complete",
  FINISHED: "finished",
  FINALIZED: "finalized",
} as const;

export type GalleryStatus =
  | typeof EVENT_ACCESS_STATUS.ACTIVE
  | typeof EVENT_ACCESS_STATUS.FINISHED
  | typeof EVENT_ACCESS_STATUS.FINALIZED;

export type SessionStatus = GalleryStatus | typeof EVENT_ACCESS_STATUS.COMPLETE;

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
  status?: GalleryStatus;
}

export interface SessionResponse {
  sessionToken: string;
  status: SessionStatus;
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
