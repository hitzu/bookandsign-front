export type SessionItem = {
  type: "photo";
  /** Display URL — coalesced (`minimizedUrl || url`). Never hides a photo. */
  src: string;
  /** Always the original, full-quality URL. Use for downloads/share/export. */
  originalSrc: string;
  alt: string;
  index: number;
  photoPosition?: number;
};

export type EffectName = "original" | "confetti" | "hearts";

export type ExportVariant = "original" | "polaroid";
