import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/features/admin/components/AdminLayoutShell";

export const metadata: Metadata = {
  title: "Admin Quản Trị Hệ Thống | Nha Khoa 2000",
  description: "Trang quản trị nội dung website Nha Khoa 2000",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Icon font is self-hosted (see globals.css); preload so icons do not flash as text. */}
      <link as="font" crossOrigin="anonymous" href="/fonts/material-symbols-admin.woff2" rel="preload" type="font/woff2" />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </>
  );
}
