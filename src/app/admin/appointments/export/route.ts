import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { appointmentQuerySchema } from "@/features/admin/schemas/admin.schema";
import type { Prisma } from "@prisma/client";

function csv(value: unknown) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();
  const raw = Object.fromEntries(new URL(request.url).searchParams.entries());
  const filters = appointmentQuerySchema.parse(raw);
  const clinics = await db.clinic.findMany({ select: { id: true } });
  const where: Prisma.AppointmentWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (clinics.some((clinic) => clinic.id === filters.clinicId)) where.clinicId = filters.clinicId;
  if (filters.date) {
    const from = new Date(`${filters.date}T00:00:00+07:00`);
    where.appointmentDate = { gte: from, lt: new Date(from.getTime() + 86400000) };
  }
  if (filters.q) {
    const digits = filters.q.replace(/[^0-9]/g, "");
    where.OR = [{ name: { contains: filters.q, mode: "insensitive" } }, ...(digits ? [{ phone: { contains: digits } }] : [])];
  }
  const rows = await db.appointment.findMany({ where, orderBy: { createdAt: "desc" }, take: 10000, include: { clinic: { select: { label: true } }, service: { select: { name: true } } } });
  const lines = [["Mã", "Họ tên", "Số điện thoại", "Email", "Cơ sở", "Dịch vụ", "Ngày hẹn", "Trạng thái", "Ghi chú"], ...rows.map((item) => [item.id, item.name, item.phone, item.email, item.clinic?.label, item.service?.name, item.appointmentDate.toISOString(), item.status, item.note])];
  const body = `\uFEFF${lines.map((line) => line.map(csv).join(",")).join("\r\n")}`;
  return new Response(body, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="appointments.csv"', "cache-control": "no-store" } });
}
