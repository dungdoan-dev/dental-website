import { CardCarousel } from "@/components/common/CardCarousel";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";
import type { ReactNode } from "react";

type ServiceCarouselProps = { services: readonly DentalService[]; footerAction?: ReactNode };

export function ServiceCarousel({ services, footerAction }: ServiceCarouselProps) {
  if (!services.length) return null;

  return (
    <>
      <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-text-primary sm:mb-10 sm:text-[2.5rem]">Dịch vụ nha khoa</h2>
      <CardCarousel footerAction={footerAction} label="Dịch vụ nha khoa" nextLabel="Dịch vụ kế tiếp" pageLabel="Trang dịch vụ" previousLabel="Dịch vụ trước">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </CardCarousel>
    </>
  );
}
