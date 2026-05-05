import type { NextRouter } from "next/router";

export type GallerySource = "qr" | "gallery" | "direct";

export const resolveGallerySource = (
  value?: string | string[],
): GallerySource => {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (normalizedValue === "qr" || normalizedValue === "gallery") {
    return normalizedValue;
  }

  return "direct";
};

export const appendSourceToPath = (path: string, source: GallerySource) => {
  const [pathWithoutHash, hash = ""] = path.split("#");
  const [pathname, search = ""] = pathWithoutHash.split("?");
  const params = new URLSearchParams(search);

  params.set("source", source);

  const queryString = params.toString();
  return `${pathname}${queryString ? `?${queryString}` : ""}${hash ? `#${hash}` : ""}`;
};

export const readSourceFromRouter = (
  router: Pick<NextRouter, "query">,
): GallerySource => resolveGallerySource(router.query.source);
