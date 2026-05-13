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

const getSearchParamFromAsPath = (asPath: string | undefined, key: string) => {
  if (!asPath) return undefined;

  const [, searchWithHash = ""] = asPath.split("?");
  if (!searchWithHash) return undefined;

  const [search = ""] = searchWithHash.split("#");
  return new URLSearchParams(search).get(key) || undefined;
};

export const readSourceFromRouter = (
  router: Pick<NextRouter, "query"> & Partial<Pick<NextRouter, "asPath">>,
): GallerySource =>
  resolveGallerySource(
    router.query.source || getSearchParamFromAsPath(router.asPath, "source"),
  );
