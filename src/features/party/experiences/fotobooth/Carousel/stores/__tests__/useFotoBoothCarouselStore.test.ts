import assert from "node:assert/strict";
import test from "node:test";
import { useFotoBoothCarouselStore } from "../useFotoBoothCarouselStore";

test("store no longer exposes gifHintVisible state (GIF feature removed)", () => {
  const state = useFotoBoothCarouselStore.getState();
  assert.equal("gifHintVisible" in state, false);
});

test("store no longer exposes setGifHintVisible action (GIF feature removed)", () => {
  const state = useFotoBoothCarouselStore.getState();
  assert.equal("setGifHintVisible" in state, false);
});

test("reset() restores index and activeEffect defaults", () => {
  useFotoBoothCarouselStore.getState().setIndex(3);
  useFotoBoothCarouselStore.getState().setActiveEffect("hearts");

  useFotoBoothCarouselStore.getState().reset();

  const state = useFotoBoothCarouselStore.getState();
  assert.equal(state.index, 0);
  assert.equal(state.activeEffect, "original");
});
