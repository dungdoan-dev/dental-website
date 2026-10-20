import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { normalizeAppointmentFilters, applyAppointmentFilters, appointmentCountArgs } from "./appointment-filters";

test("list, export and counts share local-phone, clinic and Vietnam-day filters", async () => {
  let requestedUrl = "";
  const client = createClient("https://example.supabase.co", "test-key", {
    global: { fetch: async (input) => {
      requestedUrl = String(input);
      return new Response("[]", { headers: { "content-type": "application/json" } });
    } },
  });
  const filters = normalizeAppointmentFilters({
    q: " 0912 345 678 ", clinicId: "unknown-clinic", date: "2026-10-20", status: "pending",
  });
  const counts = appointmentCountArgs(filters);
  assert.equal(counts.p_phone_query, "912345678");
  assert.equal(counts.p_clinic_id, "unknown-clinic");
  assert.equal(counts.p_day, "2026-10-20");
  assert.equal("status" in counts, false);

  for (const select of ["id,name,phone", "id,name,phone,email,status,note"]) {
    const query = client.from("appointments").select(select);
    applyAppointmentFilters(query, filters);
    await query;
    const params = new URL(requestedUrl).searchParams;
    assert.equal(params.get("clinic_id"), `eq.${counts.p_clinic_id}`);
    assert.equal(params.get("status"), "eq.pending");
    assert.equal(params.get("or"), `(name.ilike.%${counts.p_name_query}%,phone.ilike.%${counts.p_phone_query}%)`);
    assert.deepEqual(params.getAll("appointment_date"), [
      "gte.2026-10-19T17:00:00.000Z", "lt.2026-10-20T17:00:00.000Z",
    ]);
  }
});

test("invalid filters are ignored and search punctuation is normalized once", () => {
  const invalid = normalizeAppointmentFilters({ date: "2026-02-30", status: "bad", clinicId: "bad,id", q: ["ignored"] });
  assert.deepEqual(appointmentCountArgs(invalid), {
    p_clinic_id: null, p_name_query: null, p_phone_query: null, p_day: null,
  });
  const filters = normalizeAppointmentFilters({ q: ' Nguyễn,(An)%"\\ ' });
  assert.equal(filters.nameQuery, "Nguyễn  An");
  assert.equal(filters.phoneQuery, null);
  assert.equal(normalizeAppointmentFilters({ q: "+84912345678" }).phoneQuery, "84912345678");
});
