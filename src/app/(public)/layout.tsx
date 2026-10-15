import type { ReactNode } from "react";
import { FloatingContactActions } from "@/components/common/FloatingContactActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { AppShell } from "@/components/layout/AppShell";
import { AppointmentFooterSection } from "@/features/appointments/components/AppointmentFooterSection";
import { AppointmentDialogProvider } from "@/features/appointments/components/AppointmentDialogProvider";
import { getServices } from "@/features/services/services/service.service";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import "react-phone-input-2/lib/style.css";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [services, clinics, contactCtaSettings] = await Promise.all([
    getServices().then((items) => items.map(({ id, name }) => ({ id, name }))),
    getClinics(),
    getContactCtaSettings(),
  ]);
  const appointmentClinics = clinics.map(({ id, name, address }) => ({ id, label: name, address }));

  return (
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
  );
}
