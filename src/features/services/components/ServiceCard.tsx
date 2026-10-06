import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { DentalService } from "../types/service.type";

type ServiceCardProps = { service: DentalService };

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100"><Image alt={service.name} className="object-cover object-center transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" src={service.image} /><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md ${service.badgeVariant === "green" ? "bg-brand-green/90" : "bg-brand-blue-dark/90"}`}>{service.badge}</span></div>
      <div className="flex flex-1 flex-col justify-between p-6"><div><h3 className="mb-2 flex min-h-14 items-center text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-brand-blue-dark">{service.name}</h3><p className="line-clamp-2 min-h-12 text-sm leading-relaxed text-text-secondary">{service.shortDescription}</p></div><div className="mt-auto border-t border-slate-100 pt-4"><Link className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue-dark" href={`/dich-vu/${service.slug}`}>Xem chi tiết<Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" name="arrow-right" /></Link></div></div>
    </article>
  );
}
