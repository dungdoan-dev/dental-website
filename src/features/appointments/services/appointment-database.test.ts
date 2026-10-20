import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { testDatabase, migration } from "../../../lib/testing/database";

test("booking RPC deduplicates retries, limits submissions and commits notifications atomically", async () => {
  const db = await testDatabase();
  try {
    await db.exec(migration("20261020152353_appointment_submission_guard.sql"));
    await db.exec("SET ROLE service_role");
    const data = { name: "Test patient", phone: "+84912345678", clinicId: "clinic-test", appointmentDate: new Date(Date.now()+86400000).toISOString() };
    const submit = (body: typeof data, id = randomUUID()) => db.query<{ result: { created: boolean; id: string } }>("SELECT public.submit_appointment($1::jsonb,$2::uuid,NULL) AS result", [JSON.stringify(body),id]);
    const key = randomUUID();
    assert.equal((await submit(data,key)).rows[0].result.created,true);
    assert.equal((await submit(data,key)).rows[0].result.created,false);
    assert.equal((await submit(data)).rows[0].result.created,false);
    for(let day=2;day<=3;day++) await submit({ ...data, appointmentDate: new Date(Date.now()+day*86400000).toISOString() });
    await assert.rejects(submit({ ...data, appointmentDate: new Date(Date.now()+4*86400000).toISOString() }), /rate limit/);
    assert.equal((await db.query<{ total: number }>("SELECT count(*)::int AS total FROM public.appointment_notification_outbox")).rows[0].total,3);
    const jobs = await db.query("SELECT * FROM public.claim_appointment_notifications(2)");
    assert.equal(jobs.rows.length,2);
    assert.equal((await db.query("SELECT * FROM public.claim_appointment_notifications(2)")).rows.length,1);
    await db.exec("RESET ROLE; SET ROLE anon");
    await assert.rejects(db.query("SELECT public.submit_appointment('{}', $1::uuid,NULL)",[randomUUID()]), /permission denied/);
    await assert.rejects(db.exec("INSERT INTO appointments(name,phone,clinic_id,appointment_date) VALUES('Bot','+84912345678','clinic-test',now())"), /permission denied/);
    await db.exec("RESET ROLE; ALTER TABLE appointment_notification_outbox ADD CONSTRAINT reject_new_notifications CHECK(false) NOT VALID; SET ROLE service_role");
    await assert.rejects(submit({ ...data, phone: "+84999999999" }), /reject_new_notifications/);
    assert.equal((await db.query<{ total: number }>("SELECT count(*)::int AS total FROM appointments")).rows[0].total,3);
  } finally { await db.close(); }
});
