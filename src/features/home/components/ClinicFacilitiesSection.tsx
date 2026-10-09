import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { getHomeSectionCopy } from "../services/home.service";

export async function ClinicFacilitiesSection() {
  const [clinics, copy] = await Promise.all([getClinics(), getHomeSectionCopy()]);
  return (
    <section className="bg-background-secondary py-8 lg:py-10" id="co-so-vat-chat">
      <div className="mx-auto max-w-6xl px-margin-mobile md:px-margin">
        <div className="mb-6 text-center"><h2 className="whitespace-nowrap text-[clamp(1.25rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">{copy.clinics.title}</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">{copy.clinics.note}</p></div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {clinics.map((clinic) => <ClinicCard clinic={clinic} compact key={clinic.id} />)}
        </div>
      </div>
    </section>
  );
}
