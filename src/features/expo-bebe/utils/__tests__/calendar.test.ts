import { describe, expect, it } from "vitest";
import { buildWeekendRows, toYMD } from "../calendar";

describe("toYMD", () => {
  it("zero-pads month and day and shifts the 0-based month", () => {
    expect(toYMD(2026, 0, 1)).toBe("2026-01-01");
    expect(toYMD(2026, 11, 25)).toBe("2026-12-25");
  });
});

describe("buildWeekendRows", () => {
  it("only includes Fridays, Saturdays and Sundays", () => {
    const rows = buildWeekendRows(2026, 0); // January 2026
    const days = rows.flatMap((r) => [r.fri, r.sat, r.sun].filter(Boolean));
    for (const day of days) {
      const dow = new Date(2026, 0, day as number).getDay();
      expect([5, 6, 0]).toContain(dow);
    }
  });

  it("groups the same weekend (Fri/Sat/Sun) into one row", () => {
    const rows = buildWeekendRows(2026, 0);
    // 2026-01-02 is Friday, 03 Saturday, 04 Sunday → same week row.
    const firstWeekend = rows.find((r) => r.fri === 2);
    expect(firstWeekend).toBeDefined();
    expect(firstWeekend?.sat).toBe(3);
    expect(firstWeekend?.sun).toBe(4);
  });

  it("returns rows sorted by week", () => {
    const rows = buildWeekendRows(2026, 0);
    const keys = rows.map((r) => r.key);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });
});
