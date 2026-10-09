import type { Metadata } from "next";
import Image from "next/image";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { getClinics } from "@/features/clinics/services/clinic.service";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Liên hệ và đặt lịch", url: "/lien-he" });

function ClinicContactCard({ clinic, index }: { clinic: Clinic; index: number }) {
  const clinicNumber = `CS${index + 1}`;
  const phoneLink = `tel:${clinic.phone.replace(/[^\d+]/g, "")}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[16/7] overflow-hidden bg-surface-container-low">
        <Image
          alt={`Không gian ${clinic.name}`}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          src={clinic.image}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-brand-blue-dark shadow-sm">{clinicNumber} · {clinic.badge}</span>
        <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{clinic.label}</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{clinic.name}</h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="leading-7 text-text-secondary">{clinic.description}</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue-dark"><Icon className="h-5 w-5" name="location" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">Địa chỉ</p>
              <p className="mt-1 text-sm font-medium leading-6 text-text-primary">{clinic.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green-dark"><Icon className="h-5 w-5" name="clock" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">Giờ làm việc</p>
              <p className="mt-1 text-sm font-medium leading-6 text-text-primary">{clinic.workingHours}</p>
            </div>
          </div>
        </div>

        {clinic.facilities.length > 0 ? (
          <ul aria-label={`Tiện ích tại ${clinic.name}`} className="mt-4 flex flex-wrap gap-2">
            {clinic.facilities.slice(0, 3).map((facility) => (
              <li className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary" key={facility}>{facility}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 border-t border-border-subtle pt-4 sm:flex-row">
          <a aria-label={`Gọi ${clinicNumber}, ${clinic.phone}`} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-blue-dark px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2" href={phoneLink}>
            <Icon className="h-5 w-5" name="phone" />
            {clinic.phone}
          </a>
          {clinic.googleMapsUrl ? (
            <a aria-label={`Chỉ đường đến ${clinicNumber} (mở tab mới)`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-subtle px-5 py-3 text-sm font-bold text-text-primary transition-colors hover:border-brand-blue hover:bg-brand-blue-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2" href={clinic.googleMapsUrl} rel="noopener noreferrer" target="_blank">
              <Icon className="h-5 w-5 text-brand-blue-dark" name="map" />
              Chỉ đường
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function ContactPage() {
  const clinics = await getClinics().catch(() => []);

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
              {clinics.map((clinic, index) => <ClinicContactCard clinic={clinic} index={index} key={clinic.id} />)}
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
