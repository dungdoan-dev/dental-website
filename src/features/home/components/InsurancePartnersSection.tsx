import Image from "next/image";
import { getInsurancePartners } from "../services/home.service";
import type { InsurancePartner } from "../types/home.type";
import { getHomeSectionCopy } from "../services/home.service";

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
  const [partners, copy] = await Promise.all([getInsurancePartners(), getHomeSectionCopy()]);
  const insurancePartners = partners.filter(
    (partner): partner is PartnerWithLogo => Boolean(partner.logoSrc),
  );
  const midpoint = Math.ceil(insurancePartners.length / 2);

  return (
    <section className="select-none overflow-hidden border-t border-border-subtle bg-surface py-5 lg:py-6" id="doi-tac-bao-hiem">
      <div className="mx-auto mb-4 max-w-7xl px-margin-mobile md:px-margin">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="whitespace-nowrap text-[clamp(0.7rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">{copy.insurance.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">{copy.insurance.note}</p>
        </div>
      </div>
      <div className="space-y-5">
        <PartnerRow partners={insurancePartners.slice(0, midpoint)} />
        <PartnerRow partners={insurancePartners.slice(midpoint)} reverse />
      </div>
    </section>
  );
}
