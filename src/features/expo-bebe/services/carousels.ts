import { axiosInstanceWithoutToken } from "../../../api/config/axiosConfig";
import type { Carousel } from "../../../interfaces";
import type { ExpoBebeBrandKey, ServiceItem } from "../types";

const gradients = [
  "linear-gradient(160deg, #efddc8, #d0b594)",
  "linear-gradient(160deg, #e7d3df, #c9a6bd)",
  "linear-gradient(160deg, #dde6f0, #aac3dd)",
  "linear-gradient(160deg, #f5dad9, #e3a8a6)",
  "linear-gradient(160deg, #e6e0ef, #b9a6d2)",
  "linear-gradient(160deg, #e0ede4, #a8c8b0)",
];

const splitTitle = (value: string): [string, string] => {
  const trimmed = value.trim();
  if (!trimmed) return ["Expo", "Bebé"];

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];

  const middle = Math.ceil(parts.length / 2);
  return [parts.slice(0, middle).join(" "), parts.slice(middle).join(" ")];
};

const readString = (obj: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const readImage = (obj: Record<string, unknown>) =>
  readString(obj, [
    "imageUrl",
    "image",
    "imageSrc",
    "photoUrl",
    "desktopImageUrl",
    "mobileImageUrl",
    "url",
  ]) || null;

const normalizeItem = (
  item: unknown,
  index: number,
  section: "services" | "extras"
): ServiceItem | null => {
  if (typeof item === "string") {
    const title = splitTitle(item);
    return {
      eyebrow: `${String(index + 1).padStart(2, "0")} · ${section}`,
      title,
      desc: "",
      price: "",
      bg: gradients[index % gradients.length],
      label: `[ ${item.toLowerCase()} ]`,
      includes: [],
    };
  }

  if (!item || typeof item !== "object") return null;

  const record = item as Record<string, unknown>;
  const rawTitle =
    readString(record, ["title", "name", "label", "caption"]) ||
    `${section === "services" ? "Servicio" : "Extra"} ${index + 1}`;
  const imageUrl = readImage(record);
  const price = readString(record, ["price", "priceText", "amount"]);
  const eyebrow = readString(record, ["eyebrow", "kicker", "subtitle"]);
  const label = readString(record, ["label", "tag", "tagline"]);

  return {
    eyebrow:
      eyebrow ||
      `${String(index + 1).padStart(2, "0")} · ${
        section === "services" ? "servicio" : "extra"
      }`,
    title: splitTitle(rawTitle),
    desc: readString(record, ["description", "desc", "summary"]),
    price,
    bg: gradients[index % gradients.length],
    label: label || `[ ${rawTitle.toLowerCase()} ]`,
    includes: [],
    imageUrl,
  };
};

const extractItems = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.results)) return record.results;
  return [];
};

export const getExpoBebeCarousel = async ({
  brandId,
  section,
}: {
  brandId: number;
  section: "services" | "extras";
}): Promise<ServiceItem[]> => {
  const response = await axiosInstanceWithoutToken.get<Carousel[]>(
    "/carousels",
    { params: { page: "expo-bebe", section, brandId } }
  );

  return extractItems(response.data)
    .map((item, index) => normalizeItem(item, index, section))
    .filter((item): item is ServiceItem => !!item);
};
