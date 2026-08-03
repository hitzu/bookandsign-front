import { describe, expect, it } from "vitest";
import { MAX_QUANTITY, MIN_QUANTITY, clampQuantity } from "../quantity";

describe("clampQuantity", () => {
  it("keeps values inside the allowed range untouched", () => {
    expect(clampQuantity(1)).toBe(1);
    expect(clampQuantity(50)).toBe(50);
    expect(clampQuantity(MAX_QUANTITY)).toBe(MAX_QUANTITY);
  });

  it("clamps values below the minimum", () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY);
    expect(clampQuantity(-10)).toBe(MIN_QUANTITY);
  });

  it("clamps values above the maximum", () => {
    expect(clampQuantity(1000)).toBe(MAX_QUANTITY);
  });

  it("truncates decimals", () => {
    expect(clampQuantity(7.9)).toBe(7);
  });

  it("falls back to the minimum for NaN", () => {
    expect(clampQuantity(Number.NaN)).toBe(MIN_QUANTITY);
  });

  it("clamps infinities to the range bounds", () => {
    expect(clampQuantity(Number.POSITIVE_INFINITY)).toBe(MAX_QUANTITY);
    expect(clampQuantity(Number.NEGATIVE_INFINITY)).toBe(MIN_QUANTITY);
  });
});
