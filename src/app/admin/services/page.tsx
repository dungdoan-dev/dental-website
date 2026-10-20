import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/admin-ui/badge";
import { Button, buttonVariants } from "@/components/admin-ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/admin-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/table";
import { PageHeader } from "@/features/admin/components/PageHeader";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { ServiceFormDialog } from "@/features/admin/components/ServiceFormDialog";
import { DeleteServiceButton } from "@/features/admin/components/DeleteButtons";
import { ServiceDetailFormDialog } from "@/features/admin/components/ServiceDetailFormDialog";
import type { DentalService } from "@/features/services/types/service.type";
import { updateServicePriceCategories } from "@/features/admin/content-actions";
import { AdminActionForm } from "@/features/admin/components/AdminActionForm";
import { ServicePriceCategoriesEditor } from "@/features/admin/components/ServicePriceCategoriesEditor";
import { defaultServicePriceCategories } from "@/features/services/data/service-price-categories";
import { servicePriceCategoriesSchema } from "@/features/services/schemas/service-price-categories.schema";
import { ServiceSortOrderControl } from "@/features/admin/components/ServiceSortOrderControl";
import { DirectoryHeroForm, loadDirectoryHero } from "@/features/admin/components/DirectoryHeroForm";
import { serviceIconByCategory } from "@/features/services/data/service-filter.data";

export const metadata = {
  title: "Quản Lý Dịch Vụ | Admin Nha Khoa 2000",
};

export default async function AdminServicesPage() {
  await requireAdmin();
  const hero = loadDirectoryHero("services");
  const supabase = await getSupabaseServerClient();
  const [{ data: serviceRows, error: serviceError }, { data: pricingRecord, error: pricingError }] = await Promise.all([
    supabase.from("services")
      .select("id,name,slug,sort_order,category")
      .order("sort_order").order("id"),
    supabase.from("site_content").select("content").eq("key", "service_price_categories").maybeSingle(),
  ]);
  if (serviceError) throw serviceError;
  const services = serviceRows.map((service) => ({
    id: service.id, name: service.name, slug: service.slug, sortOrder: service.sort_order,
    category: service.category as DentalService["category"],
  }));
  if (pricingError) throw pricingError;
  const pricingParse = servicePriceCategoriesSchema.safeParse(pricingRecord?.content);
  const pricing = pricingParse.success ? pricingParse.data : defaultServicePriceCategories;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<>
          <Button asChild size="sm" variant="outline"><Link prefetch={false} href="/dich-vu" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang dịch vụ</Link></Button>
          <ServiceFormDialog buttonClassName={buttonVariants({ size: "sm" })} buttonLabel="+ Thêm dịch vụ" />
        </>}
        description="Danh mục dịch vụ khám và điều trị nha khoa kỹ thuật cao tại 2 chi nhánh Nha Khoa 2000."
        title="Dịch vụ chuyên sâu"
      />

      <DirectoryHeroForm loading={hero} page="services" />

      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="border-b px-6 py-5"><h2 className="text-base font-bold text-text-primary">Bảng giá theo danh mục kĩ thuật</h2><p className="text-xs text-text-secondary">Cấu hình tiêu đề, ghi chú và các danh mục hiển thị tại trang /bang-gia.</p></div>
        <AdminActionForm action={updateServicePriceCategories} submitLabel="Lưu bảng giá danh mục" className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2"><label className="block text-xs font-semibold text-text-secondary">Tiêu đề<input className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={pricing.title} maxLength={160} name="title" required /></label><label className="block text-xs font-semibold text-text-secondary">Ghi chú bên dưới<textarea className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={pricing.description} maxLength={500} name="description" rows={2} /></label></div>
          <fieldset className="space-y-3 rounded-xl border border-border-subtle p-3"><legend className="px-1 text-sm font-semibold text-text-primary">Danh mục và mức giá</legend><ServicePriceCategoriesEditor initialRows={pricing.rows} /></fieldset>
        </AdminActionForm>
      </section>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-base">Danh sách dịch vụ</CardTitle>
          <CardDescription>{services.length} dịch vụ, sắp theo thứ tự hiển thị.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-24 pl-6">Icon</TableHead>
              <TableHead>Tên dịch vụ &amp; slug</TableHead>
              <TableHead className="w-40">Danh mục</TableHead>
              <TableHead className="w-44">Thứ tự</TableHead>
              <TableHead className="w-72 pr-6 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="pl-6">
                  <div className="grid size-12 place-items-center rounded-xl border bg-muted">
                    <Image alt="" className="object-contain" height={36} src={serviceIconByCategory[service.category as DentalService["category"]]} width={36} />
                  </div>
                </TableCell>
                <TableCell>
                  <Link prefetch={false} className="block truncate text-sm font-semibold hover:text-primary" href={`/dich-vu/${service.slug}`} target="_blank" title={service.name}>{service.name}</Link>
                  <div className="truncate font-mono text-xs text-muted-foreground">/dich-vu/{service.slug}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{service.category}</Badge></TableCell>
                <TableCell><ServiceSortOrderControl id={service.id} initialValue={service.sortOrder} /></TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="inline-flex items-center gap-2">
                    <ServiceFormDialog buttonClassName={buttonVariants({ variant: "soft", size: "sm" })} buttonLabel="Sửa" serviceId={service.id} />
                    <ServiceDetailFormDialog service={service} />
                    <DeleteServiceButton id={service.id} name={service.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 ? <TableRow><TableCell className="h-24 text-center text-muted-foreground" colSpan={5}>Chưa có dịch vụ nào. Bấm “+ Thêm dịch vụ” để tạo dịch vụ đầu tiên.</TableCell></TableRow> : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
