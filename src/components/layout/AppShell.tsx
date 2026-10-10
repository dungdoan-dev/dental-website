"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppShellProps = {
  topBar: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  appointmentFooter: ReactNode;
  floatingContact: ReactNode;
  children: ReactNode;
};

export function AppShell({ topBar, header, footer, appointmentFooter, floatingContact, children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const appointmentFormExcludedRoutes = ["/gioi-thieu", "/dich-vu", "/bac-si", "/tin-tuc"];
  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  const hideAppointmentFooter = appointmentFormExcludedRoutes.some(
    (route) => normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );

  if (isAdmin) {
    return <div className="min-h-screen bg-[#f7f9ff] text-[#181c20] antialiased">{children}</div>;
  }

  return (
    <>
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-brand-blue-dark focus:shadow-lg" href="#site-main">Bỏ qua menu, đến nội dung chính</a>
      {topBar}
      {header}
      <main className="min-h-[60vh] pt-[98px]" id="site-main" tabIndex={-1}>{children}</main>
      {pathname !== "/" && !hideAppointmentFooter ? appointmentFooter : null}
      {footer}
      {floatingContact}
    </>
  );
}
