import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/admin-ui/badge";
import { Button, buttonVariants } from "@/components/admin-ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/admin-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/table";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { getDoctorFullName } from "@/features/doctors/utils/doctor-card-name";
import Link from "next/link";
import { DirectoryHeroForm, loadDirectoryHero } from "@/features/admin/components/DirectoryHeroForm";
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
  const hero = loadDirectoryHero("doctors");
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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<>
          <Button asChild size="sm" variant="outline"><Link prefetch={false} href="/bac-si" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang bác sĩ</Link></Button>
          <DoctorFormDialog buttonClassName={buttonVariants({ size: "sm" })} buttonLabel="+ Thêm bác sĩ" />
        </>}
        description="Danh bạ bác sĩ, chuyên gia và chứng chỉ hành nghề tại Nha Khoa 2000."
        title="Đội ngũ bác sĩ"
      />

      <DirectoryHeroForm loading={hero} page="doctors" />

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-base">Danh sách bác sĩ</CardTitle>
          <CardDescription>{doctors.length} bác sĩ, sắp theo thứ tự hiển thị.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px] pl-6">Bác sĩ</TableHead>
              <TableHead>Chức vụ &amp; chuyên khoa</TableHead>
              <TableHead className="w-32">Kinh nghiệm</TableHead>
              <TableHead className="w-44">Thứ tự</TableHead>
              <TableHead className="w-48 pr-6 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full border bg-muted">
                      <Image alt={doctor.name} className="object-cover" fill sizes="44px" src={doctor.avatar} />
                    </div>
                    <div className="min-w-0">
                      <Link prefetch={false} className="block truncate text-sm font-semibold hover:text-primary" href={`/bac-si/${doctor.slug}`} target="_blank">{getDoctorFullName(doctor)}</Link>
                      <div className="truncate font-mono text-xs text-muted-foreground">/bac-si/{doctor.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div className="text-sm font-medium">{doctor.position}</div>
                  <div className="text-xs text-muted-foreground">{doctor.specialties.join(" · ") || "—"}</div>
                </TableCell>
                <TableCell><Badge variant="secondary">{doctor.experience} năm</Badge></TableCell>
                <TableCell><DoctorSortOrderInput id={doctor.id} sortOrder={doctor.sortOrder} /></TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="inline-flex items-center gap-2">
                    <DoctorFormDialog buttonClassName={buttonVariants({ variant: "soft", size: "sm" })} buttonLabel="Sửa" doctorId={doctor.id} />
                    <DeleteDoctorButton id={doctor.id} name={getDoctorFullName(doctor)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 ? <TableRow><TableCell className="h-24 text-center text-muted-foreground" colSpan={5}>Chưa có bác sĩ nào. Bấm “+ Thêm bác sĩ” để tạo hồ sơ đầu tiên.</TableCell></TableRow> : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
