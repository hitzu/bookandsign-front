import { describe, expect, it } from "vitest";
import {
  EMAIL_REGEX,
  PHONE_DIGITS_LENGTH,
  isValidEmailFormat,
  isValidPhoneLength,
  sanitizePhoneInput,
} from "../contactValidation";

describe("EMAIL_REGEX", () => {
  it("accepts common email formats", () => {
    expect(EMAIL_REGEX.test("cliente@ejemplo.com")).toBe(true);
    expect(EMAIL_REGEX.test("cliente.test+expo@ejemplo.com.mx")).toBe(true);
  });
});

describe("sanitizePhoneInput", () => {
  it("keeps only digits and enforces the max length", () => {
    expect(sanitizePhoneInput("55 1234-567890")).toBe("5512345678");
    expect(sanitizePhoneInput("abc")).toBe("");
  });
});

describe("isValidEmailFormat", () => {
  it("allows empty emails and rejects malformed ones", () => {
    expect(isValidEmailFormat("")).toBe(true);
    expect(isValidEmailFormat("cliente@ejemplo.com")).toBe(true);
    expect(isValidEmailFormat("cliente@ejemplo")).toBe(false);
  });
});

describe("isValidPhoneLength", () => {
  it("allows empty phones and requires exactly ten digits", () => {
    expect(isValidPhoneLength("")).toBe(true);
    expect(isValidPhoneLength("5512345678")).toBe(true);
    expect(isValidPhoneLength("551234567")).toBe(false);
    expect(isValidPhoneLength(`5512345678${PHONE_DIGITS_LENGTH}`)).toBe(false);
  });
});
