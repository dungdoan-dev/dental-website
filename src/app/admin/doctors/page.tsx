import Image from "next/image";
import { getDoctorFullName } from "@/features/doctors/utils/doctor-card-name";
import Link from "next/link";
import { DirectoryHeroForm } from "@/features/admin/components/DirectoryHeroForm";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { DoctorFormDialog } from "@/features/admin/components/DoctorFormDialog";
import { DeleteDoctorButton } from "@/features/admin/components/DeleteButtons";
import { DoctorSortOrderInput } from "@/features/admin/components/DoctorSortOrderInput";

export const metadata = {
  title: "Đội Ngũ Bác Sĩ | Admin Nha Khoa 2000",
};

export default async function AdminDoctorsPage() {
  await requireAdmin();
  // List rows only: the profile (description, education, certificates…) loads when "Sửa" is clicked.
  const { data, error } = await (await getSupabaseServerClient()).from("doctors")
    .select("id,name,slug,avatar,position,degree,experience,sort_order,doctor_specialties(specialty,sort_order)")
    .order("sort_order").order("id");
  if (error) throw error;
  const doctors = data.map((row) => ({
    id: row.id, name: row.name, slug: row.slug, avatar: row.avatar, position: row.position, degree: row.degree,
    experience: row.experience, sortOrder: row.sort_order,
    specialties: [...row.doctor_specialties].sort((a, b) => a.sort_order - b.sort_order).map((item) => item.specialty),
  }));

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

      <DirectoryHeroForm page="doctors" />

      {/* Doctors Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div aria-label="Danh sách bác sĩ" className="admin-table-scroll overflow-x-auto" role="region" tabIndex={0}>
          <table className="admin-responsive-table w-full min-w-[1090px] table-fixed border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface-container-low text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="w-[290px] px-4 py-4">Bác sĩ</th>
                <th className="w-[330px] px-4 py-4">Chức vụ &amp; Chuyên khoa</th>
                <th className="w-[110px] px-4 py-4">Kinh nghiệm</th>
                <th className="w-[180px] px-4 py-4">Thứ tự</th>
                <th className="w-[180px] px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-on-surface">
              {doctors.map((doctor, idx) => {
                return (
                  <tr
                    key={doctor.id}
                    className={`hover:bg-background-secondary transition-colors ${
                      idx % 2 === 1 ? "bg-background-secondary/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5" data-label="Bác sĩ">
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
                        <div className="min-w-0">
                          <div className="font-bold text-text-primary text-sm hover:text-brand-blue-dark transition-colors">
                            <Link href={`/bac-si/${doctor.slug}`} target="_blank">
                              {getDoctorFullName(doctor)}
                            </Link>
                          </div>
                          <div className="truncate text-[11px] text-text-secondary font-mono">
                            /bac-si/{doctor.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5" data-label="Chức vụ & chuyên khoa">
                      <div className="font-semibold text-text-primary text-xs">{doctor.position}</div>
                      <div className="text-[11px] text-text-secondary">{doctor.specialties.join(" · ") || "—"}</div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-xs text-text-primary" data-label="Kinh nghiệm">
                      {doctor.experience} năm
                    </td>

                    <td className="px-4 py-3.5" data-label="Thứ tự">
                      <DoctorSortOrderInput id={doctor.id} sortOrder={doctor.sortOrder} />
                    </td>

                    <td className="px-4 py-3.5 text-right" data-label="Thao tác">
                      <div className="inline-flex items-center gap-2 whitespace-nowrap">
                        <DoctorFormDialog
                          doctorId={doctor.id}
                          buttonLabel="Sửa"
                          buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                        />
                        <DeleteDoctorButton id={doctor.id} name={getDoctorFullName(doctor)} />
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
