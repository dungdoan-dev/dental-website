"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { priceLists, resolveServiceFilter, serviceFilters, serviceIconByCategory, servicePriceLink, type ServiceFilter } from "../data/service-filter.data";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";

type ServiceFilterGridProps = {
  services: readonly DentalService[];
};

function readFilterFromUrl(): ServiceFilter {
  return resolveServiceFilter(new URLSearchParams(window.location.search).get("nhom") ?? undefined);
}

export function ServiceFilterGrid({ services }: ServiceFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>("all");

  useEffect(() => {
    const syncFilter = () => setActiveFilter(readFilterFromUrl());
    syncFilter();
    window.addEventListener("popstate", syncFilter);
    return () => window.removeEventListener("popstate", syncFilter);
  }, []);

  function selectFilter(filter: ServiceFilter) {
    setActiveFilter(filter);
    const url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("nhom");
    else url.searchParams.set("nhom", filter);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const showPrices = activeFilter === "pricing";
  const filteredServices = activeFilter === "all"
    ? services
    : services.filter((service) => service.category === activeFilter);

  return (
    <section aria-label="Danh sách dịch vụ" className="bg-surface py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="rounded-md border border-border-subtle bg-white p-5 shadow-[0_12px_40px_rgba(23,49,58,0.05)] sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 border-b border-border-subtle pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold tracking-tight text-text-primary">Khám phá theo nhóm dịch vụ</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Chọn chuyên khoa phù hợp với nhu cầu chăm sóc răng miệng của bạn.</p>
            </div>
            <Link className="inline-flex w-full items-center justify-between gap-3 rounded-md border border-brand-green/40 bg-brand-green-light px-4 py-3 text-sm font-bold text-brand-green-dark transition-colors hover:border-brand-green hover:bg-brand-green/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green sm:w-fit" href={servicePriceLink.href}>
              {servicePriceLink.label}
              <Icon className="h-4 w-4 shrink-0" name="arrow-right" />
            </Link>
          </div>
          <nav aria-label="Lọc theo nhóm dịch vụ" className="flex flex-wrap gap-2.5 pt-6">
            {serviceFilters.map((filter) => {
              const isActive = filter.value === activeFilter;
              return (
                <button
                  aria-pressed={isActive}
                  className={`inline-flex min-h-14 items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark ${isActive ? "border-brand-blue-dark bg-brand-blue-dark text-white" : "border-border-subtle bg-background-secondary text-text-secondary hover:border-brand-blue hover:bg-brand-blue-light hover:text-brand-blue-dark"}`}
                  key={filter.value}
                  onClick={() => selectFilter(filter.value)}
                  type="button"
                >
                  {filter.value === "pricing" ? <Icon className="h-6 w-6 shrink-0" name="list" /> : filter.value !== "all" ? <Image alt="" className={`h-8 w-8 shrink-0 object-contain ${isActive ? "brightness-0 invert" : ""}`} height={32} src={serviceIconByCategory[filter.value]} width={32} /> : null}
                  {filter.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mb-5 mt-8 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold text-text-primary tracking-tight">{showPrices ? "Bảng giá tham khảo" : "Dịch vụ của chúng tôi"}</h2>
          <p className="text-sm text-text-secondary">{showPrices ? "Đơn vị: 1.000 VNĐ · giá chính xác sau khi bác sĩ thăm khám" : `${filteredServices.length} dịch vụ`}</p>
        </div>
        {showPrices ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {priceLists.map((list) => (
              <article className="flex flex-col overflow-hidden rounded-md border border-border-subtle bg-white" key={list.image}>
                <ImageLightbox alt={list.alt} caption={list.title} className="relative block aspect-[1414/2000] bg-surface-container-low" src={list.image}>
                  <Image alt={list.alt} className="object-cover object-top" fill sizes="(max-width: 768px) 100vw, 400px" src={list.image} />
                </ImageLightbox>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle p-4">
                  <h3 className="text-lg font-bold text-text-primary">{list.title}</h3>
                  <a className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline" href={list.image} rel="noopener" target="_blank">Mở ảnh gốc<span className="sr-only"> {list.title} (tab mới)</span><Icon className="h-4 w-4" name="arrow-right" /></a>
                </div>
              </article>
            ))}
            <Link className="group flex flex-col overflow-hidden rounded-md border border-border-subtle bg-white" href={servicePriceLink.href}>
              <div className="flex aspect-[1414/2000] flex-col items-center justify-center gap-4 bg-[linear-gradient(160deg,var(--color-brand-blue-dark),#0b4f7a)] p-8 text-center text-white">
                <Icon className="h-12 w-12" name="list" />
                <p className="text-2xl font-extrabold leading-tight">Bảng giá theo danh mục kỹ thuật</p>
                <p className="max-w-[260px] text-sm leading-relaxed text-white/85">Giá chi tiết từng kỹ thuật điều trị, tra cứu theo nhóm dịch vụ.</p>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border-subtle p-4"><h3 className="text-lg font-bold text-text-primary group-hover:text-brand-blue-dark">Bảng giá theo Danh mục kỹ thuật</h3><Icon className="h-4 w-4 text-brand-blue-dark transition-transform group-hover:translate-x-1" name="arrow-right" /></div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
        )}
        {!showPrices && filteredServices.length === 0 ? <p className="rounded-md border border-border-subtle bg-white px-6 py-12 text-center text-text-secondary">Chưa có dịch vụ trong danh mục này.</p> : null}
      </div>
    </section>
  );
}
