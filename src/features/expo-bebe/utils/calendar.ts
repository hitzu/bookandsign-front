/* Calendar helpers for the weekend (Fri/Sat/Sun) availability grid. */

export const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const toYMD = (year: number, month: number, day: number) => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

export type WeekendRow = {
  key: number;
  fri?: number;
  sat?: number;
  sun?: number;
};

export function buildWeekendRows(year: number, monthIdx: number): WeekendRow[] {
  type WeekendKey = 5 | 6 | 0;

  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const byWeek = new Map<number, WeekendRow>();

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, monthIdx, d).getDay() as WeekendKey;
    if (dow !== 5 && dow !== 6 && dow !== 0) continue;

    // Use monday-week number as key
    const diff = (dow + 6) % 7;
    const mondayDay = d - diff;
    const row: WeekendRow = byWeek.get(mondayDay) ?? { key: mondayDay };
    if (dow === 5) row.fri = d;
    if (dow === 6) row.sat = d;
    if (dow === 0) row.sun = d;
    byWeek.set(mondayDay, row);
  }

  return Array.from(byWeek.values()).sort((a, b) => a.key - b.key);
}
