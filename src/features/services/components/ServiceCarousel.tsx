"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { DentalService } from "../types/service.type";
import { ServiceCard } from "./ServiceCard";

type ServiceCarouselProps = { services: readonly DentalService[] };

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  const [page, setPage] = useState(0);
  const pages = [services.slice(0, 3), services.slice(3, 6)];
  return (
    <>
      <div className="mb-12 flex flex-col items-center gap-6 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-[2.5rem]">Dịch vụ tiêu biểu</h2><div className="flex items-center justify-center gap-3"><button aria-label="Dịch vụ trước" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-text-primary shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-brand-blue-dark enabled:hover:text-white" disabled={page === 0} onClick={() => setPage(0)} type="button"><Icon name="arrow-left" /></button><button aria-label="Dịch vụ kế tiếp" className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-text-primary shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-brand-blue-dark enabled:hover:text-white" disabled={page === pages.length - 1} onClick={() => setPage(1)} type="button"><Icon name="arrow-right" /></button></div></div>
      <div className="relative w-full overflow-hidden"><div className="flex w-[200%] transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${page * 50}%)` }}>{pages.map((items, pageIndex) => <div aria-hidden={page !== pageIndex} className="grid w-1/2 shrink-0 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" key={pageIndex}>{items.map((service) => <ServiceCard key={service.id} service={service} />)}</div>)}</div></div>
      <div className="mt-10 flex items-center justify-center gap-2.5">{pages.map((_, index) => <button aria-label={`Trang dịch vụ ${index + 1}`} aria-current={page === index} className={`h-2.5 rounded-full transition-all ${page === index ? "w-8 bg-brand-blue-dark" : "w-2.5 bg-slate-300"}`} key={index} onClick={() => setPage(index)} type="button" />)}</div>
    </>
  );
}
