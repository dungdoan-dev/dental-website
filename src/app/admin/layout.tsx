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
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </>
  );
}
