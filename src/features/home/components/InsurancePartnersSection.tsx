import { insurancePartners, type InsurancePartner } from "../data/insurance.data";

type PartnerGroupProps = {
  partners: readonly InsurancePartner[];
  duplicate?: boolean;
};

function PartnerGroup({ partners, duplicate = false }: PartnerGroupProps) {
  return (
    <ul aria-hidden={duplicate || undefined} className="flex shrink-0 gap-5 pr-5">
      {partners.map((partner) => (
        <li className="w-[220px] shrink-0 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm" key={partner.code}>
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-xs font-extrabold text-white ${partner.accent === "green" ? "bg-brand-green" : "bg-brand-blue-dark"}`}>{partner.code}</div>
          <p className="font-bold text-text-primary">{partner.name}</p>
          <p className="mt-1 text-xs text-text-secondary">{partner.description}</p>
        </li>
      ))}
    </ul>
  );
}

function PartnerRow({ partners, reverse = false }: { partners: readonly InsurancePartner[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div className={`insurance-marquee flex w-max ${reverse ? "insurance-marquee--reverse" : ""}`}>
        <PartnerGroup partners={partners} />
        <PartnerGroup duplicate partners={partners} />
      </div>
    </div>
  );
}

export function InsurancePartnersSection() {
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
