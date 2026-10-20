import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { AppointmentActions } from "@/features/admin/components/AppointmentActions";
import { normalizeAppointmentFilters, applyAppointmentFilters, appointmentCountArgs } from "@/features/admin/services/appointment-filters";
import Link from "next/link";
import { CalendarX2, ChevronLeft, ChevronRight, Download, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/admin-ui/badge";
import { Button } from "@/components/admin-ui/button";
import { Card, CardContent } from "@/components/admin-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/table";
import { PageHeader } from "@/features/admin/components/PageHeader";
import type { AppointmentStatus } from "@/features/appointments/types/appointment.type";
import { NotificationRetryButton } from "@/features/admin/components/NotificationRetryButton";

type AppointmentRow = {
  id: string | number;
  name: string;
  phone: string;
  email: string | null;
  appointment_date: string;
  created_at: string;
  note: string | null;
  status: AppointmentStatus;
  clinic_id: string | null;
  clinic: { name: string; label: string } | null;
  service: { name: string } | null;
};

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
  const filters = normalizeAppointmentFilters(raw);
  const supabase = await getSupabaseServerClient();
  // clinicId is not checked against the clinic list so the counts can load in parallel; an unknown id just matches nothing.
  const clinicId = filters.clinicId;
  const status = filters.status;
  const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;
  const pageSize = 25;
  // Fresh builder per call (a Postgrest builder mutates itself) so a second page can be fetched when needed.
  const loadRows = (pageNumber: number) => {
    const appointmentsQuery = supabase.from("appointments").select("id,name,phone,email,appointment_date,created_at,note,status,clinic_id,service:services(name),clinic:clinics(name,label)");
    applyAppointmentFilters(appointmentsQuery, filters);
    return appointmentsQuery.order("created_at", { ascending: false }).order("id", { ascending: false })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);
  };
  const [{ data: clinics, error: clinicsError }, { data: statusCounts, error: countsError }, firstRows] = await Promise.all([
    supabase.from("clinics").select("id,label").order("id"),
    supabase.rpc("admin_appointment_status_counts", appointmentCountArgs(filters)),
    loadRows(filters.page),
  ]);
  if (clinicsError) throw clinicsError;
  if (countsError) throw countsError;
  const countMap: Record<string, number> = Object.fromEntries(statuses.map((value) => [value, 0]));
  for (const row of statusCounts ?? []) countMap[row.status] = Number(row.total);
  const totalCount = statuses.reduce((sum, value) => sum + countMap[value], 0);
  const total = status ? countMap[status] : totalCount;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, pageCount);
  const { data: appointmentRows, error: appointmentsError } = page === filters.page ? firstRows : await loadRows(page);
  if (appointmentsError) throw appointmentsError;
  const appointments = (appointmentRows as unknown as AppointmentRow[]).map((row) => ({
    ...row, clinicId: row.clinic_id, createdAt: row.created_at, appointmentDate: new Date(row.appointment_date),
    clinic: row.clinic, service: row.service,
  }));

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

  const exportQuery = new URLSearchParams(Object.entries({ ...(filters.q ? { q: filters.q } : {}), ...(clinicId ? { clinicId } : {}), ...(filters.date ? { date: filters.date } : {}), ...(status ? { status } : {}) }));
  const clinicLabel = (id: string | null, name?: string) => id === "clinic-1" ? "CS1" : id === "clinic-2" ? "CS2" : name ?? "Chưa chọn";

  return (
    <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<>
          <NotificationRetryButton />
          <Button asChild size="sm" variant="outline"><Link href={`/admin/appointments/export?${exportQuery}`}><Download /> Xuất CSV</Link></Button>
          <Button asChild size="sm" variant="soft"><Link prefetch={false} href="/lien-he" rel="noreferrer" target="_blank"><ExternalLink /> Mở form đặt hẹn</Link></Button>
        </>}
        description="Tiếp nhận, xử lý và phân luồng các cuộc hẹn khám trực tuyến từ bệnh nhân Nha Khoa 2000."
        title="Đặt lịch hẹn"
      />

      {(raw.status && !status) || (raw.clinicId && !clinicId) || (raw.date && !filters.date) ? <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="status">Một bộ lọc trên URL không hợp lệ đã được bỏ qua.</p> : null}

      <Card className="py-5">
        <CardContent className="px-5">
          <form className="admin-inline-form grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto]" method="get">
            {status && <input name="status" type="hidden" value={status} />}
            <label>Tên hoặc số điện thoại<input defaultValue={filters.q} maxLength={100} name="q" placeholder="Tìm khách hàng…" /></label>
            <label>Cơ sở<select defaultValue={clinicId ?? ""} name="clinicId"><option value="">Tất cả cơ sở</option>{clinics.map((clinic, index) => <option key={clinic.id} value={clinic.id}>{clinicLabel(clinic.id, clinic.label || `CS${index + 1}`)}</option>)}</select></label>
            <label>Ngày hẹn<input defaultValue={filters.date} name="date" type="date" /></label>
            <div className="flex items-end gap-2">
              <Button className="h-11" type="submit"><Search /> Lọc</Button>
              <Button asChild className="h-11" variant="ghost"><Link href="/admin/appointments">Xóa lọc</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <nav aria-label="Lọc theo trạng thái" className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-[7px] bg-white p-1 shadow-card">
        {tabs.map((tab) => {
          const isActive = (status ?? "") === tab.value;
          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-primary"}`}
              href={filterUrl(tab.value)}
              key={tab.label}
            >
              {tab.label}
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>{tab.count}</span>
            </Link>
          );
        })}
      </nav>

      <Card className="gap-0 overflow-hidden py-0">
        {appointments.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarX2 className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">Không có lịch hẹn nào</p>
            <p className="mt-1 text-xs text-muted-foreground">{status ? "Không tìm thấy yêu cầu theo trạng thái này" : "Chưa có lượt đặt hẹn nào từ người dùng"}</p>
          </div>
        ) : (
          <Table aria-label="Danh sách lịch hẹn" className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-20 pl-6">Mã</TableHead>
                <TableHead className="w-44">Khách hàng</TableHead>
                <TableHead className="w-48">Liên hệ</TableHead>
                <TableHead className="w-44">Dịch vụ yêu cầu</TableHead>
                <TableHead className="w-28">Cơ sở</TableHead>
                <TableHead className="w-44">Ngày hẹn</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="w-36">Trạng thái</TableHead>
                <TableHead className="w-56 pr-6 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">#{app.id}</TableCell>
                  <TableCell>
                    <div className="truncate font-semibold" title={app.name}>{app.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{new Date(app.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
                  </TableCell>
                  <TableCell>
                    <a className="block font-mono text-xs font-semibold text-primary hover:underline" href={`tel:${app.phone}`}>{app.phone}</a>
                    {app.email && <a className="block max-w-[180px] truncate text-xs text-muted-foreground hover:text-foreground" href={`mailto:${app.email}`}>{app.email}</a>}
                  </TableCell>
                  <TableCell><span className="block truncate text-sm" title={app.service?.name ?? "Khám tổng quát"}>{app.service?.name ?? "Khám tổng quát"}</span></TableCell>
                  <TableCell><Badge title={app.clinic?.name} variant="outline">{clinicLabel(app.clinicId, app.clinic?.label)}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{new Date(app.appointmentDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell className="max-w-[220px] whitespace-normal">{app.note ? <p className="line-clamp-2 text-xs italic text-muted-foreground" title={app.note}>“{app.note}”</p> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell><StatusBadge status={app.status} /></TableCell>
                  <TableCell className="pr-6 text-right"><AppointmentActions currentStatus={app.status} id={app.id.toString()} name={app.name} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <nav aria-label="Phân trang lịch hẹn" className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground">{total} lịch hẹn · Trang {page} / {pageCount}</p>
        <div className="flex gap-2">
          {page > 1 ? <Button asChild size="sm" variant="outline"><Link href={filterUrl(status, page - 1)}><ChevronLeft /> Trang trước</Link></Button> : <Button aria-disabled="true" disabled size="sm" variant="outline"><ChevronLeft /> Trang trước</Button>}
          {page < pageCount ? <Button asChild size="sm" variant="outline"><Link href={filterUrl(status, page + 1)}>Trang sau <ChevronRight /></Link></Button> : <Button aria-disabled="true" disabled size="sm" variant="outline">Trang sau <ChevronRight /></Button>}
        </div>
      </nav>
    </div>
  );
}
