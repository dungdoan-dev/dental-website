import { appointmentQuerySchema } from "../schemas/admin.schema";

export function normalizeAppointmentFilters(raw: Record<string, string | string[] | undefined>) {
  const filters = appointmentQuerySchema.parse(Object.fromEntries(
    Object.entries(raw).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  ));
  return {
    ...filters,
    nameQuery: filters.q ? filters.q.replace(/[,%()"\\]/g, " ").trim() : null,
    // Phones are stored internationally; drop the local leading zero for matching.
    phoneQuery: (filters.q ?? "").replace(/[^0-9]/g, "").replace(/^0/, "") || null,
  };
}

type AppointmentFilters = ReturnType<typeof normalizeAppointmentFilters>;

type FilterQuery = {
  eq: (column: string, value: string) => unknown;
  or: (expression: string) => unknown;
  gte: (column: string, value: string) => unknown;
  lt: (column: string, value: string) => unknown;
};

// PostgREST filter methods mutate the supplied builder.
export function applyAppointmentFilters(query: FilterQuery, filters: AppointmentFilters): void {
  if (filters.clinicId) query.eq("clinic_id", filters.clinicId);
  if (filters.status) query.eq("status", filters.status);
  if (filters.nameQuery !== null) {
    query.or([
      `name.ilike.%${filters.nameQuery}%`,
      ...(filters.phoneQuery ? [`phone.ilike.%${filters.phoneQuery}%`] : []),
    ].join(","));
  }
  if (filters.date) {
    const from = new Date(`${filters.date}T00:00:00+07:00`);
    query.gte("appointment_date", from.toISOString());
    query.lt("appointment_date", new Date(from.getTime() + 86400000).toISOString());
  }
}

// Counts intentionally omit status so every status tab shows its own total.
export function appointmentCountArgs(filters: AppointmentFilters) {
  return {
    p_clinic_id: filters.clinicId ?? null,
    p_name_query: filters.nameQuery,
    p_phone_query: filters.phoneQuery,
    p_day: filters.date || null,
  };
}
