import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { serviceFilters, serviceIconByCategory, servicePriceLink, type ServiceFilter } from "../data/service-filter.data";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";

type ServiceFilterGridProps = {
  services: readonly DentalService[];
  activeFilter: ServiceFilter;
};

export function ServiceFilterGrid({ services, activeFilter }: ServiceFilterGridProps) {
  const filteredServices = activeFilter === "all"
    ? services
    : services.filter((service) => service.category === activeFilter);

  return (
    <section aria-label="Danh sách dịch vụ" className="bg-surface py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-[0_12px_40px_rgba(23,49,58,0.05)] sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 border-b border-border-subtle pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">Khám phá theo nhóm dịch vụ</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Chọn chuyên khoa phù hợp với nhu cầu chăm sóc răng miệng của bạn.</p>
            </div>
            <Link className="inline-flex w-full items-center justify-between gap-3 rounded-xl border border-brand-green/40 bg-brand-green-light px-4 py-3 text-sm font-bold text-brand-green-dark transition-colors hover:border-brand-green hover:bg-brand-green/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-fit" href={servicePriceLink.href}>
              {servicePriceLink.label}
              <Icon className="h-4 w-4 shrink-0" name="arrow-right" />
            </Link>
          </div>
          <nav aria-label="Lọc theo nhóm dịch vụ" className="flex flex-wrap gap-2.5 pt-6">
            {serviceFilters.map((filter) => {
              const isActive = filter.value === activeFilter;
              const href = filter.value === "all" ? "/dich-vu" : `/dich-vu?nhom=${filter.value}`;
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-14 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark ${isActive ? "border-brand-blue-dark bg-brand-blue-dark text-white shadow-sm" : "border-border-subtle bg-background-secondary text-text-secondary hover:border-brand-blue hover:bg-brand-blue-light hover:text-brand-blue-dark"}`}
                  href={href}
                  key={filter.value}
                  scroll={false}
                >
                  {filter.value !== "all" ? <Image alt="" className={`h-8 w-8 shrink-0 object-contain ${isActive ? "brightness-0 invert" : ""}`} height={32} src={serviceIconByCategory[filter.value]} width={32} /> : null}
                  {filter.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mb-6 mt-10 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-text-primary sm:text-2xl">Dịch vụ của chúng tôi</h2>
          <p className="text-sm text-text-secondary">{filteredServices.length} dịch vụ</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
        {filteredServices.length === 0 ? <p className="rounded-2xl border border-border-subtle bg-white px-6 py-12 text-center text-text-secondary">Chưa có dịch vụ trong danh mục này.</p> : null}
      </div>
    </section>
  );
}
