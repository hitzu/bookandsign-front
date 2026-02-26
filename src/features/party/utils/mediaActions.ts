type ShareResult = "shared" | "copied" | "unsupported";

const sanitizeSegment = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const buildDownloadFilename = (eventName: string, photoIndex: number) => {
  const safeEventName = sanitizeSegment(eventName || "evento");
  return `brillipoint-${safeEventName}-${photoIndex + 1}.jpg`;
};

export const downloadPhoto = async (url: string, filename: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo descargar la foto");

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

export const copyToClipboard = async (value: string): Promise<boolean> => {
  if (typeof navigator === "undefined") return false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      // Continue with fallback.
    }
  }

  if (typeof document === "undefined") return false;

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";

  try {
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    return document.execCommand("copy");
  } catch (_error) {
    return false;
  } finally {
    textArea.remove();
  }
};

export const shareUrl = async (url: string, title: string): Promise<ShareResult> => {
  if (typeof navigator === "undefined") return "unsupported";

  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return "shared";
    }

    const copied = await copyToClipboard(url);
    return copied ? "copied" : "unsupported";
  } catch (_error) {
    return "unsupported";
  }
};
