"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/admin-ui/sidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToastViewport } from "./AdminToast";

export function AdminLayoutShell({ children, email, pendingAppointments }: { children: ReactNode; email: string; pendingAppointments: Promise<number> }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;

  return (
    <SidebarProvider className="admin-root font-body-md text-body-md text-foreground antialiased">
      <Suspense fallback={null}><AdminSidebar pendingAppointments={pendingAppointments} /></Suspense>
      <SidebarInset className="min-w-0 bg-background">
        <AdminHeader email={email} pendingAppointments={pendingAppointments} />
        <main className="relative min-w-0 flex-1">{children}</main>
      </SidebarInset>
      <AdminToastViewport />
    </SidebarProvider>
  );
}
