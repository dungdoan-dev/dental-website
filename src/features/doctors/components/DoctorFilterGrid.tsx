"use client";

import { useMemo, useState } from "react";
import { doctorFilters, type DoctorFilter } from "../data/doctor-filter.data";
import type { Doctor } from "../types/doctor.type";
import { DoctorRosterCard } from "./DoctorRosterCard";

type DoctorFilterGridProps = { doctors: readonly Doctor[] };

export function DoctorFilterGrid({ doctors }: DoctorFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<DoctorFilter["value"]>("all");
  const filteredDoctors = useMemo(() => activeFilter === "all" ? doctors : doctors.filter((doctor) => doctor.category === activeFilter), [activeFilter, doctors]);
  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="mb-8 text-center"><div className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brand-blue"><span className="inline-block h-0.5 w-6 bg-brand-blue" />DANH SÁCH CHUYÊN KHOA<span className="inline-block h-0.5 w-6 bg-brand-blue" /></div><h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-[2.5rem]">Gặp Gỡ Chuyên Gia Điều Trị</h2></div>
        <div className="mb-12 flex items-center justify-start gap-2 overflow-x-auto pb-4 sm:justify-center">{doctorFilters.map((filter) => { const active = activeFilter === filter.value; return <button aria-pressed={active} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-bold shadow-sm transition-all ${active ? "bg-brand-blue-dark text-white" : "bg-white text-text-secondary hover:bg-brand-blue-light hover:text-brand-blue-dark"}`} key={filter.value} onClick={() => setActiveFilter(filter.value)} type="button">{filter.label}</button>; })}</div>
        <div aria-live="polite" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{filteredDoctors.map((doctor) => <DoctorRosterCard doctor={doctor} key={doctor.id} />)}</div>
      </div>
    </section>
  );
}
