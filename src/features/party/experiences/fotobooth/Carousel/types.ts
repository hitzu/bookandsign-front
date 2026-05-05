import { EffectName, SessionItem } from "../../../types/session";

export type CtaSource = "download" | "share";

export type ItemStatus = "idle" | "loaded" | "error";

export type ItemLoadState = {
  status: ItemStatus;
  retryCount: number;
};

export type EffectOption = {
  id: EffectName;
  label: string;
};

export const EFFECT_OPTIONS: EffectOption[] = [
  { id: "original", label: "Original" },
  { id: "confetti", label: "Confeti" },
  { id: "hearts", label: "Corazones" },
];

export const buildFallbackItems = (photoUrls: string[]): SessionItem[] =>
  photoUrls.map((src, index) => ({
    type: "photo",
    src,
    alt: `Foto ${index + 1}`,
    index,
  }));
