import Image from "next/image";
import Link from "next/link";
import type { DoctorSummary } from "../types/doctor.type";
import { getDoctorFullName } from "../utils/doctor-card-name";

type DoctorRosterCardProps = { doctor: DoctorSummary };

export function DoctorRosterCard({ doctor }: DoctorRosterCardProps) {
  const fullName = getDoctorFullName(doctor);

  return (
    <Link className="group relative flex aspect-[5/7] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#072146] p-6 text-white shadow-md transition-all duration-500 hover:shadow-2xl md:rounded-3xl" href={`/bac-si/${doctor.slug}`}>
      <Image alt={`${fullName} chân dung`} className="pointer-events-none absolute inset-0 z-20 object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={doctor.avatar} />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between transition-opacity duration-300 group-hover:opacity-0">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-45 rounded-xl bg-[#0ea5e9] opacity-90" /><div className="pointer-events-none absolute right-1/4 top-0 h-32 w-32 -rotate-12 rounded-xl bg-[#0284c7] opacity-60" /><div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#0369a1]/30 blur-xl" />
        <div className="relative z-10 mt-2 aspect-square w-full max-w-48 shrink-0 overflow-hidden rounded-full bg-white/10 shadow-xl ring-4 ring-white/90 sm:mt-4 sm:max-w-52"><Image alt={fullName} className="object-cover object-top" fill sizes="208px" src={doctor.avatar} /></div>
        <div className="relative z-10 mb-1 mt-auto flex w-full min-w-0 flex-col items-center pt-5 text-center">
          <p className="h-5 w-full truncate text-sm font-semibold leading-5 tracking-wide text-white/85">{doctor.degree}</p>
          <h3 className="mt-0.5 h-7 w-full truncate text-xl font-bold leading-7 tracking-tight text-white" title={fullName}>{doctor.name}</h3>
          <p className="mt-1.5 h-5 w-full truncate text-[13px] leading-5 text-white/70" title={doctor.position}>{doctor.position}</p>
          <p className="mt-1.5 h-5 w-full truncate text-sm font-semibold leading-5 text-cyan-200" title={doctor.directoryTitle}>{doctor.directoryTitle}</p>
        </div>
      </div>
    </Link>
  );
}
