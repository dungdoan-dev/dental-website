"use client";

import { useMemo, useState } from "react";
import { serviceFilters, type ServiceFilter } from "../data/service-filter.data";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";

type ServiceFilterGridProps = { services: readonly DentalService[] };

export function ServiceFilterGrid({ services }: ServiceFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>("all");
  const filteredServices = useMemo(
    () => activeFilter === "all" ? services : services.filter((service) => service.category === activeFilter),
    [activeFilter, services],
  );

  return (
    <>
      <div className="sticky top-[114px] z-30 border-b border-border-subtle/80 bg-surface/95 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-margin-mobile pb-1 md:justify-center md:px-margin">
          {serviceFilters.map((filter) => {
            const isActive = filter.value === activeFilter;
            return <button aria-pressed={isActive} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition-all ${isActive ? "border-brand-blue bg-brand-blue text-white shadow-sm" : "border-border-subtle bg-white text-text-secondary hover:border-brand-blue hover:text-brand-blue"}`} key={filter.value} onClick={() => setActiveFilter(filter.value)} type="button">{filter.label}</button>;
          })}
        </div>
      </div>
      <section aria-label="Danh sách dịch vụ" className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
          {filteredServices.length === 0 ? <p className="py-12 text-center text-text-secondary">Chưa có dịch vụ trong danh mục này.</p> : null}
        </div>
      </section>
    </>
  );
}
