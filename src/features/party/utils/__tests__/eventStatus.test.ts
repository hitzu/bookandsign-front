import assert from "node:assert/strict";
import test from "node:test";
import { EVENT_ACCESS_STATUS } from "../../../../interfaces/eventGallery";
import {
  isExpiredEventStatus,
  isExpiredSessionStatus,
} from "../eventStatus";

test("isExpiredEventStatus returns true for finished events", () => {
  assert.equal(isExpiredEventStatus(EVENT_ACCESS_STATUS.FINISHED), true);
});

test("isExpiredEventStatus returns true for finalized events", () => {
  assert.equal(isExpiredEventStatus(EVENT_ACCESS_STATUS.FINALIZED), true);
});

test("isExpiredEventStatus returns false for active or missing statuses", () => {
  assert.equal(isExpiredEventStatus(EVENT_ACCESS_STATUS.ACTIVE), false);
  assert.equal(isExpiredEventStatus(undefined), false);
});

test("isExpiredSessionStatus keeps finished sessions as expired only", () => {
  assert.equal(isExpiredSessionStatus(EVENT_ACCESS_STATUS.FINISHED), true);
  assert.equal(isExpiredSessionStatus(EVENT_ACCESS_STATUS.COMPLETE), false);
  assert.equal(isExpiredSessionStatus(EVENT_ACCESS_STATUS.ACTIVE), false);
});
