import { EventThemes } from "./eventThemes";

export interface Event {
  id: number;
  name: string;
  key: string;
  description: string;
  token: string;
  contractId: number;
  eventTypeId: number;
  eventThemeId?: number;
  honoreesNames: string;
  albumPhrase: string;
  venueName: string;
  serviceLocationUrl: string;
  serviceStartsAt: string;
  serviceEndsAt: string;
  delegateName: string;
  photoCount?: number;
  printTemplate?: string;
  decorativeIcon?: string;
  createdAt: string;
  updatedAt: string;
  eventTheme?: EventThemes;
}

export interface CreateEventPayload {
  contractId: number;
  name: string;
  description: string;
  key: string;
  eventTypeId: number;
  eventThemeId?: number;
  honoreesNames: string;
  albumPhrase: string;
  venueName: string;
  serviceLocationUrl: string;
  serviceStartsAt: string;
  serviceEndsAt: string;
  delegateName: string;
  photoCount?: number;
  printTemplate?: string;
  decorativeIcon?: string;
}

export interface UpdateEventPayload {
  name?: string;
  description?: string;
  key?: string;
  eventTypeId?: number;
  eventThemeId?: number;
  honoreesNames?: string;
  albumPhrase?: string;
  venueName?: string;
  serviceLocationUrl?: string;
  serviceStartsAt?: string;
  serviceEndsAt?: string;
  delegateName?: string;
  photoCount?: number;
  printTemplate?: string;
  decorativeIcon?: string;
}

export type EventPhraseResponse = {
  id: number;
  content: string;
};