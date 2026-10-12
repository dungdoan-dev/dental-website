import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { appointmentQuerySchema } from "@/features/admin/schemas/admin.schema";

function csv(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}

type AppointmentExportRow = {
  id: number | string; name: string; phone: string; email: string | null;
  appointment_date: string; status: string; note: string | null;
  clinic: { label: string } | null; service: { name: string } | null;
};

export async function GET(request: Request) {
  await requireAdmin();
  const raw = Object.fromEntries(new URL(request.url).searchParams.entries());
  const filters = appointmentQuerySchema.parse(raw);
  const supabase = await getSupabaseServerClient();
  const { data: clinics, error: clinicsError } = await supabase.from("clinics").select("id");
  if (clinicsError) throw clinicsError;
  let query = supabase.from("appointments").select("*, clinic:clinics(label), service:services(name)");
  if (filters.status) query = query.eq("status", filters.status);
  if (clinics.some((clinic) => clinic.id === filters.clinicId)) query = query.eq("clinic_id", filters.clinicId);
  if (filters.date) {
    const from = new Date(`${filters.date}T00:00:00+07:00`);
    query = query.gte("appointment_date", from.toISOString()).lt("appointment_date", new Date(from.getTime() + 86400000).toISOString());
  }
  if (filters.q) {
    const digits = filters.q.replace(/[^0-9]/g, "");
    const safeName = filters.q.replace(/[,%()\\"\\\\]/g, " ").trim();
    query = query.or([`name.ilike.%${safeName}%`, ...(digits ? [`phone.ilike.%${digits}%`] : [])].join(","));
  }
  const { data: rows, error } = await query.order("created_at", { ascending: false }).range(0, 9999);
  if (error) throw error;
  const lines = [["Mã", "Họ tên", "Số điện thoại", "Email", "Cơ sở", "Dịch vụ", "Ngày hẹn", "Trạng thái", "Ghi chú"], ...(rows as AppointmentExportRow[]).map((item) => [item.id, item.name, item.phone, item.email, item.clinic?.label, item.service?.name, item.appointment_date, item.status, item.note])];
  const body = `\uFEFF${lines.map((line) => line.map(csv).join(",")).join("\r\n")}`;
  return new Response(body, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="appointments.csv"', "cache-control": "no-store" } });
}
