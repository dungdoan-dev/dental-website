"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminToastViewport } from "./AdminToast";

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-dvh min-w-0 bg-[#f4f8fb] font-body-md text-body-md text-on-surface antialiased">
      <Suspense fallback={null}><AdminSidebar /></Suspense>
      <div className="min-w-0 lg:pl-72">
        <AdminHeader />
        <main className="relative min-h-dvh min-w-0 w-full bg-background pt-20">
          {children}
        </main>
      </div>
      <AdminToastViewport />
    </div>
  );
}
