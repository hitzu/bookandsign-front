export type SessionItem = {
  type: "gif" | "photo";
  src: string;
  alt: string;
  index: number;
  photoPosition?: number;
};

export type EffectName = "original" | "confetti" | "hearts";

export type ExportVariant = "original" | "polaroid";
