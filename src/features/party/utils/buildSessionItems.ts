import { SessionResponse } from "../../../interfaces/eventGallery";
import { SessionItem } from "../types/session";

export const buildSessionItems = (session: SessionResponse): SessionItem[] => {
  const eventName = session?.event?.honoreesNames || "tu evento";
  const photos = Array.isArray(session?.photos) ? session.photos : [];

  return photos.map((photo, index) => ({
    type: "photo",
    // Coalesce, never a filter: fall back to the original when the
    // minimized variant hasn't been generated yet — the photo is never hidden.
    src: photo.minimizedUrl || photo.url,
    originalSrc: photo.url,
    alt: `Foto ${index + 1} de ${eventName}`,
    index,
    photoPosition: photo.position,
  }));
};

export const getPhotoItems = (items: SessionItem[]): SessionItem[] =>
  items.filter((item) => item.type === "photo");
