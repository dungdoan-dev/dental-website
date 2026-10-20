import { test } from "node:test";
import assert from "node:assert/strict";
import { appointmentEmailConfigured, sendAppointmentNotification } from "./mail";

test("email reports provider failures and keeps the same idempotency key for retries", async () => {
  const keys = ["RESEND_API_KEY", "APPOINTMENT_EMAIL_FROM", "APPOINTMENT_EMAIL_TO"] as const;
  const previous = keys.map((key) => process.env[key]);
  const originalFetch = globalThis.fetch;
  try {
    for (const key of keys) delete process.env[key];
    assert.equal(appointmentEmailConfigured(),false);
    const booking = { name:"Test",phone:"+84912345678",clinicId:"clinic-test",appointmentDate:"2026-10-21T01:00:00Z" };
    await assert.rejects(sendAppointmentNotification(booking,"123"),/not configured/);
    process.env.RESEND_API_KEY="test-key";
    process.env.APPOINTMENT_EMAIL_FROM="Clinic <clinic@example.test>";
    process.env.APPOINTMENT_EMAIL_TO="admin@example.test";
    const recorded: string[] = [];
    globalThis.fetch = async (_input,init) => {
      recorded.push(new Headers(init?.headers).get("Idempotency-Key")!);
      return new Response("{}",{status:recorded.length===1?503:200});
    };
    await assert.rejects(sendAppointmentNotification(booking,"123"),/503/);
    await sendAppointmentNotification(booking,"123");
    assert.deepEqual(recorded,["appointment-123","appointment-123"]);
  } finally {
    globalThis.fetch=originalFetch;
    keys.forEach((key,index) => { if(previous[index]===undefined) delete process.env[key]; else process.env[key]=previous[index]; });
  }
});
