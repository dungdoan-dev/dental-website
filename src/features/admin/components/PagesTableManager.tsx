import Link from "next/link";
import { db } from "@/lib/db";
import { navigation } from "@/config/navigation";

const pageTargets: Record<string, string> = {
  "/": "/admin/home",
  "/gioi-thieu": "/admin/content?section=about",
  "/dich-vu": "/admin/services",
  "/bac-si": "/admin/doctors",
  "/tin-tuc": "/admin/articles",
  "/lien-he": "/admin/clinics",
};

export async function PagesTableManager() {
  const [services, doctors, articles, appointments, revisions, slides, clinics] = await Promise.all([
    db.service.count(), db.doctor.count(), db.article.groupBy({ by: ["status"], _count: true }),
    db.appointment.groupBy({ by: ["status"], _count: true }),
    db.adminContentRevision.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.heroSlide.count(), db.clinic.count(),
  ]);
  const articleCounts = Object.fromEntries(articles.map((item) => [item.status, item._count]));
  const appointmentCounts = Object.fromEntries(appointments.map((item) => [item.status, item._count]));
  const publishedArticles = articleCounts.published ?? 0;
  const draftArticles = articleCounts.draft ?? 0;
  const publishedAppointments = (appointmentCounts.pending ?? 0) + (appointmentCounts.confirmed ?? 0);

  return <div className="flex flex-col gap-8">
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-sm font-semibold uppercase tracking-wider text-brand-blue-dark">Quản trị nội dung</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">Tổng quan hệ thống</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">Số liệu trực tiếp từ nội dung và lịch hẹn trong cơ sở dữ liệu.</p></div>
      <Link className="inline-flex min-h-11 items-center rounded-xl border border-border-subtle bg-white px-4 text-sm font-semibold text-text-primary" href="/">Mở website</Link>
    </header>

    <section aria-label="Tổng số bản ghi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Dịch vụ", value: services, href: "/admin/services" },
        { label: "Bác sĩ", value: doctors, href: "/admin/doctors" },
        { label: "Bài đã xuất bản", value: publishedArticles, href: "/admin/articles?status=published" },
        { label: "Lịch cần xử lý", value: publishedAppointments, href: "/admin/appointments" },
      ].map((metric) => <Link className="rounded-2xl border border-border-subtle bg-white p-5 transition-colors hover:border-brand-blue" href={metric.href} key={metric.label}><p className="text-sm font-medium text-text-secondary">{metric.label}</p><p className="mt-3 text-3xl font-bold tabular-nums text-text-primary">{metric.value.toLocaleString("vi-VN")}</p></Link>)}
    </section>

    <section aria-label="Trạng thái nội dung" className="grid gap-4 lg:grid-cols-3">
      <article className="rounded-2xl border border-border-subtle bg-white p-5"><p className="text-sm text-text-secondary">Bản nháp chưa xuất bản</p><p className="mt-2 text-2xl font-bold text-text-primary">{draftArticles}</p><Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue-dark" href="/admin/articles?status=draft">Xem bản nháp →</Link></article>
      <article className="rounded-2xl border border-border-subtle bg-white p-5"><p className="text-sm text-text-secondary">Slider trang chủ</p><p className="mt-2 text-2xl font-bold text-text-primary">{slides} slide</p><Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue-dark" href="/admin/home">Quản lý slider →</Link></article>
      <article className="rounded-2xl border border-border-subtle bg-white p-5"><p className="text-sm text-text-secondary">Cơ sở</p><p className="mt-2 text-2xl font-bold text-text-primary">{clinics}</p><Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue-dark" href="/admin/clinics">Quản lý cơ sở →</Link></article>
    </section>

    <section aria-labelledby="admin-pages-heading" className="space-y-4">
      <div><h2 className="text-xl font-bold text-text-primary" id="admin-pages-heading">Cấu hình theo trang</h2><p className="mt-1 text-sm text-text-secondary">Đi đến form đang quản lý dữ liệu của từng trang.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{navigation.map((item) => <Link className="rounded-xl border border-border-subtle bg-white p-4 transition-colors hover:border-brand-blue" href={pageTargets[item.href] ?? "/admin/pages"} key={item.href}><h3 className="font-semibold text-text-primary">{item.label}</h3><p className="mt-1 text-xs text-text-secondary">{item.href}</p></Link>)}</div>
    </section>

    <section aria-labelledby="admin-history-heading" className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
      <div className="border-b border-border-subtle p-5"><h2 className="font-bold text-text-primary" id="admin-history-heading">Lịch sử cập nhật gần đây</h2><p className="mt-1 text-sm text-text-secondary">Các phiên bản được lưu khi chỉnh sửa nội dung.</p></div>
      {revisions.length ? <ul className="divide-y divide-border-subtle">{revisions.map((revision) => <li className="flex flex-wrap items-center justify-between gap-3 p-4" key={revision.id.toString()}><div><p className="font-semibold text-text-primary">{revision.title}</p><p className="mt-1 text-xs text-text-secondary">{revision.kind} · {revision.actor}</p></div><time className="text-xs text-text-secondary" dateTime={revision.createdAt.toISOString()}>{revision.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</time></li>)}</ul> : <p className="p-5 text-sm text-text-secondary">Chưa có phiên bản nào được lưu.</p>}
    </section>
  </div>;
}
