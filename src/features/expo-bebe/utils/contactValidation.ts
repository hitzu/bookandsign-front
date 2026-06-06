export const PHONE_DIGITS_LENGTH = 10;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function sanitizePhoneInput(value: string) {
  return onlyDigits(value).slice(0, PHONE_DIGITS_LENGTH);
}

export function isValidEmailFormat(value: string) {
  const normalized = value.trim();
  return normalized.length === 0 || EMAIL_REGEX.test(normalized);
}

export function isValidPhoneLength(value: string) {
  const normalized = onlyDigits(value);
  return normalized.length === 0 || normalized.length === PHONE_DIGITS_LENGTH;
}
