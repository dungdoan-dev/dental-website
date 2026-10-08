import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Clinic } from "../types/clinic.type";

const linkClassName = "inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-blue-dark transition-colors duration-300 hover:text-brand-blue-hover motion-reduce:transition-none";

export function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-white">
      <div className="relative aspect-[16/10] shrink-0 bg-background-secondary">
        <Image alt={clinic.label} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={clinic.image} />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <h3 className="text-xl font-bold text-text-primary">{clinic.label}</h3>
        <p className="mt-4 flex items-start gap-3 text-sm leading-7 text-text-secondary">
          <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-blue-dark" name="location" /><span>{clinic.address}</span>
        </p>
        {clinic.workingHours && <p className="mt-3 flex items-start gap-3 text-sm leading-7 text-text-secondary"><Icon className="mt-1 h-5 w-5 shrink-0 text-brand-blue-dark" name="clock" /><span>{clinic.workingHours}</span></p>}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border-subtle pt-4">
            <a aria-label={`Gọi ${clinic.label}: ${clinic.phone}`} className={linkClassName} href={`tel:${clinic.phone.replaceAll(" ", "")}`}><Icon className="h-4 w-4" name="phone" />{clinic.phone}</a>
            {clinic.googleMapsUrl && <a aria-label={`Chỉ đường đến ${clinic.label} (mở tab mới)`} className={linkClassName} href={clinic.googleMapsUrl} rel="noopener noreferrer" target="_blank">Chỉ đường <Icon className="h-4 w-4" name="arrow-right" /></a>}
          </div>
        </div>
      </div>
    </article>
  );
}
