import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOpeningHours } from "./structured-data";

test("parseOpeningHours reads both admin formats used by the clinics", () => {
  const expected = ["Mo-Sa 08:00-12:00", "Mo-Sa 13:30-20:00"];
  assert.deepEqual(parseOpeningHours("Thứ hai - Thứ bảy: 08:00 – 12:00 | 13:30 – 20:00"), expected);
  assert.deepEqual(parseOpeningHours("08:00–12:00 | 13:30–20:00 (T2 - T7)"), expected);
  assert.deepEqual(parseOpeningHours("8:00-17:00 (T2 - CN)"), ["Mo-Su 08:00-17:00"]);
});

test("parseOpeningHours returns undefined instead of guessing", () => {
  assert.equal(parseOpeningHours("08:00 – 20:00"), undefined);
  assert.equal(parseOpeningHours("Thứ hai - Thứ bảy"), undefined);
});
