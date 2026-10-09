"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { doctorFilters, type DoctorFilter } from "../data/doctor-filter.data";
import type { Doctor } from "../types/doctor.type";
import { DoctorRosterCard } from "./DoctorRosterCard";

type DoctorFilterGridProps = { doctors: readonly Doctor[] };

function normalizeSearch(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi");
}

export function DoctorFilterGrid({ doctors }: DoctorFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<DoctorFilter["value"]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDoctors = useMemo(() => {
    const query = normalizeSearch(searchTerm);

    return doctors.filter((doctor) => {
      const matchesCategory = activeFilter === "all" || doctor.category === activeFilter;
      const matchesName = !query || normalizeSearch(doctor.name).includes(query);
      return matchesCategory && matchesName;
    });
  }, [activeFilter, doctors, searchTerm]);

  const resetFilters = () => {
    setActiveFilter("all");
    setSearchTerm("");
  };

  return (
    <section aria-labelledby="doctor-directory-title" className="bg-surface py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brand-blue">
            <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-brand-blue" />
            Danh sách chuyên khoa
            <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-brand-blue" />
          </div>
          <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-[2.5rem]" id="doctor-directory-title">
            Gặp gỡ chuyên gia điều trị
          </h2>
        </div>

        <div className="mx-auto mb-6 max-w-xl">
          <label className="sr-only" htmlFor="doctor-name-search">Tìm bác sĩ theo tên</label>
          <div className="relative">
            <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" name="search" />
            <input
              autoComplete="off"
              className="min-h-12 w-full rounded-full border border-border-subtle bg-white py-3 pl-12 pr-12 text-sm text-text-primary shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              id="doctor-name-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên bác sĩ..."
              type="search"
              value={searchTerm}
            />
            {searchTerm ? (
              <button
                aria-label="Xóa nội dung tìm kiếm"
                className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-container-low hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                onClick={() => setSearchTerm("")}
                type="button"
              >
                <Icon className="h-4 w-4" name="close" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative mb-8 sm:mb-10">
          <div
            aria-label="Lọc bác sĩ theo chuyên khoa"
            className="flex snap-x snap-mandatory items-center justify-start gap-2 overflow-x-auto overscroll-x-contain pb-3 pr-8 [scrollbar-width:thin] sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:pr-0"
            role="group"
            tabIndex={0}
          >
            {doctorFilters.map((filter) => {
              const active = activeFilter === filter.value;
              return (
                <button
                  aria-pressed={active}
                  className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-bold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${active ? "bg-brand-blue-dark text-white" : "bg-white text-text-secondary hover:bg-brand-blue-light hover:text-brand-blue-dark"}`}
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 top-0 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden" />
          <p className="mt-1 text-center text-xs text-text-secondary sm:hidden">Vuốt để xem thêm chuyên khoa</p>
        </div>

        <p aria-atomic="true" aria-live="polite" className="mb-4 text-sm text-text-secondary" role="status">
          {filteredDoctors.length === 1 ? "Tìm thấy 1 bác sĩ" : `Tìm thấy ${filteredDoctors.length} bác sĩ`}
        </p>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDoctors.map((doctor) => <DoctorRosterCard doctor={doctor} key={doctor.id} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-border-subtle bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-lg font-bold text-text-primary">Không tìm thấy bác sĩ phù hợp</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              Thử tên khác hoặc xóa bộ lọc chuyên khoa để xem toàn bộ đội ngũ bác sĩ.
            </p>
            <button
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-blue-dark px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              onClick={resetFilters}
              type="button"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
