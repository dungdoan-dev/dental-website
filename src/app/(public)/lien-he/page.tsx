import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { siteConfig } from "@/config/site";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { getDirectoryHero } from "@/features/content/services/directory-hero.service";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import { getServices } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Liên hệ và đặt lịch", url: "/lien-he" });

export default async function ContactPage() {
  const [clinics, contactSettings, hero, services] = await Promise.all([
    getClinics().catch(() => []),
    getContactCtaSettings(),
    getDirectoryHero("contact"),
    getServices().then((items) => items.map(({ id, name }) => ({ id, name }))).catch(() => []),
  ]);
  const foreignChannels = [{ label: "Viber", href: contactSettings.viberUrl }, { label: "WhatsApp", href: contactSettings.whatsappUrl }]
    .filter((channel): channel is { label: string; href: string } => Boolean(channel.href));

  return (
    <main className="bg-surface">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue-light/70 via-white to-brand-green-light/40 py-6 md:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" />
        <Container className="relative">
          <Breadcrumb items={[{ label: "Liên hệ" }]} />
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
            <div>
              <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-text-primary">
                {hero.title}
              </h1>
              {/* No-break space keeps "Đội ngũ" on one line. */}
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
                {hero.description.replaceAll("Đội ngũ", "Đội ngũ")}
              </p>

              <section aria-labelledby="clinic-contact-title" className="mt-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">Hệ thống phòng khám</p>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-text-primary" id="clinic-contact-title">Chọn cơ sở thuận tiện cho bạn</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">Xem địa chỉ, giờ làm việc và liên hệ trực tiếp từng cơ sở trước khi đến thăm khám.</p>
                {clinics.length > 0 ? (
                  <div className="mt-6 grid items-stretch gap-5 sm:grid-cols-2">
                    {clinics.map((clinic) => <ClinicCard clinic={clinic} compact key={clinic.id} showEmail />)}
                  </div>
                ) : (
                  <div className="mt-6 rounded-md border border-border-subtle bg-white p-8 text-center text-text-secondary">
                    Hiện chưa tải được thông tin cơ sở. Vui lòng gọi {siteConfig.contact.phone} để được hỗ trợ.
                  </div>
                )}
                {foreignChannels.length > 0 && (
                  <p className="mt-5 text-sm text-text-secondary">
                    Khách nước ngoài liên hệ qua:{" "}
                    {foreignChannels.map((channel, index) => (
                      <span key={channel.label}>{index > 0 ? ", " : ""}<a className="font-semibold text-brand-blue-dark underline underline-offset-4" href={channel.href} rel="noreferrer" target="_blank">{channel.label}<span className="sr-only"> (mở trong tab mới)</span></a></span>
                    ))}
                  </p>
                )}
              </section>
            </div>

            <div className="lg:sticky lg:top-28" id="dat-lich">
              <AppointmentForm clinics={clinics.map(({ id, name, address }) => ({ id, label: name, address }))} services={services} />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
