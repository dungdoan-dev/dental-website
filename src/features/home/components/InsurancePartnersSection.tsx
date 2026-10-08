import Image from "next/image";
import { getInsurancePartners } from "../services/home.service";
import type { InsurancePartner } from "../types/home.type";

type PartnerWithLogo = InsurancePartner & { logoSrc: string };

type PartnerGroupProps = {
  partners: readonly PartnerWithLogo[];
  duplicate?: boolean;
};

function PartnerGroup({ partners, duplicate = false }: PartnerGroupProps) {
  return (
    <ul aria-hidden={duplicate || undefined} className="flex shrink-0 gap-5 pr-5">
      {partners.map((partner) => (
        <li className="relative h-36 w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm" key={partner.code}>
          <Image alt={`Logo ${partner.name}`} className="object-contain p-3" fill sizes="220px" src={partner.logoSrc} />
        </li>
      ))}
    </ul>
  );
}

function PartnerRow({ partners, reverse = false }: { partners: readonly PartnerWithLogo[]; reverse?: boolean }) {
  return (
    <div className="group/insurance-row overflow-hidden">
      <div className={`insurance-marquee flex w-max group-hover/insurance-row:[animation-play-state:paused] ${reverse ? "insurance-marquee--reverse" : ""}`}>
        <PartnerGroup partners={partners} />
        <PartnerGroup duplicate partners={partners} />
      </div>
    </div>
  );
}

export async function InsurancePartnersSection() {
  const insurancePartners = (await getInsurancePartners()).filter(
    (partner): partner is PartnerWithLogo => Boolean(partner.logoSrc),
  );
  const midpoint = Math.ceil(insurancePartners.length / 2);

  return (
    <section className="select-none overflow-hidden border-t border-border-subtle bg-surface py-12 lg:py-16" id="doi-tac-bao-hiem">
      <div className="mx-auto mb-8 max-w-7xl px-margin-mobile md:px-margin">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Đối Tác Bảo Hiểm &amp; Bảo Lãnh Viện Phí Trực Tiếp</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">Nha Khoa 2000 hỗ trợ thanh toán bảo lãnh viện phí trực tiếp nhanh chóng với hơn 15+ đối tác bảo hiểm hàng đầu, giúp quý khách an tâm điều trị không lo thủ tục phức tạp.</p>
        </div>
      </div>
      <div className="space-y-5">
        <PartnerRow partners={insurancePartners.slice(0, midpoint)} />
        <PartnerRow partners={insurancePartners.slice(midpoint)} reverse />
      </div>
    </section>
  );
}
