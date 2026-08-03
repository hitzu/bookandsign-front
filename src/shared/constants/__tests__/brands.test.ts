import { describe, expect, it } from "vitest";
import { LUSSO_BRAND_ID, brandIncludesTransportFee } from "../brands";

describe("brandIncludesTransportFee", () => {
  it("is false for Lusso, whose events happen at the venue", () => {
    expect(brandIncludesTransportFee(LUSSO_BRAND_ID)).toBe(false);
  });

  it("is true for every other brand", () => {
    expect(brandIncludesTransportFee(1)).toBe(true);
    expect(brandIncludesTransportFee(2)).toBe(true);
  });

  it("keeps the note when the brand is unknown", () => {
    expect(brandIncludesTransportFee(null)).toBe(true);
    expect(brandIncludesTransportFee(undefined)).toBe(true);
    expect(brandIncludesTransportFee(0)).toBe(true);
  });
});
