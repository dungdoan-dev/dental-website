"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "../auth/actions";

const SECTION_LABELS: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/pages": "Cấu hình trang",
  "/admin/home": "Trang chủ",
  "/admin/content": "Nội dung website",
  "/admin/services": "Dịch vụ",
  "/admin/doctors": "Đội ngũ bác sĩ",
  "/admin/articles": "Bài viết",
  "/admin/appointments": "Lịch hẹn",
  "/admin/clinics": "Cơ sở phòng khám",
};

export function AdminHeader() {
  const pathname = usePathname();
  const section = SECTION_LABELS[pathname] ?? "Quản trị nội dung";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border-subtle bg-white/95 px-4 shadow-[0_2px_12px_rgba(20,70,85,0.05)] backdrop-blur-xl sm:px-6 lg:left-72 lg:px-8">
      <div className="min-w-0 pl-12 lg:pl-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link className="transition hover:text-brand-blue-dark" href="/admin">Quản trị</Link>
          <span aria-hidden="true" className="text-border-subtle">/</span>
          <span className="truncate font-semibold text-text-primary">{section}</span>
        </div>
        <p className="mt-1 hidden text-[11px] text-text-secondary sm:block">Cổng quản trị Nha Khoa 2000</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border-subtle bg-white px-3 text-xs font-semibold text-text-primary transition hover:border-brand-blue/40 hover:bg-brand-blue-light sm:px-4"
          href="/"
          target="_blank"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
          <span className="hidden sm:inline">Xem website</span>
        </Link>
        <form action={logoutAdmin}>
          <button className="min-h-10 rounded-xl bg-brand-blue-dark px-3 text-xs font-bold text-white transition hover:bg-brand-blue-hover sm:px-4" type="submit">
            Đăng xuất
          </button>
        </form>
      </div>
    </header>
  );
}
