import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AdminLayoutShell } from "@/features/admin/components/AdminLayoutShell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Quản Trị Hệ Thống | Nha Khoa 2000",
  description: "Trang quản trị nội dung website Nha Khoa 2000",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Signed-in admin's email for the sidebar menu; empty on the login page.
  const supabase = await getSupabaseServerClient();
  // Bell and menu badge: appointments waiting for approval. Started now, awaited by the badges (see PendingCount), so it
  // never blocks the page. Skipped without an auth cookie (login page) because the table is admin-only.
  const hasSession = (await cookies()).getAll().some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));
  const pendingAppointments: Promise<number> = hasSession
    ? Promise.resolve(supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending")).then((result) => result.count ?? 0, () => 0)
    : Promise.resolve(0);
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : "";
  return (
    <>
      {/* Icon font is self-hosted (see globals.css); preload so icons do not flash as text. */}
      <link as="font" crossOrigin="anonymous" href="/fonts/material-symbols-admin.woff2" rel="preload" type="font/woff2" />
      <AdminLayoutShell email={email} pendingAppointments={pendingAppointments}>{children}</AdminLayoutShell>
    </>
  );
}
