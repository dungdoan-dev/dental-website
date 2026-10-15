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
      {/* Subset to the icons in use (~8 KB vs ~1 MB). A new icon must be added here (alphabetical) or it renders as plain text. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=apartment,article,auto_stories,badge,calendar_month,calendar_today,call,category,check_circle,close,corporate_fare,delete,edit_note,error,help,home,medical_services,menu,open_in_new,person,rate_review,verified_user,web&display=block"
      />
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </>
  );
}
