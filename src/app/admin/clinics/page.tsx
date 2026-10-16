import Link from "next/link";
import { DirectoryHeroForm } from "@/features/admin/components/DirectoryHeroForm";
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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue-dark">Thông tin liên hệ</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">Liên hệ &amp; cơ sở phòng khám</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">Quản lý thông tin cơ sở được hiển thị trên website.</p>
        </div>
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-border-subtle bg-white px-5 text-sm font-bold text-text-primary shadow-sm transition-colors hover:border-brand-blue hover:text-brand-blue-dark sm:self-auto" href="/lien-he" target="_blank">
          Xem trang liên hệ <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
        </Link>
      </header>

      <DirectoryHeroForm page="contact" />

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
        <div className="rounded-2xl border border-border-subtle bg-white p-8 text-center text-sm text-text-secondary">Chưa có thông tin cơ sở.</div>
      )}
    </div>
  );
}
