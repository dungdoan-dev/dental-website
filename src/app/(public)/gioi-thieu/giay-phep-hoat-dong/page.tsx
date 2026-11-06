import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { ZoomImage } from "@/features/about/components/AboutLightbox";
import { AboutPageHead } from "@/features/about/components/AboutShared";
import { toAboutImage } from "@/features/about/data/about-content";
import { getAboutContent } from "@/features/about/services/about.service";
import { getClinics } from "@/features/clinics/services/clinic.service";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Giấy phép hoạt động",
  description: "Giấy phép hoạt động khám bệnh, chữa bệnh và thông tin doanh nghiệp của Nha Khoa 2000.",
  url: "/gioi-thieu/giay-phep-hoat-dong",
});

function ClinicLicenseCard({ clinic, children }: { clinic?: Clinic; children: React.ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border-subtle bg-white">
      <header className="border-b border-border-subtle px-6 py-5">
        <h2 className="text-xl font-bold text-text-primary">{clinic?.name ?? "Cơ sở"}</h2>
        {clinic ? <p className="mt-1.5 flex gap-1.5 text-sm text-text-secondary"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue-dark" name="location" />{clinic.address}</p> : null}
      </header>
      <div className="flex flex-1 flex-col p-6">{children}</div>
    </article>
  );
}

export default async function LicensePage() {
  const [clinics, { license }] = await Promise.all([getClinics(), getAboutContent()]);
  const licenseCs1 = toAboutImage(license.photo);
  const [first, second] = clinics;
  return (
    <>
      <AboutPageHead crumb="Giấy phép hoạt động" lead="Nha Khoa 2000 công khai giấy phép hoạt động khám bệnh, chữa bệnh của từng cơ sở để khách hàng tiện đối chiếu." title="Giấy phép hoạt động" />
      <section className="pb-16 pt-10">
        <Container>
          <div className="grid items-stretch gap-6 md:grid-cols-2">
            <ClinicLicenseCard clinic={first}>
              <div className="rounded-md border border-border-subtle bg-background-secondary p-4">
                <ZoomImage className="mx-auto aspect-[845/1200] max-w-[300px] bg-white" fit="contain" img={licenseCs1} sizes="300px" />
              </div>
              <p className="mt-4 text-sm leading-[1.65] text-text-secondary">{licenseCs1.caption}.</p>
            </ClinicLicenseCard>
            <ClinicLicenseCard clinic={second}>
              <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-2.5 rounded-md border border-dashed border-border-subtle bg-background-secondary p-6 text-center">
                <Icon className="h-9 w-9 text-brand-blue-dark" name="shield-check" />
                <p className="font-bold text-text-primary">Giấy phép đang được cập nhật</p>
                <p className="max-w-[300px] text-sm leading-relaxed text-text-secondary">Quý khách cần đối chiếu thông tin vui lòng liên hệ hotline {second?.phone ?? ""} hoặc Quầy Lễ Tân.</p>
              </div>
            </ClinicLicenseCard>
          </div>
          <section aria-labelledby="license-company" className="mt-10 border-t border-border-subtle pt-7">
            <h2 className="text-[17px] font-bold text-text-primary" id="license-company">Thông tin doanh nghiệp</h2>
            <dl className="mt-3.5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
              {license.companyInfo.map((item) => <div key={item.label}><dt className="text-text-secondary">{item.label}</dt><dd className="mt-0.5 font-semibold text-text-primary">{item.value}</dd></div>)}
            </dl>
          </section>
        </Container>
      </section>
    </>
  );
}
