/**
 * Phrase configs. TDD: use image assets, not fabric.Text.
 * Assets in /public/phrases/{id}.png when available.
 * TDD Iteración 3.
 */
export type PhraseConfig = {
  id: string;
  /** Image URL for phrase asset */
  imageUrl: string;
};

/** Phrase assets. Use /public/phrases/ when available; fallback to stickers for demo. */
export const PHRASES: PhraseConfig[] = [
  { id: "fanys-night", imageUrl: "/stickers/1.png" },
  { id: "best-night", imageUrl: "/stickers/2.png" },
  { id: "xv-party", imageUrl: "/stickers/3.png" },
  { id: "brilla-siempre", imageUrl: "/stickers/4.png" },
];
