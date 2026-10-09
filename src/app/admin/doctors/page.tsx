import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { DoctorFormDialog } from "@/features/admin/components/DoctorFormDialog";
import { DeleteDoctorButton } from "@/features/admin/components/DeleteButtons";
import { DoctorSortOrderInput } from "@/features/admin/components/DoctorSortOrderInput";
import type { Doctor } from "@/features/doctors/types/doctor.type";

export const metadata = {
  title: "Đội Ngũ Bác Sĩ | Admin Nha Khoa 2000",
};

export default async function AdminDoctorsPage() {
  await requireAdmin();
  const doctors = await db.doctor.findMany({
    include: {
      specialties: { orderBy: { sortOrder: "asc" } },
      education: { orderBy: { sortOrder: "asc" } },
      experienceHighlights: { orderBy: { sortOrder: "asc" } },
      certificates: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Quản Lý Đội Ngũ Bác Sĩ &amp; Chuyên Gia
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Danh bạ hội đồng chuyên gia, bác sĩ điều trị và chứng chỉ hành nghề tại Nha Khoa 2000.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/bac-si"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Xem Trang Bác Sĩ</span>
          </Link>
          <DoctorFormDialog
            buttonLabel="+ Thêm Bác Sĩ Mới"
            buttonClassName="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-blue-dark hover:bg-brand-blue text-white text-xs font-bold shadow-md transition-all"
          />
        </div>
      </div>

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bác sĩ</th>
                <th className="px-4 py-4">Chức vụ &amp; Chuyên khoa</th>
                <th className="px-4 py-4">Kinh nghiệm</th>
                <th className="px-4 py-4">Thứ tự</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-on-surface">
              {doctors.map((doctor, idx) => {
      const docObj: Doctor = {
                  ...doctor,
                  category: doctor.category as Doctor["category"],
                  profile: {
                    licenseNumber: doctor.licenseNumber ?? "",
                    quote: doctor.quote ?? "",
                    sourceUrl: doctor.sourceUrl ?? "",
                    languages: Array.isArray(doctor.languages) ? doctor.languages.filter((value): value is string => typeof value === "string") : [],
                    specialties: doctor.specialties.map((item) => item.specialty),
                    education: doctor.education.map((item) => item.content),
                    experienceHighlights: doctor.experienceHighlights.map((item) => item.content),
                    certificates: doctor.certificates.map(({ title, issuer, detail, image }) => ({ title, issuer, detail, image })),
                  },
                };

                return (
                  <tr
                    key={doctor.id}
                    className={`hover:bg-background-secondary transition-colors ${
                      idx % 2 === 1 ? "bg-background-secondary/30" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-border-subtle shadow-sm">
                          <Image
                            src={doctor.avatar}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-text-primary text-sm hover:text-brand-blue-dark transition-colors">
                            <Link href={`/bac-si/${doctor.slug}`} target="_blank">
                              {doctor.name}
                            </Link>
                          </div>
                          <div className="text-[11px] text-text-secondary font-mono">
                            /bac-si/{doctor.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-text-primary text-xs">{doctor.position}</div>
                      <div className="text-[11px] text-text-secondary">{doctor.specialty}</div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-xs text-text-primary">
                      {doctor.experience} năm
                    </td>

                    <td className="px-4 py-3.5">
                      <DoctorSortOrderInput id={doctor.id} sortOrder={doctor.sortOrder} />
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <DoctorFormDialog
                          doctor={docObj}
                          buttonLabel="Sửa"
                          buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                        />
                        <DeleteDoctorButton id={doctor.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
