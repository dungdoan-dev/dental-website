import { test } from "node:test";
import assert from "node:assert/strict";
import { appointmentSchema } from "./appointment.schema";

const valid = { name: "Nguyễn Văn A", phone: "+84912345678", clinicId: "clinic-1", appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString() };

test("appointmentSchema accepts a minimal valid booking and drops empty optionals", () => {
  const parsed = appointmentSchema.parse({ ...valid, email: "", note: "  " });
  assert.equal(parsed.email, undefined);
  assert.equal(parsed.note, undefined);
});

test("appointmentSchema rejects local phone format, missing clinic, oversized note and past dates", () => {
  assert.equal(appointmentSchema.safeParse({ ...valid, phone: "0912345678" }).success, false);
  assert.equal(appointmentSchema.safeParse({ ...valid, clinicId: "" }).success, false);
  assert.equal(appointmentSchema.safeParse({ ...valid, note: "x".repeat(1001) }).success, false);
  assert.equal(appointmentSchema.safeParse({ ...valid, appointmentDate: "not-a-date" }).success, false);
  assert.equal(appointmentSchema.safeParse({ ...valid, appointmentDate: "2020-01-01T08:00:00+07:00" }).success, false);
});
