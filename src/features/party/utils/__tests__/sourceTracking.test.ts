import assert from "node:assert/strict";
import test from "node:test";
import { appendSourceToPath, resolveGallerySource } from "../sourceTracking";

test("resolveGallerySource accepts known sources and defaults unknown values", () => {
  assert.equal(resolveGallerySource("qr"), "qr");
  assert.equal(resolveGallerySource("gallery"), "gallery");
  assert.equal(resolveGallerySource("anything-else"), "direct");
  assert.equal(resolveGallerySource(undefined), "direct");
});

test("appendSourceToPath preserves existing query and hash", () => {
  assert.equal(
    appendSourceToPath("/mis-fotos/abc?foo=bar#foto", "gallery"),
    "/mis-fotos/abc?foo=bar&source=gallery#foto",
  );
});
