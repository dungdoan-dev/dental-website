import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/admin-ui/button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { DirectoryHeroForm, loadDirectoryHero } from "@/features/admin/components/DirectoryHeroForm";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ContactCtaForm } from "@/features/admin/components/ContactCtaForm";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import { ClinicFormDialog } from "@/features/admin/components/ClinicFormDialog";
import type { Clinic } from "@/features/clinics/types/clinic.type";

export const metadata = {
  title: "Cơ sở phòng khám | Admin Nha Khoa 2000",
};

export default async function AdminClinicsPage() {
  await requireAdmin();
  const hero = loadDirectoryHero("contact");
  const supabase = await getSupabaseServerClient();
  const [{ data: clinicRows, error }, contactSettings] = await Promise.all([
    supabase.from("clinics").select("*, clinic_facilities(name,sort_order)").order("id"),
    getContactCtaSettings(),
  ]);
  if (error) throw error;
  const clinics = clinicRows.map((clinic) => ({
    ...clinic,
    workingHours: clinic.working_hours,
    googleMapsUrl: clinic.google_maps_url,
    accent: clinic.accent,
    facilities: (clinic.clinic_facilities ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<Button asChild size="sm" variant="soft"><Link prefetch={false} href="/lien-he" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang liên hệ</Link></Button>}
        description="Quản lý thông tin liên hệ và các cơ sở được hiển thị trên website."
        title="Liên hệ & cơ sở phòng khám"
      />

      <DirectoryHeroForm loading={hero} page="contact" />

      <ContactCtaForm clinics={clinicRows.map(({ id, name, phone }) => ({ id, name, phone }))} settings={contactSettings} />

      {clinics.length ? (
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {clinics.map((clinic) => {
            const clinicRecord: Clinic = {
              ...clinic,
              facilities: clinic.facilities.map((facility: { name: string }) => facility.name),
              googleMapsUrl: clinic.googleMapsUrl ?? undefined,
              accent: clinic.accent as Clinic["accent"],
            };

            return (
              <div className="relative" key={clinic.id}>
                <ClinicCard clinic={clinicRecord} />
                <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                  <ClinicFormDialog clinic={clinicRecord} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[7px] bg-card shadow-card p-8 text-center text-sm text-text-secondary">Chưa có thông tin cơ sở.</div>
      )}
    </div>
  );
}
