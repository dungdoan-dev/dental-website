import { CardCarousel } from "@/components/common/CardCarousel";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";
import type { ReactNode } from "react";

type ServiceCarouselProps = { services: readonly DentalService[]; footerAction?: ReactNode; title?: string; note?: string };

export function ServiceCarousel({ services, footerAction, title = "Dịch vụ nha khoa", note = "" }: ServiceCarouselProps) {
  if (!services.length) return null;

  return (
    <>
      <div className="mb-4 text-center"><h2 className="whitespace-nowrap text-[clamp(1.25rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">{title}</h2>{note ? <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">{note}</p> : null}</div>
      <CardCarousel footerAction={footerAction} label="Dịch vụ nha khoa" nextLabel="Dịch vụ kế tiếp" pageLabel="Trang dịch vụ" previousLabel="Dịch vụ trước">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </CardCarousel>
    </>
  );
}
