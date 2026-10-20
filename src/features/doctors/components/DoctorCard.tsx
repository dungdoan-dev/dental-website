import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { DoctorSummary } from "../types/doctor.type";
import { getDoctorFullName } from "../utils/doctor-card-name";

type DoctorCardProps = { doctor: DoctorSummary };

export function DoctorCard({ doctor }: DoctorCardProps) {
  const fullName = getDoctorFullName(doctor);

  return (
    <Link className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" href={`/bac-si/${doctor.slug}`}>
      <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100">
        <Image alt={fullName} className="object-cover object-top transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 33vw" src={doctor.avatar} />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 text-center">
        <div className="flex-1">
          <p className="h-5 truncate text-sm font-semibold leading-5 text-brand-blue-dark">{doctor.degree}</p>
          <h3 className="mt-0.5 h-7 truncate text-xl font-bold leading-7 text-text-primary transition-colors group-hover:text-brand-blue" title={fullName}>{doctor.name}</h3>
          <p className="mt-1.5 h-5 truncate text-[13px] leading-5 text-text-secondary" title={doctor.position}>{doctor.position}</p>
          <p className="mt-1.5 h-5 truncate text-sm font-semibold leading-5 text-brand-blue" title={doctor.directoryTitle}>{doctor.directoryTitle}</p>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-brand-blue transition-colors group-hover:text-brand-blue-dark">
          <span>Xem hồ sơ bác sĩ</span>
          <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" />
        </div>
      </div>
    </Link>
  );
}
