import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { serviceIconByCategory } from "../data/service-filter.data";
import type { DentalService } from "../types/service.type";

type ServiceCardProps = { service: DentalService };

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group h-full">
      <Link aria-label={`Xem chi tiết dịch vụ ${service.name}`} className="flex h-full flex-col items-start rounded-md bg-[#edf3fb] px-6 pb-5 pt-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e6effb] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark" href={`/dich-vu/${service.slug}`}>
        <Image alt="" className="h-20 w-20 self-center object-contain transition-transform duration-300 group-hover:scale-105" height={80} src={serviceIconByCategory[service.category]} width={80} />
        <div className="mt-3 flex min-h-14 w-full items-center justify-center"><h3 className="line-clamp-2 text-balance text-center text-xl font-bold leading-7 text-[#0a2348]">{service.name}</h3></div>
        <p className="mb-4 mt-3 min-h-[91px] text-sm leading-relaxed text-text-on-service">{service.shortDescription}</p>
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 self-center text-[15px] font-bold text-brand-blue transition-colors group-hover:text-brand-blue-dark">Tìm hiểu thêm<Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" /></span>
      </Link>
    </article>
  );
}
