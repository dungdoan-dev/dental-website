import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Doctor } from "../types/doctor.type";

type DoctorCardProps = { doctor: Doctor };

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" href={`/bac-si/${doctor.slug}`}>
      <div className="relative h-80 w-full shrink-0 overflow-hidden bg-slate-100"><Image alt={doctor.name} className="object-cover object-top transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 33vw" src={doctor.avatar} /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-60" /><span className="absolute bottom-3 left-4 right-4 text-[12px] font-bold uppercase tracking-wider text-brand-blue-light">{doctor.highlight}</span></div>
      <div className="flex flex-1 flex-col justify-between p-6 text-left"><div><h3 className="mb-1.5 text-xl font-bold text-text-primary transition-colors group-hover:text-brand-blue">{doctor.name}</h3><span className="block text-xs font-bold uppercase tracking-wider text-brand-blue">{doctor.position} &amp; {doctor.specialty}</span></div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-brand-blue transition-colors group-hover:text-brand-blue-dark"><span>Xem hồ sơ bác sĩ</span><Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" /></div></div>
    </Link>
  );
}
