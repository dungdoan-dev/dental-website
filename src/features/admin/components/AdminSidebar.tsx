"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  dot?: boolean;
};

const CONTENT_NAV: readonly NavItem[] = [
  { href: "/admin", label: "Tổng quan & Danh sách trang", icon: "auto_stories", dot: true },
  { href: "/admin/pages", label: "Cấu hình trang", icon: "web" },
];

const OPS_NAV: readonly NavItem[] = [
  { href: "/admin/appointments", label: "Quản lý Đặt hẹn", icon: "calendar_month", badge: "Live" },
  { href: "/admin/clinics", label: "Cơ sở Phòng khám", icon: "verified_user" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isItemActive(href: string): boolean {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/pages") return ["/admin/pages", "/admin/home", "/admin/content", "/admin/services", "/admin/doctors", "/admin/articles"].some((path) => pathname === path || pathname.startsWith(`${path}/`));
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-on-surface shadow-md border border-border-subtle"
          type="button"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[20px]">{isOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col justify-between border-r border-border-subtle/60 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex min-h-0 flex-col overflow-y-auto">
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-border-subtle/60">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/logo/nha-khoa-2000.png"
                alt="Nha Khoa 2000"
                width={126}
                height={42}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-light px-2.5 py-0.5 text-[11px] font-bold text-brand-green-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
              v4.8
            </span>
          </div>

          {/* Group 1: Quản Trị Nội Dung */}
          <div className="px-4 py-3">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              Quản Trị Nội Dung
            </p>
            <nav className="flex flex-col gap-1">
              {CONTENT_NAV.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all text-sm ${
                      active
                        ? "bg-brand-blue-light text-brand-blue-dark font-semibold shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-colors ${
                          active ? "text-brand-blue-dark" : "text-text-secondary group-hover:text-on-surface"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.dot && active && (
                      <span className="h-2 w-2 rounded-full bg-brand-green shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Group 2: Vận Hành & Đặt Hẹn */}
          <div className="px-4 py-2">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              Vận Hành & Đặt Hẹn
            </p>
            <nav className="flex flex-col gap-1">
              {OPS_NAV.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all text-sm ${
                      active
                        ? "bg-brand-blue-light text-brand-blue-dark font-semibold shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[20px] transition-colors ${
                          active ? "text-brand-blue-dark" : "text-text-secondary group-hover:text-on-surface"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark text-[11px] font-bold shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 bg-white border-t border-border-subtle/60">
          <div className="p-2.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-text-primary truncate">BS. Quản Trị Hệ Thống</span>
                <span className="text-[11px] text-brand-blue-dark font-medium truncate">Super Admin</span>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Về Website Chính"
              className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
