/**
 * Coalesce helpers for the minimized-photo adoption.
 *
 * Rule (never a filter, always a fallback): when the minimized image is
 * absent, degrade to the original — a photo is never hidden because the
 * minimized variant hasn't been generated yet.
 */

export interface EventPhotoLike {
  publicUrl: string;
  minimizedPublicUrl?: string | null;
}

export interface SessionPhotoLike {
  url: string;
  minimizedUrl?: string | null;
}

/** Model A (`EventPhoto` / `/photos/event`) display URL. */
export const getEventPhotoDisplayUrl = (photo: EventPhotoLike): string =>
  photo.minimizedPublicUrl || photo.publicUrl;

/** Model B (`SessionPhoto` / `/sessions/{token}`) display URL. */
export const getSessionPhotoDisplayUrl = (photo: SessionPhotoLike): string =>
  photo.minimizedUrl || photo.url;
