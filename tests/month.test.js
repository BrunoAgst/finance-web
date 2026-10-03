import assert from "node:assert/strict";
import test from "node:test";
import { shiftMonth } from "../src/utils/month.js";

test("advancing December 2026 selects January 2027", () => {
  const next = shiftMonth(new Date(2026, 11, 1), 1);
  assert.equal(next.getFullYear(), 2027);
  assert.equal(next.getMonth() + 1, 1);
});

test("going back from January 2027 selects December 2026", () => {
  const previous = shiftMonth(new Date(2027, 0, 1), -1);
  assert.equal(previous.getFullYear(), 2026);
  assert.equal(previous.getMonth() + 1, 12);
});

test("navigation within the year preserves the year", () => {
  const next = shiftMonth(new Date(2026, 9, 1), 1);
  assert.equal(next.getFullYear(), 2026);
  assert.equal(next.getMonth() + 1, 11);
});

test("navigation normalizes the day instead of skipping a short month", () => {
  const next = shiftMonth(new Date(2027, 0, 31), 1);
  assert.equal(next.getMonth() + 1, 2);
  assert.equal(next.getDate(), 1);
});
