/**
 * Stickers públicos en Supabase Storage: media/stickers/{id}.png
 *
 * Opcional: NEXT_PUBLIC_STICKER_BASE_URL (sin barra final), mismo path que el defecto.
 * TDD Iteración 2.
 */

const DEFAULT_STICKER_BASE =
  "https://uljzbxuxzknilubykrlw.supabase.co/storage/v1/object/public/media/stickers";

const stickerBaseUrl = (
  process.env.NEXT_PUBLIC_STICKER_BASE_URL ?? DEFAULT_STICKER_BASE
).replace(/\/$/, "");

const STICKER_RANGE_END = 124;

function parseStickerBlacklist(): Set<number> {
  return new Set([6]);
}

const stickerBlacklist = parseStickerBlacklist();

/** IDs 1–124 en el bucket, excluyendo los de NEXT_PUBLIC_STICKER_BLACKLIST_IDS (ej. "6,12,99") */
export const STICKER_IDS: number[] = Array.from(
  { length: STICKER_RANGE_END },
  (_, i) => i + 1,
).filter((id) => !stickerBlacklist.has(id));

export const getStickerUrl = (id: number): string =>
  `${stickerBaseUrl}/${id}.png`;
