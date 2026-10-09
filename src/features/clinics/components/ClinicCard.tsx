import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Clinic } from "../types/clinic.type";

export function ClinicCard({ clinic, compact = false }: { clinic: Clinic; compact?: boolean }) {
  const linkClassName = compact
    ? "inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand-blue-dark transition-colors duration-300 hover:text-brand-blue-hover motion-reduce:transition-none"
    : "inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-blue-dark transition-colors duration-300 hover:text-brand-blue-hover motion-reduce:transition-none";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-white">
      <div className={`relative shrink-0 bg-background-secondary ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <Image alt={clinic.label} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={clinic.image} />
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-4 sm:p-5" : "p-5 sm:p-7"}`}>
        <h3 className={`${compact ? "text-lg" : "text-xl"} font-bold text-text-primary`}>{clinic.label}</h3>
        <p className={`flex items-start gap-3 text-text-secondary ${compact ? "mt-3 text-sm leading-6" : "mt-4 text-sm leading-7"}`}>
          <Icon className={`${compact ? "mt-0.5 h-4 w-4" : "mt-1 h-5 w-5"} shrink-0 text-brand-blue-dark`} name="location" /><span>{clinic.address}</span>
        </p>
        {clinic.workingHours && <p className={`flex items-start gap-3 text-sm text-text-secondary ${compact ? "mt-2.5 leading-6" : "mt-3 leading-7"}`}><Icon className={`${compact ? "mt-0.5 h-4 w-4" : "mt-1 h-5 w-5"} shrink-0 text-brand-blue-dark`} name="clock" /><span>{clinic.workingHours}</span></p>}
        <div className={`mt-auto ${compact ? "pt-4" : "pt-5"}`}>
          <div className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border-subtle ${compact ? "pt-3" : "pt-4"}`}>
            <a aria-label={`Gọi ${clinic.label}: ${clinic.phone}`} className={linkClassName} href={`tel:${clinic.phone.replaceAll(" ", "")}`}><Icon className="h-4 w-4" name="phone" />{clinic.phone}</a>
            {clinic.googleMapsUrl && <a aria-label={`Chỉ đường đến ${clinic.label} (mở tab mới)`} className={linkClassName} href={clinic.googleMapsUrl} rel="noopener noreferrer" target="_blank">Chỉ đường <Icon className="h-4 w-4" name="arrow-right" /></a>}
          </div>
        </div>
      </div>
    </article>
  );
}
