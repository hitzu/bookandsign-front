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

const resolveShareEventName = (eventName?: string) => {
  const resolvedEventName = eventName?.trim() || "este evento";
  return resolvedEventName;
};

export const buildSessionShareText = ({
  eventName,
}: {
  eventName?: string;
}) => `Mira mis fotos de ${resolveShareEventName(eventName)} 📸`;

export const buildSessionShareMessage = ({
  eventName,
  url,
}: {
  eventName?: string;
  url: string;
}) => {
  return `${buildSessionShareText({ eventName })} ${url}`;
};

export const buildWhatsappShareText = buildSessionShareMessage;

export const buildWhatsappShareUrl = (text: string) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
