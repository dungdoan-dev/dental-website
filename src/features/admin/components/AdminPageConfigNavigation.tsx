"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { navigation } from "@/config/navigation";

const adminPathBySitePath: Record<string, string> = {
  "/": "/admin/home",
  "/gioi-thieu": "/admin/content?section=about",
  "/dich-vu": "/admin/services",
  "/bac-si": "/admin/doctors",
  "/tin-tuc": "/admin/articles",
  "/lien-he": "/admin/content?section=contact",
};

function isActive(pathname: string, section: string, adminPath: string): boolean {
  if (section === "home" && adminPath === "/admin/home") return true;
  if (section === "implant" && adminPath === "/admin/services") return true;
  if (adminPath.startsWith("/admin/content?section=")) {
    return pathname === "/admin/content" && section === adminPath.split("=")[1];
  }
  const path = adminPath.split("?")[0];
  return pathname === path || (path !== "/admin/home" && pathname.startsWith(`${path}/`));
}

export function AdminPageConfigNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") ?? "";
  const isConfigRoute = pathname === "/admin/pages" || pathname === "/admin/home" || pathname === "/admin/content" || pathname === "/admin/services" || pathname === "/admin/doctors" || pathname === "/admin/articles";
  if (!isConfigRoute) return null;

  return (
    <nav aria-label="Cấu hình các trang website" className="sticky top-20 z-20 border-b border-border-subtle bg-white/95 px-4 py-2 backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto">
        {navigation.map((item) => {
          const href = adminPathBySitePath[item.href];
          if (!href) return null;
          const active = isActive(pathname, section, href);
          return <Link aria-current={active ? "page" : undefined} className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${active ? "bg-brand-blue-dark text-white" : "text-text-secondary hover:bg-surface-container-low hover:text-text-primary"}`} href={href} key={item.href}>{item.label}</Link>;
        })}
      </div>
    </nav>
  );
}
