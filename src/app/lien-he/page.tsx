import type { Metadata } from "next";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Liên hệ và đặt lịch", url: "/lien-he" });

export default async function ContactPage() {
  const [clinics, contactSettings] = await Promise.all([getClinics().catch(() => []), getContactCtaSettings()]);

  return (
    <main className="bg-surface">
      <section className="relative overflow-hidden border-b border-border-subtle bg-gradient-to-br from-brand-blue-light/70 via-white to-brand-green-light/40 py-8 sm:py-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" />
        <Container className="relative">
          <Breadcrumb items={[{ label: "Liên hệ" }]} />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.72fr] lg:gap-14">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue-dark">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-green" />
                Nha Khoa 2000 · TP. Hồ Chí Minh
              </p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                Chúng tôi luôn sẵn sàng <span className="text-brand-blue-dark">lắng nghe bạn.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
                Liên hệ để được hỗ trợ chọn cơ sở, tìm hiểu dịch vụ hoặc gửi yêu cầu đặt lịch. Đội ngũ Nha Khoa 2000 sẽ tiếp nhận và liên hệ xác nhận với bạn.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <AppointmentButton className="min-h-12 rounded-full px-6 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2">
                  <Icon className="mr-2 h-5 w-5" name="calendar" />Đặt lịch thăm khám
                </AppointmentButton>
                {clinics[0] ? (
                  <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-white px-6 py-3 text-sm font-bold text-text-primary shadow-sm transition-colors hover:border-brand-blue hover:text-brand-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2" href={`tel:${clinics[0].phone.replace(/[^\d+]/g, "")}`}>
                    <Icon className="h-5 w-5 text-brand-green-dark" name="phone" />Gọi {clinics[0].phone}
                  </a>
                ) : null}
              </div>
            </div>

            <aside aria-label="Thông tin liên hệ nhanh" className="rounded-3xl bg-brand-blue-dark p-6 text-white shadow-xl shadow-brand-blue-dark/15 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-green-light"><Icon className="h-6 w-6" name="chat" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">Bạn cần hỗ trợ?</p>
                  <h2 className="mt-1 text-xl font-bold">Kết nối với chúng tôi</h2>
                </div>
              </div>
              <div className="mt-6 divide-y divide-white/15">
                {clinics.map((clinic, index) => (
                  <a className="flex min-h-16 items-center justify-between gap-4 py-4 transition-colors hover:text-brand-green-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" href={`tel:${clinic.phone.replace(/[^\d+]/g, "")}`} key={clinic.id}>
                    <span><span className="block text-xs font-semibold text-white/65">CS{index + 1} · {clinic.label}</span><span className="mt-1 block font-bold">{clinic.phone}</span></span>
                    <Icon className="h-5 w-5 shrink-0" name="arrow-right" />
                  </a>
                ))}
                <a className="flex min-h-16 items-center justify-between gap-4 py-4 transition-colors hover:text-brand-green-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" href={`mailto:${siteConfig.contact.email}`}>
                  <span><span className="block text-xs font-semibold text-white/65">Email</span><span className="mt-1 block break-all font-medium">{siteConfig.contact.email}</span></span>
                  <Icon className="h-5 w-5 shrink-0" name="arrow-right" />
                </a>
                {[{ label: "Viber", href: contactSettings.viberUrl }, { label: "WhatsApp", href: contactSettings.whatsappUrl }].some((channel) => channel.href) ? <div className="border-t border-white/15 py-4"><p className="text-xs font-semibold text-white/65">Liên hệ cho khách nước ngoài</p><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{[{ label: "Viber", href: contactSettings.viberUrl }, { label: "WhatsApp", href: contactSettings.whatsappUrl }].filter((channel): channel is { label: string; href: string } => Boolean(channel.href)).map((channel) => <a className="text-sm font-bold underline decoration-white/40 underline-offset-4 transition-colors hover:text-brand-green-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" href={channel.href} key={channel.label} rel="noreferrer" target="_blank">{channel.label}<span className="sr-only"> (mở trong tab mới)</span></a>)}</div></div> : null}
              </div>
              <p className="mt-4 text-xs leading-5 text-white/65">Gửi yêu cầu đặt lịch trực tuyến để chúng tôi chủ động liên hệ xác nhận thời gian phù hợp.</p>
            </aside>
          </div>
        </Container>
      </section>

      <section aria-labelledby="clinic-contact-title" className="py-12 sm:py-16 lg:py-20">
        <Container className="max-w-5xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">Hệ thống phòng khám</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl" id="clinic-contact-title">Chọn cơ sở thuận tiện cho bạn</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-text-secondary">Xem địa chỉ, giờ làm việc và gọi trực tiếp cho từng cơ sở trước khi đến thăm khám.</p>
          </div>

          {clinics.length > 0 ? (
            <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
              {clinics.map((clinic) => <ClinicCard clinic={clinic} key={clinic.id} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-white p-8 text-center text-text-secondary">
              Hiện chưa tải được thông tin cơ sở. Vui lòng gọi {siteConfig.contact.phone} để được hỗ trợ.
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
