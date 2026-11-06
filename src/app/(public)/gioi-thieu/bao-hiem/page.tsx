import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { AboutPageHead, aboutEyebrow, aboutHeading } from "@/features/about/components/AboutShared";
import { getAboutContent } from "@/features/about/services/about.service";
import { getInsurancePartners } from "@/features/home/services/home.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Bảo hiểm và bảo lãnh viện phí",
  description: "Danh sách công ty bảo hiểm liên kết và quy trình bảo lãnh viện phí 4 bước tại Nha Khoa 2000.",
  url: "/gioi-thieu/bao-hiem",
});

export default async function InsurancePage() {
  const [partners, { insurance }] = await Promise.all([getInsurancePartners(), getAboutContent()]);
  const logos = partners.filter((partner) => partner.logoSrc);
  return (
    <>
      <AboutPageHead crumb="Bảo hiểm" lead="Nha Khoa 2000 liên kết với nhiều đơn vị bảo hiểm, giúp khách hàng thực hiện thủ tục bảo lãnh viện phí trực tiếp ngay tại phòng khám." title="Bảo hiểm và bảo lãnh viện phí" />
      <section aria-labelledby="insurance-partners" className="pb-14 pt-10">
        <Container>
          <h2 className={`${aboutHeading} mt-0 text-2xl`} id="insurance-partners">Công ty bảo hiểm liên kết</h2>
          <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
            {logos.map((partner) => (
              <li className="relative h-24 rounded-md border border-border-subtle bg-white" key={partner.code}>
                <Image alt={`Logo ${partner.name}`} className="object-contain p-3" fill sizes="150px" src={partner.logoSrc!} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-[1.65] text-text-secondary">Danh sách và quyền lợi bảo hiểm liên tục được cập nhật. Để bảo đảm quyền lợi, Quý khách vui lòng liên hệ Hotline hoặc Quầy Lễ Tân để được tư vấn chi tiết.</p>
        </Container>
      </section>
      <section aria-labelledby="insurance-steps" className="bg-background-secondary py-14">
        <Container>
          <p className={aboutEyebrow}>Quy trình</p>
          <h2 className={aboutHeading} id="insurance-steps">Bảo lãnh viện phí trong {insurance.steps.length} bước</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {insurance.steps.map((step, index) => (
              <li className="rounded-md border-t-[3px] border-brand-blue-dark bg-white p-6" key={step.title}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-light font-extrabold text-brand-blue-dark">{index + 1}</span>
                <h3 className="mt-3.5 text-[17px] font-bold leading-snug text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-text-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex gap-2.5 rounded-md border border-border-subtle bg-white px-4.5 py-3.5 text-sm leading-relaxed text-text-primary" role="note"><Icon className="mt-px h-5 w-5 shrink-0 text-brand-blue-dark" name="shield-check" />Quyền lợi bảo lãnh phụ thuộc vào hợp đồng bảo hiểm của Quý khách và xác nhận của đơn vị bảo hiểm. Nha Khoa 2000 không cam kết thay đơn vị bảo hiểm về mức chi trả.</p>
        </Container>
      </section>
      <section aria-labelledby="insurance-why" className="py-14">
        <Container>
          <h2 className={`${aboutHeading} mt-0`} id="insurance-why">Vì sao nên khám bảo hiểm tại Nha Khoa 2000?</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-3">
            {insurance.benefits.map((benefit) => (
              <li className="flex gap-3" key={benefit.title}>
                <Icon className="h-6 w-6 shrink-0 text-brand-green-dark" name="check-circle" />
                <div><h3 className="text-[17px] font-bold text-text-primary">{benefit.title}</h3><p className="mt-1 text-sm leading-[1.65] text-text-secondary">{benefit.text}</p></div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
