/* SKU helpers (ported from contracts-add). */

export const SKU_MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

export const normalizeSkuText = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^0-9a-zA-Z]/g, "");

export const formatSkuDate = (isoDate?: string | null) => {
  if (!isoDate) return "";
  const [yyyy, mm, dd] = isoDate.split("-");
  const month = SKU_MONTHS[Number(mm) - 1] ?? "";
  const year2 = (yyyy ?? "").slice(-2);
  return dd && month && year2 ? `${dd}${month}${year2}` : "";
};
