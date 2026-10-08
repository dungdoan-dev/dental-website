import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { ServiceFormDialog } from "@/features/admin/components/ServiceFormDialog";
import { DeleteServiceButton } from "@/features/admin/components/DeleteButtons";
import { ServiceDetailFormDialog } from "@/features/admin/components/ServiceDetailFormDialog";
import type { DentalService } from "@/features/services/types/service.type";
import { serviceDetailSchema, serviceDetailContentKey, type ServiceDetailData } from "@/features/services/schemas/service-detail.schema";
import { implantDetailSchema } from "@/features/services/schemas/implant-detail.schema";

export const metadata = {
  title: "Quản Lý Dịch Vụ | Admin Nha Khoa 2000",
};

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await db.service.findMany({
    orderBy: { id: "asc" },
  });
  const detailRecords = await db.siteContent.findMany({
    where: { key: { in: [...services.map((service) => serviceDetailContentKey(service.id)), "implant_detail"] } },
    select: { key: true, content: true },
  });
  const detailByKey = new Map(detailRecords.map((record) => [record.key, record.content]));

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Quản Lý Dịch Vụ Chuyên Sâu
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Danh mục các dịch vụ khám và điều trị nha khoa kỹ thuật cao tại 2 chi nhánh Nha Khoa 2000.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dich-vu"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Xem Trang Dịch Vụ</span>
          </Link>
          <ServiceFormDialog
            buttonLabel="+ Thêm Dịch Vụ Mới"
            buttonClassName="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-blue-dark hover:bg-brand-blue text-white text-xs font-bold shadow-md transition-all"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Ảnh</th>
                <th className="px-6 py-4">Tên dịch vụ &amp; Slug</th>
                <th className="px-4 py-4">Danh mục</th>
                <th className="px-4 py-4">Nổi bật</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-on-surface">
              {services.map((service, idx) => {
                const detailKey = serviceDetailContentKey(service.id);
                let detail: ServiceDetailData | undefined;
                const savedDetail = detailByKey.get(detailKey);
                if (savedDetail) {
                  const parsedDetail = serviceDetailSchema.safeParse(savedDetail);
                  if (parsedDetail.success) detail = parsedDetail.data;
                } else if (service.slug === "trong-rang-implant") {
                  const legacy = implantDetailSchema.safeParse(detailByKey.get("implant_detail"));
                  if (legacy.success) detail = {
                    eyebrow: "Nha khoa chuyên sâu · Implant",
                    title: service.name,
                    introduction: service.description,
                    highlights: [],
                    ...legacy.data,
                  };
                }
                const dentalService: DentalService = {
                  ...service,
                  badgeVariant: service.badgeVariant as "blue" | "green",
                  category: service.category as DentalService["category"],
                };

                return (
                  <tr
                    key={service.id}
                    className={`hover:bg-background-secondary transition-colors ${
                      idx % 2 === 1 ? "bg-background-secondary/30" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-slate-100 border border-border-subtle shadow-sm">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="font-bold text-text-primary text-sm hover:text-brand-blue-dark transition-colors">
                        <Link href={`/dich-vu/${service.slug}`} target="_blank">
                          {service.name}
                        </Link>
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono mt-0.5">
                        /dich-vu/{service.slug}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary">
                        <span className="material-symbols-outlined text-[15px] text-brand-blue-dark">category</span>
                        {service.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      {service.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-dark">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Trang chủ</span>
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary">—</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <ServiceFormDialog
                          service={dentalService}
                          buttonLabel="Sửa"
                          buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                        />
                        <ServiceDetailFormDialog detail={detail} service={dentalService} />
                        <DeleteServiceButton id={service.id} />
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
