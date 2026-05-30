import { EventThemes } from "./eventThemes";

export interface EventPrintTemplate {
  type: string;
  template: string;
  icon?: string;
  border?: string;
}

export interface GetEventServiceTypesResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  rank: number;
}

export interface Event {
  id: number;
  name?: string;
  key: string;
  description?: string;
  token: string;
  contractId: number;
  eventTypeId: number;
  eventThemeId?: number;
  honoreesNames: string;
  albumPhrase: string;
  venueName?: string;
  serviceLocationUrl?: string;
  serviceStartsAt?: string;
  serviceEndsAt?: string;
  delegateName?: string;
  photoCount?: number;
  serviceTypeId?: number;
  serviceType?: string;
  printTemplates?: EventPrintTemplate[];
  createdAt: string;
  updatedAt: string;
  eventTheme?: EventThemes;
}

export interface CreateEventPayload {
  contractId: number;
  key: string;
  eventTypeId: number;
  serviceTypeId: number;
  eventThemeId?: number;
  honoreesNames: string;
  albumPhrase: string;
  venueName?: string;
  serviceLocationUrl?: string;
  serviceStartsAt?: string;
  serviceEndsAt?: string;
  delegateName?: string;
  photoCount?: number;
  printTemplates?: EventPrintTemplate[];
}

export interface UpdateEventPayload {
  key?: string;
  eventTypeId?: number;
  serviceTypeId?: number;
  eventThemeId?: number;
  honoreesNames?: string;
  albumPhrase?: string;
  venueName?: string;
  serviceLocationUrl?: string;
  serviceStartsAt?: string;
  serviceEndsAt?: string;
  delegateName?: string;
  photoCount?: number;
  printTemplates?: EventPrintTemplate[];
}

export type EventPhraseResponse = {
  id: number;
  content: string;
};
