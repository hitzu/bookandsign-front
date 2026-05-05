import { appendSourceToPath, GallerySource } from "./sourceTracking";

export const buildSessionShareUrl = ({
  origin,
  sessionToken,
  source,
}: {
  origin: string;
  sessionToken: string;
  source: GallerySource;
}) => {
  const sessionPath = appendSourceToPath(`/mis-fotos/${sessionToken}`, source);
  return new URL(sessionPath, origin).toString();
};

export const buildWhatsappShareText = ({
  eventName,
  url,
}: {
  eventName?: string;
  url: string;
}) => {
  const resolvedEventName = eventName?.trim() || "este evento";
  return `Mira las fotos de ${resolvedEventName} 📸 ${url}`;
};

export const buildWhatsappShareUrl = (text: string) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
