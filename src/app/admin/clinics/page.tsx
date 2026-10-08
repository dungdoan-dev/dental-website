import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { ClinicFormDialog } from "@/features/admin/components/ClinicFormDialog";
import type { Clinic } from "@/features/clinics/types/clinic.type";

export const metadata = {
  title: "Cơ Sở Phòng Khám | Admin Nha Khoa 2000",
};

export default async function AdminClinicsPage() {
  await requireAdmin();
  const clinics = await db.clinic.findMany({
    include: {
      facilities: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Quản Lý Cơ Sở Phòng Khám
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Thông tin địa chỉ, liên hệ, giờ làm việc và trang thiết bị tại 2 chi nhánh Nha Khoa 2000.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/lien-he"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Xem Trang Liên Hệ</span>
          </Link>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {clinics.map((clinic) => {
          const clinicObj: Clinic = {
            ...clinic,
            facilities: clinic.facilities.map((f) => f.name),
            googleMapsUrl: clinic.googleMapsUrl ?? undefined,
            accent: clinic.accent as "blue" | "green",
          };

          return (
            <div
              key={clinic.id}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50 flex flex-col justify-between"
            >
              <div className="relative h-52 w-full bg-slate-100">
                <Image
                  src={clinic.image}
                  alt={clinic.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-dark">
                        {clinic.label}
                      </span>
                      <h2 className="text-xl font-bold text-text-primary mt-0.5">{clinic.name}</h2>
                    </div>
                    <ClinicFormDialog clinic={clinicObj} />
                  </div>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[18px] text-brand-blue-dark shrink-0 mt-0.5">
                        location_on
                      </span>
                      <span className="leading-relaxed text-text-primary">{clinic.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[18px] text-brand-blue-dark shrink-0">
                        phone
                      </span>
                      <a href={`tel:${clinic.phone}`} className="font-bold text-brand-blue-dark hover:underline">
                        {clinic.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2.5 text-text-secondary">
                      <span className="material-symbols-outlined text-[18px] text-brand-blue-dark shrink-0">
                        schedule
                      </span>
                      <span className="text-text-primary font-medium">{clinic.workingHours}</span>
                    </div>
                  </div>

                  {clinic.description && (
                    <p className="mt-4 text-xs text-text-secondary leading-relaxed bg-surface-container-low p-3.5 rounded-xl border border-border-subtle/40">
                      {clinic.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-border-subtle/60 pt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block mb-2.5">
                    Trang thiết bị &amp; Tiện ích nổi bật
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {clinic.facilities.map((fac) => (
                      <span
                        key={fac.id}
                        className="rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-blue-dark"
                      >
                        ✓ {fac.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
