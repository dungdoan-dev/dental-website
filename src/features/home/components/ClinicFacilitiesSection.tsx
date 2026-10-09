import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import { getClinics } from "@/features/clinics/services/clinic.service";

export async function ClinicFacilitiesSection() {
  const clinics = await getClinics();
  return (
    <section className="bg-background-secondary py-8 lg:py-10" id="co-so-vat-chat">
      <div className="mx-auto max-w-6xl px-margin-mobile md:px-margin">
        <h2 className="sr-only">Cơ sở vật chất Nha Khoa 2000</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {clinics.map((clinic) => <ClinicCard clinic={clinic} compact key={clinic.id} />)}
        </div>
      </div>
    </section>
  );
}
