import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSessionShareMessage,
  buildSessionShareText,
  buildSessionShareUrl,
  buildWhatsappShareText,
} from "../sessionShare";

test("buildSessionShareUrl keeps the session route and adds source", () => {
  const url = buildSessionShareUrl({
    origin: "https://brillipoint.mx",
    sessionToken: "abc123",
    source: "qr",
  });

  assert.equal(url, "https://brillipoint.mx/mis-fotos/abc123?source=qr");
});

test("buildSessionShareText includes the event name without duplicating the url", () => {
  assert.equal(
    buildSessionShareText({ eventName: "Christian" }),
    "Mira mis fotos de Christian 📸",
  );
});

test("buildSessionShareMessage combines the preloaded text and url for copy fallback", () => {
  assert.equal(
    buildSessionShareMessage({
      eventName: "Christian",
      url: "https://brillipoint.mx/mis-fotos/abc123?source=qr",
    }),
    "Mira mis fotos de Christian 📸 https://brillipoint.mx/mis-fotos/abc123?source=qr",
  );
});

test("buildWhatsappShareText keeps the full message expected by WhatsApp", () => {
  assert.equal(
    buildWhatsappShareText({
      eventName: "Christian",
      url: "https://brillipoint.mx/mis-fotos/abc123",
    }),
    "Mira mis fotos de Christian 📸 https://brillipoint.mx/mis-fotos/abc123",
  );
});
