"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminPageConfigNavigation } from "./AdminPageConfigNavigation";

export function AdminLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return children;

  return (
    <div className="min-h-screen bg-[#f4f8fb] font-body-md text-body-md text-on-surface antialiased">
      <AdminSidebar />
      <div className="pl-0 lg:pl-72">
        <AdminHeader />
        <main className="relative min-h-screen w-full bg-background pt-20">
          <Suspense fallback={null}><AdminPageConfigNavigation /></Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
