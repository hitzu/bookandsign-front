import { parseLocalDate } from "@common/dates";

const MONTH_LABELS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

export const formatSplashDate = (rawDate?: string) => {
  if (!rawDate) return undefined;

  const date = parseLocalDate(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;

  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_LABELS[date.getMonth()];
  const year = date.getFullYear();

  return `${day} · ${month} · ${year}`;
};

