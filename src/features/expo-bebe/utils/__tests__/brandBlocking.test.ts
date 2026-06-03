import { describe, expect, it } from "vitest";
import {
  LUSSO_BRAND_ID,
  brandBlockedMessage,
  isBrandBlockedForMonth,
} from "../brandBlocking";

describe("isBrandBlockedForMonth", () => {
  it("treats missing data as available (never blocks on incomplete data)", () => {
    expect(isBrandBlockedForMonth(null, LUSSO_BRAND_ID)).toBe(false);
    expect(isBrandBlockedForMonth(undefined, LUSSO_BRAND_ID)).toBe(false);
    expect(isBrandBlockedForMonth([], LUSSO_BRAND_ID)).toBe(false);
  });

  it("blocks a brand already booked in the month", () => {
    expect(isBrandBlockedForMonth([4], LUSSO_BRAND_ID)).toBe(true);
    expect(isBrandBlockedForMonth([1, 2, 4], LUSSO_BRAND_ID)).toBe(true);
  });

  it("does not block a brand absent from the month", () => {
    expect(isBrandBlockedForMonth([1, 2, 3], LUSSO_BRAND_ID)).toBe(false);
  });
});

describe("brandBlockedMessage", () => {
  it("builds a discreet per-brand message", () => {
    expect(brandBlockedMessage("Lusso")).toBe(
      "Lusso ya no está disponible para este mes.",
    );
  });
});
