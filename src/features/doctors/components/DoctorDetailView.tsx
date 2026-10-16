import Image from "next/image";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { getDoctorFullName } from "../utils/doctor-card-name";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Icon } from "@/components/ui/Icon";
import type { Doctor } from "../types/doctor.type";
import { DoctorCertificateCarousel } from "./DoctorCertificateCarousel";

type DoctorDetailViewProps = { doctor: Doctor };

function DetailList({ title, items, markerColor }: { title: string; items: readonly string[]; markerColor: string }) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-border-subtle pb-2 text-lg font-bold uppercase tracking-tight text-text-primary">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li className="flex items-start gap-3 leading-relaxed text-text-primary" key={item}>
            <span aria-hidden="true" className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${markerColor}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DoctorDetailView({ doctor }: DoctorDetailViewProps) {
  const profile = doctor.profile;
  const specialties = profile?.specialties ?? [];

  return (
    <>
      <div className="border-b border-border-subtle bg-white">
        <div className="mx-auto max-w-7xl px-margin-mobile py-3.5 md:px-margin">
          <Breadcrumb className="" items={[{ label: "Đội ngũ bác sĩ", href: "/bac-si" }, { label: getDoctorFullName(doctor) }]} />
        </div>
      </div>
      <article className="bg-white py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-margin-mobile md:px-margin lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            <ImageLightbox alt={`Chân dung ${getDoctorFullName(doctor)}`} caption={getDoctorFullName(doctor)} className="relative block aspect-[3/4] overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm" src={doctor.avatar}>
              <Image alt={`Chân dung ${getDoctorFullName(doctor)}`} className="object-cover object-top" fill priority sizes="(max-width: 1024px) 100vw, 400px" src={doctor.avatar} />
            </ImageLightbox>
            <div className="space-y-3">
              {profile?.licenseNumber ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary"><Icon className="h-5 w-5 text-brand-blue" name="shield-check" />Chứng chỉ hành nghề</span>
                  <span className="rounded bg-brand-green-light px-2.5 py-1 text-xs font-bold tracking-wide text-brand-green-dark">{profile.licenseNumber}</span>
                </div>
              ) : null}
              {specialties.length ? <div className="rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary"><Icon className="h-5 w-5 text-brand-blue" name="shield-check" />Chuyên môn</div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue-light/50 px-3 py-1 text-sm font-medium text-brand-blue-dark" key={specialty}>
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />{specialty}
                    </span>
                  ))}
                </div>
              </div> : null}
              {profile?.languages.length ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
                  <span className="text-sm font-medium text-text-secondary">Ngôn ngữ</span>
                  <span className="flex flex-wrap gap-2">{profile.languages.map((language) => <span className="rounded-full border border-border-subtle bg-surface-container-low px-3 py-1 text-xs font-medium text-text-primary" key={language}>{language}</span>)}</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            <header>
              <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold uppercase tracking-tight text-text-primary">{getDoctorFullName(doctor)}</h1>
              {doctor.position ? <p className="mt-2 text-lg font-semibold leading-relaxed text-brand-blue-dark">{doctor.position}</p> : null}
              <p className="mt-5 max-w-3xl leading-relaxed text-text-secondary">{doctor.description}</p>
            </header>
            {profile?.quote ? <blockquote className="border-l-4 border-brand-blue bg-brand-blue-light/50 p-6 text-lg italic leading-relaxed text-text-primary">“{profile.quote}”</blockquote> : null}
            {profile ? (
              <>
                {profile.education.length ? <DetailList items={profile.education} markerColor="bg-brand-blue-dark" title="Học vấn & Đào tạo" /> : null}
                {profile.experienceHighlights.length ? <DetailList items={profile.experienceHighlights} markerColor="bg-brand-green-dark" title="Kinh nghiệm" /> : null}
                {profile.certificates.length ? <DoctorCertificateCarousel certificates={profile.certificates} /> : null}
                {profile.sourceUrl ? <a className="text-sm font-semibold text-brand-blue-dark underline-offset-4 hover:underline" href={profile.sourceUrl} rel="noopener noreferrer" target="_blank">Xem hồ sơ trên website Nha Khoa 2000</a> : null}
              </>
            ) : (
              <div className="space-y-4">
                <DetailList items={[...(doctor.experience > 0 ? [`${doctor.experience} năm kinh nghiệm`] : []), ...specialties]} markerColor="bg-brand-green-dark" title="Chuyên môn & Kinh nghiệm" />
              </div>
            )}
            <div className="pt-2">
              <AppointmentButton className="gap-2 rounded-full bg-brand-blue px-6 py-3 font-bold shadow-sm hover:bg-brand-blue-dark">
                <Icon className="h-5 w-5" name="calendar" />Đặt lịch thăm khám
              </AppointmentButton>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
