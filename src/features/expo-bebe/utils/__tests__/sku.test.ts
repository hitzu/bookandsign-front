import { describe, expect, it } from "vitest";
import { formatSkuDate, normalizeSkuText } from "../sku";

describe("normalizeSkuText", () => {
  it("returns empty string for nullish input", () => {
    expect(normalizeSkuText(null)).toBe("");
    expect(normalizeSkuText(undefined)).toBe("");
  });

  it("strips accents, spaces and symbols", () => {
    expect(normalizeSkuText("María José")).toBe("MariaJose");
    expect(normalizeSkuText("Acción & Co.")).toBe("AccionCo");
  });

  it("keeps alphanumerics", () => {
    expect(normalizeSkuText("Pkg 2 Plus")).toBe("Pkg2Plus");
  });
});

describe("formatSkuDate", () => {
  it("returns empty string for missing date", () => {
    expect(formatSkuDate(null)).toBe("");
    expect(formatSkuDate(undefined)).toBe("");
    expect(formatSkuDate("")).toBe("");
  });

  it("formats an ISO date as DDMonYY", () => {
    expect(formatSkuDate("2026-01-09")).toBe("09Ene26");
    expect(formatSkuDate("2027-12-25")).toBe("25Dic27");
  });
});
