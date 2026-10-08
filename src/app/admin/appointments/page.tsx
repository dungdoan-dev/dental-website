import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { AppointmentActions } from "@/features/admin/components/AppointmentActions";
import type { Prisma } from "@prisma/client";
import { appointmentQuerySchema } from "@/features/admin/schemas/admin.schema";
import Link from "next/link";

export const metadata = {
  title: "Quản Lý Đặt Hẹn | Admin Nha Khoa 2000",
};

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const raw = await searchParams;
  const filters = appointmentQuerySchema.parse(Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, string] => typeof entry[1] === "string")));
  const clinics = await db.clinic.findMany({ select: { id: true, label: true }, orderBy: { id: "asc" } });
  const clinicId = clinics.some((clinic) => clinic.id === filters.clinicId) ? filters.clinicId : undefined;
  const status = filters.status;
  const baseWhere: Prisma.AppointmentWhereInput = {};
  if (clinicId) baseWhere.clinicId = clinicId;
  if (filters.q) {
    const digits = filters.q.replace(/[^0-9]/g, "");
    baseWhere.OR = [{ name: { contains: filters.q, mode: "insensitive" } }, ...(digits ? [{ phone: { contains: digits } }] : [])];
  }
  if (filters.date) {
    const from = new Date(filters.date + "T00:00:00+07:00");
    baseWhere.appointmentDate = { gte: from, lt: new Date(from.getTime() + 86400000) };
  }
  const whereClause = { ...baseWhere, ...(status ? { status } : {}) };
  const [total, counts] = await Promise.all([
    db.appointment.count({ where: whereClause }),
    db.appointment.groupBy({ by: ["status"], where: baseWhere, _count: true }),
  ]);
  const pageSize = 25;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, pageCount);
  const appointments = await db.appointment.findMany({
    where: whereClause, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * pageSize, take: pageSize,
    include: { service: { select: { name: true } }, clinic: { select: { name: true, label: true } } },
  });
  const countMap = Object.fromEntries(counts.map((row) => [row.status, row._count]));
  const totalCount = counts.reduce((sum, row) => sum + row._count, 0);

  function filterUrl(nextStatus: typeof status | "" = status ?? "", nextPage = 1) {
    const query = new URLSearchParams();
    if (filters.q) query.set("q", filters.q);
    if (clinicId) query.set("clinicId", clinicId);
    if (filters.date) query.set("date", filters.date);
    if (nextStatus) query.set("status", nextStatus);
    if (nextPage > 1) query.set("page", String(nextPage));
    return "/admin/appointments" + (query.size ? "?" + query.toString() : "");
  }
  const tabs = [
    { label: "Tất cả", value: "", count: totalCount },
    { label: "Chờ duyệt", value: "pending", count: countMap["pending"] ?? 0 },
    { label: "Đã xác nhận", value: "confirmed", count: countMap["confirmed"] ?? 0 },
    { label: "Hoàn thành", value: "completed", count: countMap["completed"] ?? 0 },
    { label: "Đã hủy", value: "cancelled", count: countMap["cancelled"] ?? 0 },
  ] as const;

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1800px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Quản Lý Đặt Hẹn Khám
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Tiếp nhận, xử lý và phân luồng các cuộc hẹn khám trực tuyến từ bệnh nhân Nha Khoa 2000.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/admin/appointments/export?${new URLSearchParams(Object.entries({ ...(filters.q ? { q: filters.q } : {}), ...(clinicId ? { clinicId } : {}), ...(filters.date ? { date: filters.date } : {}), ...(status ? { status } : {}) }))}`} className="inline-flex min-h-11 items-center rounded-xl border border-border-subtle bg-white px-4 text-sm font-semibold text-text-primary">Xuất CSV</Link>
          <Link
            href="/lien-he"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Mở Form Đặt Hẹn</span>
          </Link>
        </div>
      </div>

      {(raw.status && !status) || (raw.clinicId && !clinicId) || (raw.date && !filters.date) ? <p role="status" className="rounded-xl bg-error-container/30 p-3 text-sm text-error">Một bộ lọc trên URL không hợp lệ đã được bỏ qua.</p> : null}
      <form className="admin-inline-form grid gap-3 rounded-2xl border border-border-subtle bg-white p-4 sm:grid-cols-2 xl:grid-cols-4" method="get">
        {status && <input name="status" type="hidden" value={status} />}
        <label className="text-sm font-semibold">Tên hoặc số điện thoại<input className="mt-1 min-h-11 w-full rounded-lg border border-border-subtle px-3 text-sm" defaultValue={filters.q} maxLength={100} name="q" placeholder="Tìm khách hàng…" /></label>
        <label className="text-sm font-semibold">Cơ sở<select className="mt-1 min-h-11 w-full rounded-lg border border-border-subtle px-3 text-sm" defaultValue={clinicId ?? ""} name="clinicId"><option value="">Tất cả cơ sở</option>{clinics.map((clinic, index) => <option key={clinic.id} value={clinic.id}>{clinic.id === "clinic-1" ? "CS1" : clinic.id === "clinic-2" ? "CS2" : clinic.label || `CS${index + 1}`}</option>)}</select></label>
        <label className="text-sm font-semibold">Ngày hẹn<input className="mt-1 min-h-11 w-full rounded-lg border border-border-subtle px-3 text-sm" defaultValue={filters.date} name="date" type="date" /></label>
        <div className="flex items-end gap-3"><button className="min-h-11 rounded-lg bg-brand-blue-dark px-5 text-sm font-bold text-white" type="submit">Lọc lịch hẹn</button><Link className="inline-flex min-h-11 items-center text-sm text-text-secondary" href="/admin/appointments">Xóa lọc</Link></div>
      </form>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low w-fit overflow-x-auto max-w-full">
        {tabs.map((tab) => {
          const isActive = (status ?? "") === tab.value;
          return (
            <Link
              key={tab.label}
              href={filterUrl(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-brand-blue-dark font-bold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isActive
                    ? "bg-brand-blue-light text-brand-blue-dark"
                    : "bg-surface-container text-text-secondary"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Appointments Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        {appointments.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-4xl text-text-secondary">calendar_today</span>
            <p className="mt-3 text-sm font-bold text-text-primary">Không có lịch hẹn nào</p>
            <p className="mt-1 text-xs text-text-secondary">
              {status ? "Không tìm thấy yêu cầu theo trạng thái này" : "Chưa có lượt đặt hẹn nào từ người dùng"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1440px] table-fixed text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                  <th className="w-[72px] whitespace-nowrap px-3 py-4">Mã</th>
                  <th className="w-[180px] whitespace-nowrap px-3 py-4">Khách hàng</th>
                  <th className="w-[190px] whitespace-nowrap px-3 py-4">Liên hệ</th>
                  <th className="w-[190px] whitespace-nowrap px-3 py-4">Dịch vụ yêu cầu</th>
                  <th className="w-[155px] whitespace-nowrap px-3 py-4">Cơ sở</th>
                  <th className="w-[180px] whitespace-nowrap px-3 py-4">Ngày hẹn</th>
                  <th className="w-[140px] whitespace-nowrap px-3 py-4">Ghi chú</th>
                  <th className="w-[130px] whitespace-nowrap px-3 py-4">Trạng thái</th>
                  <th className="w-[210px] whitespace-nowrap px-3 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-on-surface">
                {appointments.map((app, idx) => (
                  <tr
                    key={app.id}
                    className={`hover:bg-background-secondary transition-colors ${
                      idx % 2 === 1 ? "bg-background-secondary/30" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-4 font-mono text-xs font-semibold text-text-secondary">
                      #{app.id}
                    </td>
                    <td className="px-3 py-4">
                      <div className="truncate whitespace-nowrap font-bold text-text-primary" title={app.name}>{app.name}</div>
                      <div className="mt-0.5 whitespace-nowrap font-mono text-[11px] text-text-secondary">
                        {new Date(app.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <a
                        href={`tel:${app.phone}`}
                        className="block whitespace-nowrap font-mono text-xs font-bold text-brand-blue-dark hover:underline"
                      >
                        {app.phone}
                      </a>
                      {app.email && (
                        <a
                          href={`mailto:${app.email}`}
                          className="block max-w-[180px] truncate whitespace-nowrap text-[11px] text-text-secondary hover:text-text-primary"
                        >
                          {app.email}
                        </a>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <span className="block truncate whitespace-nowrap text-xs font-semibold text-text-primary" title={app.service?.name ?? "Khám tổng quát"}>
                        {app.service?.name ?? "Khám tổng quát"}
                      </span>
                    </td>
                    <td className="overflow-hidden px-3 py-4 text-xs font-semibold text-text-primary"><span className="block truncate whitespace-nowrap" title={app.clinic?.name ?? "Chưa chọn"}>{app.clinicId === "clinic-1" ? "CS1" : app.clinicId === "clinic-2" ? "CS2" : app.clinic?.label ?? "Chưa chọn"}</span></td>
                    <td className="whitespace-nowrap px-3 py-4 font-mono text-xs font-medium text-text-primary">
                      {new Date(app.appointmentDate).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="max-w-[140px] px-3 py-4">
                      {app.note ? (
                        <p className="text-xs text-text-secondary italic line-clamp-2" title={app.note}>
                          “{app.note}”
                        </p>
                      ) : (
                        <span className="text-text-secondary text-xs">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-4 text-right">
                      <AppointmentActions id={app.id.toString()} currentStatus={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <nav aria-label="Phân trang lịch hẹn" className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-text-secondary">{total} lịch hẹn · Trang {page} / {pageCount}</p>
        <div className="flex gap-3">
          {page > 1 ? <Link className="inline-flex min-h-11 items-center rounded-lg border border-border-subtle bg-white px-4" href={filterUrl(status, page - 1)}>Trang trước</Link> : <span aria-disabled="true" className="inline-flex min-h-11 items-center px-4 text-slate-400">Trang trước</span>}
          {page < pageCount ? <Link className="inline-flex min-h-11 items-center rounded-lg border border-border-subtle bg-white px-4" href={filterUrl(status, page + 1)}>Trang sau</Link> : <span aria-disabled="true" className="inline-flex min-h-11 items-center px-4 text-slate-400">Trang sau</span>}
        </div>
      </nav>
    </div>
  );
}
