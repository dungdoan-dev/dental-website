import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Doctor } from "../types/doctor.type";
import { getDoctorCardNameLines } from "../utils/doctor-card-name";

type DoctorCardProps = { doctor: Doctor };

export function DoctorCard({ doctor }: DoctorCardProps) {
  const nameLines = getDoctorCardNameLines(doctor);

  return (
    <Link className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" href={`/bac-si/${doctor.slug}`}>
      <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100">
        <Image alt={doctor.name} className="object-cover object-top transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 33vw" src={doctor.avatar} />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 text-center">
        <div className="flex-1">
          <h3 className={`text-xl font-bold text-text-primary transition-colors group-hover:text-brand-blue ${doctor.nameLines === 2 ? "min-h-14" : "line-clamp-1"}`} title={doctor.name}>
            <span className={doctor.nameLines === 2 ? "block truncate" : undefined}>{nameLines.firstLine}</span>
            {nameLines.secondLine ? <span className="block truncate">{nameLines.secondLine}</span> : null}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm font-medium text-text-secondary" title={doctor.directoryTitle}>{doctor.directoryTitle}</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-brand-blue transition-colors group-hover:text-brand-blue-dark">
          <span>Xem hồ sơ bác sĩ</span>
          <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" />
        </div>
      </div>
    </Link>
  );
}
