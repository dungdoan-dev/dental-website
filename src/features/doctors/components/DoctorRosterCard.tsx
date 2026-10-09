import Image from "next/image";
import Link from "next/link";
import type { Doctor } from "../types/doctor.type";
import { getDoctorCardNameLines } from "../utils/doctor-card-name";

type DoctorRosterCardProps = { doctor: Doctor };

export function DoctorRosterCard({ doctor }: DoctorRosterCardProps) {
  const nameLines = getDoctorCardNameLines(doctor);

  return (
    <Link className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl bg-[#072146] p-6 text-white shadow-md transition-all duration-500 hover:shadow-2xl md:rounded-3xl" href={`/bac-si/${doctor.slug}`}>
      <Image alt={`${doctor.name} Chân Dung`} className="pointer-events-none absolute inset-0 z-20 object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={doctor.avatar} />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between transition-opacity duration-300 group-hover:opacity-0">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-45 rounded-xl bg-[#0ea5e9] opacity-90" /><div className="pointer-events-none absolute right-1/4 top-0 h-32 w-32 -rotate-12 rounded-xl bg-[#0284c7] opacity-60" /><div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#0369a1]/30 blur-xl" />
        <div className="relative z-10 mt-2 aspect-square w-full max-w-48 shrink-0 overflow-hidden rounded-full bg-white/10 shadow-xl ring-4 ring-white/90 sm:mt-4 sm:max-w-52"><Image alt={doctor.name} className="object-cover object-top" fill sizes="208px" src={doctor.avatar} /></div>
        <div className="relative z-10 mb-2 mt-auto flex w-full min-w-0 flex-col items-center text-center"><h3 className={`mb-1 w-full text-base font-bold tracking-tight text-white sm:text-lg ${doctor.nameLines === 2 ? "min-h-12" : "truncate"}`} title={doctor.name}><span className={doctor.nameLines === 2 ? "block truncate" : undefined}>{nameLines.firstLine}</span>{nameLines.secondLine ? <span className="block truncate">{nameLines.secondLine}</span> : null}</h3><p className="w-full truncate text-sm font-medium text-cyan-200/90" title={doctor.directoryTitle}>{doctor.directoryTitle}</p></div>
      </div>
    </Link>
  );
}
