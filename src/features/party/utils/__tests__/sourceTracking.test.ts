import assert from "node:assert/strict";
import test from "node:test";
import {
  appendSourceToPath,
  readSourceFromRouter,
  resolveGallerySource,
} from "../sourceTracking";

test("resolveGallerySource accepts v2 entry and transition sources", () => {
  assert.equal(resolveGallerySource("qr_fiesta"), "qr_fiesta");
  assert.equal(resolveGallerySource("qr_inspiracion"), "qr_inspiracion");
  assert.equal(resolveGallerySource("qr_session"), "qr_session");
  assert.equal(resolveGallerySource("qr_printed"), "qr_printed");
  assert.equal(resolveGallerySource("fiesta_to_session"), "fiesta_to_session");
  assert.equal(resolveGallerySource("session_to_fiesta"), "session_to_fiesta");
});

test("resolveGallerySource has no legacy compat and defaults to direct", () => {
  assert.equal(resolveGallerySource("qr"), "direct");
  assert.equal(resolveGallerySource("gallery"), "direct");
  assert.equal(resolveGallerySource("session"), "direct");
  assert.equal(resolveGallerySource("anything-else"), "direct");
  assert.equal(resolveGallerySource(undefined), "direct");
});

test("appendSourceToPath preserves existing query and hash", () => {
  assert.equal(
    appendSourceToPath("/mis-fotos/abc?foo=bar#foto", "fiesta_to_session"),
    "/mis-fotos/abc?foo=bar&source=fiesta_to_session#foto",
  );
});

test("readSourceFromRouter falls back to asPath query", () => {
  assert.equal(
    readSourceFromRouter({
      query: {},
      asPath: "/inspiracion/abc?source=qr_inspiracion",
    }),
    "qr_inspiracion",
  );
});

test("readSourceFromRouter accepts qr_session source", () => {
  assert.equal(
    readSourceFromRouter({
      query: {
        source: "qr_session",
      },
    }),
    "qr_session",
  );
});
