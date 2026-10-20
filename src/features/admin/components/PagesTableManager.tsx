import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, HeartPulse, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/admin-ui/badge";
import { Button } from "@/components/admin-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin-ui/card";
import { navigation } from "@/config/navigation";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const pageTargets: Record<string, string> = {
  "/": "/admin/home",
  "/gioi-thieu": "/admin/content?section=about",
  "/dich-vu": "/admin/services",
  "/bac-si": "/admin/doctors",
  "/tin-tuc": "/admin/articles",
  "/lien-he": "/admin/clinics",
};

type Metric = { label: string; value: number; href: string; icon: LucideIcon; tone: string };

export async function PagesTableManager() {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [summary, revisions] = await Promise.all([
    supabase.rpc("admin_dashboard_counts"),
    supabase.from("admin_content_revisions").select("id,kind,entity_id,title,actor,created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  if (revisions.error) throw revisions.error;
  if (summary.error) throw summary.error;
  const counts = summary.data as Record<string, number>;

  const pendingAppointments = (counts.pending_appointments ?? 0) + (counts.confirmed_appointments ?? 0);
  const metrics: Metric[] = [
    { label: "Lịch cần xử lý", value: pendingAppointments, href: "/admin/appointments", icon: CalendarClock, tone: "bg-amber-500/10 text-amber-600" },
    { label: "Dịch vụ", value: counts.services ?? 0, href: "/admin/services", icon: HeartPulse, tone: "bg-primary/10 text-primary" },
    { label: "Bác sĩ", value: counts.doctors ?? 0, href: "/admin/doctors", icon: Users, tone: "bg-emerald-500/10 text-emerald-600" },
    { label: "Bài đã xuất bản", value: counts.published_articles ?? 0, href: "/admin/articles?status=published", icon: FileText, tone: "bg-violet-500/10 text-violet-600" },
  ];
  const shortcuts = [
    { label: "Bản nháp chưa xuất bản", value: `${counts.draft_articles ?? 0} bài`, href: "/admin/articles?status=draft", cta: "Xem bản nháp" },
    { label: "Slider trang chủ", value: `${counts.slides ?? 0} slide`, href: "/admin/home", cta: "Quản lý slider" },
    { label: "Cơ sở phòng khám", value: `${counts.clinics ?? 0} cơ sở`, href: "/admin/clinics", cta: "Quản lý cơ sở" },
  ];

  return <div className="flex flex-col gap-6">
    <PageHeader
      actions={<Button asChild size="sm" variant="outline"><Link prefetch={false} href="/" rel="noreferrer" target="_blank">Mở website</Link></Button>}
      description="Số liệu trực tiếp từ nội dung và lịch hẹn trong cơ sở dữ liệu."
      title="Tổng quan hệ thống"
    />

    <section aria-label="Tổng số bản ghi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Link className="group" href={metric.href} key={metric.label}>
          <Card className="h-full gap-0 py-5 transition-transform duration-300 group-hover:-translate-y-1">
            <CardContent className="flex items-center gap-4 px-5">
              <span aria-hidden="true" className={`grid size-12 shrink-0 place-items-center rounded-full ${metric.tone}`}><metric.icon className="size-6" /></span>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold tabular-nums">{metric.value.toLocaleString("vi-VN")}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>

    <section aria-label="Trạng thái nội dung" className="grid gap-4 lg:grid-cols-3">
      {shortcuts.map((item) => (
        <Card className="gap-3 py-5" key={item.label}>
          <CardContent className="px-5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-xl font-bold">{item.value}</p>
            <Link className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline" href={item.href}>{item.cta} <ArrowRight className="size-4" /></Link>
          </CardContent>
        </Card>
      ))}
    </section>

    <section aria-labelledby="admin-pages-heading" className="space-y-3">
      <div><h2 className="text-lg font-semibold" id="admin-pages-heading">Cấu hình theo trang</h2><p className="text-sm text-muted-foreground">Đi đến form đang quản lý dữ liệu của từng trang.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {navigation.map((item) => (
          <Link className="group" href={pageTargets[item.href] ?? "/admin"} key={item.href}>
            <Card className="gap-0 py-4 transition-colors group-hover:bg-sidebar-accent">
              <CardContent className="flex items-center justify-between gap-3 px-5">
                <div className="min-w-0"><h3 className="font-semibold">{item.label}</h3><p className="font-mono text-xs text-muted-foreground">{item.href}</p></div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>

    <Card aria-labelledby="admin-history-heading" className="gap-0 overflow-hidden py-0">
      <CardHeader className="border-b py-5">
        <CardTitle id="admin-history-heading">Lịch sử cập nhật gần đây</CardTitle>
        <CardDescription>Các phiên bản được lưu khi chỉnh sửa nội dung.</CardDescription>
      </CardHeader>
      {revisions.data?.length
        ? <ul className="divide-y">{revisions.data.map((revision) => (
          <li className="flex flex-wrap items-center justify-between gap-3 px-6 py-4" key={revision.id.toString()}>
            <div className="min-w-0">
              <p className="truncate font-medium">{revision.title}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Badge variant="secondary">{revision.kind}</Badge>{revision.actor}</p>
            </div>
            <time className="text-xs text-muted-foreground" dateTime={revision.created_at}>{new Date(revision.created_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</time>
          </li>
        ))}</ul>
        : <p className="px-6 py-5 text-sm text-muted-foreground">Chưa có phiên bản nào được lưu.</p>}
    </Card>
  </div>;
}
