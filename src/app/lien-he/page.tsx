import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { ContactAppointmentForm } from "@/features/appointments/components/ContactAppointmentForm";
import { getServices } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Liên hệ và đặt lịch", url: "/lien-he" });

export default async function ContactPage() {
  const services = await getServices();

  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumb items={[{ label: "Liên hệ" }]} />
      <SectionTitle description="Chọn dịch vụ và thời gian phù hợp, hoặc liên hệ trực tiếp với cơ sở gần bạn." title="Liên hệ và đặt lịch" />
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <ContactAppointmentForm services={services.map(({ id, name }) => ({ id, name }))} />
        <aside aria-label="Thông tin liên hệ các cơ sở" className="space-y-5">
          {siteConfig.clinics.map((clinic) => (
            <div className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm" key={clinic.id}>
              <h2 className="text-lg font-bold text-text-primary">{clinic.label} · {clinic.district}</h2>
              <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-text-secondary"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue-dark" name="location" />{clinic.address}</p>
              <a className="mt-3 inline-flex items-center gap-2 font-bold text-brand-blue-dark hover:underline" href={`tel:${clinic.phone.replaceAll(" ", "")}`}><Icon className="h-5 w-5" name="phone" />{clinic.phone}</a>
            </div>
          ))}
          <div className="rounded-2xl bg-brand-blue-light p-6 text-sm text-text-secondary">
            <p className="font-bold text-text-primary">Liên hệ qua email</p>
            <a className="mt-2 inline-block font-semibold text-brand-blue-dark hover:underline" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </div>
        </aside>
      </div>
    </Container>
  );
}
