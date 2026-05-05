import {
  SessionPhoto,
  SessionResponse,
} from "../../../interfaces/eventGallery";
import { SessionItem } from "../types/session";

const GIF_EXTENSION_PATTERN = /\.gif(?:$|\?)/i;

const isGifUrl = (url: string) => GIF_EXTENSION_PATTERN.test(url);

const moveGifToFront = (photos: SessionPhoto[]) => {
  const gifIndex = photos.findIndex((photo) => isGifUrl(photo.url));

  if (gifIndex <= 0) return [...photos];

  const nextPhotos = [...photos];
  const [gifPhoto] = nextPhotos.splice(gifIndex, 1);
  nextPhotos.unshift(gifPhoto);
  return nextPhotos;
};

export const buildSessionItems = (session: SessionResponse): SessionItem[] => {
  const eventName = session?.event?.honoreesNames || "tu evento";
  const photos = Array.isArray(session?.photos) ? session.photos : [];
  const photosWithGifFirst = moveGifToFront(photos);
  const items: SessionItem[] = photosWithGifFirst.map((photo, index) => ({
    type: isGifUrl(photo.url) ? "gif" : "photo",
    src: photo.url,
    alt: isGifUrl(photo.url)
      ? `GIF de ${eventName}`
      : `Foto ${index + 1} de ${eventName}`,
    index,
    photoPosition: photo.position,
  }));

  if (session?.gifUrl && !items.some((item) => item.src === session.gifUrl)) {
    items.unshift({
      type: "gif",
      src: session.gifUrl,
      alt: `GIF de ${eventName}`,
      index: 0,
    });
  }

  return items.map((item, index) => ({
    ...item,
    index,
  }));
};

export const getPhotoItems = (items: SessionItem[]): SessionItem[] =>
  items.filter((item) => item.type === "photo");
