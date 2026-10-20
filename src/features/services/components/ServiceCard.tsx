import Image from "next/image";
import Link from "next/link";
import { serviceIconByCategory } from "../data/service-filter.data";
import type { DentalService } from "../types/service.type";

type ServiceCardProps = { service: DentalService };

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group h-full">
      <Link aria-label={`Xem chi tiết dịch vụ ${service.name}`} className="flex h-full flex-col items-start rounded-3xl bg-[#edf3fb] px-6 pb-5 pt-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e6effb] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark" href={`/dich-vu/${service.slug}`}>
        <Image alt="" className="h-20 w-20 self-center object-contain transition-transform duration-300 group-hover:scale-105" height={80} src={serviceIconByCategory[service.category]} width={80} />
        <div className="mt-3 flex min-h-14 w-full items-center justify-center"><h3 className="line-clamp-2 text-center text-xl font-bold leading-7 text-[#0a2348]">{service.name}</h3></div>
        <p className="mb-4 mt-3 line-clamp-4 min-h-[91px] text-sm leading-relaxed text-text-on-service">{service.shortDescription}</p>
        <span aria-hidden="true" className="mt-auto flex h-7 w-7 items-center justify-center self-center rounded-full border border-[#a6b9d7] text-xl font-bold leading-none text-[#0a2348] transition-colors group-hover:border-brand-blue-dark group-hover:bg-brand-blue-dark group-hover:text-white">+</span>
      </Link>
    </article>
  );
}
