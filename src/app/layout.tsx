import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { FloatingContactActions } from "@/components/common/FloatingContactActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { generateSeoMetadata } from "@/lib/seo";
import { AppShell } from "@/components/layout/AppShell";
import { AppointmentFooterSection } from "@/features/appointments/components/AppointmentFooterSection";
import { AppointmentDialogProvider } from "@/features/appointments/components/AppointmentDialogProvider";
import { getServices } from "@/features/services/services/service.service";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import "react-phone-input-2/lib/style.css";
import "@/styles/globals.css";

export const metadata: Metadata = generateSeoMetadata();
export const dynamic = "force-dynamic";

const manrope = Manrope({ subsets: ["latin", "vietnamese"], display: "swap" });

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  // Keep public pages and the admin login reachable if the database is unavailable.
  const [services, clinics, contactCtaSettings] = await Promise.all([
    getServices().catch(() => []).then((items) => items.map(({ id, name }) => ({ id, name }))),
    getClinics().catch(() => []),
    getContactCtaSettings(),
  ]);
  const appointmentClinics = clinics.map(({ id, label, address }) => ({ id, label, address }));

  return (
    <html lang="vi">
      <body className={`${manrope.className} bg-surface text-on-surface antialiased`}>
        <AppointmentDialogProvider clinics={appointmentClinics} services={services}>
          <AppShell
            topBar={<TopBar clinics={clinics} />}
            header={<Header />}
            appointmentFooter={<AppointmentFooterSection clinics={appointmentClinics} services={services} />}
            footer={<Footer clinics={clinics} />}
            floatingContact={<FloatingContactActions clinics={clinics} settings={contactCtaSettings} />}
          >
            {children}
          </AppShell>
        </AppointmentDialogProvider>
      </body>
    </html>
  );
}
