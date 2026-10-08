import Link from "next/link";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { navigation } from "@/config/navigation";

const destination: Record<string, { href: string; description: string; icon: string }> = {
  "/": { href: "/admin/home", description: "Slider, FAQ, giá trị cốt lõi và đánh giá khách hàng.", icon: "home" },
  "/gioi-thieu": { href: "/admin/content?section=about", description: "Câu chuyện, tầm nhìn, sứ mệnh và thông tin phòng khám.", icon: "corporate_fare" },
  "/dich-vu": { href: "/admin/services", description: "Danh mục dịch vụ và nội dung chi tiết dịch vụ.", icon: "medical_services" },
  "/bac-si": { href: "/admin/doctors", description: "Hồ sơ, chuyên môn và thông tin đội ngũ bác sĩ.", icon: "badge" },
  "/tin-tuc": { href: "/admin/articles", description: "Bài viết và kiến thức nha khoa.", icon: "article" },
  "/lien-he": { href: "/admin/content?section=contact", description: "CTA liên hệ, Zalo từng cơ sở và thông tin bảo hiểm.", icon: "call" },
};

export const metadata = { title: "Cấu hình trang | Admin Nha Khoa 2000" };

export default async function AdminPagesConfigPage() {
  await requireAdmin();
  return <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-8">
    <header><p className="text-sm font-bold uppercase tracking-wider text-brand-blue">Quản trị nội dung</p><h1 className="mt-2 text-3xl font-extrabold text-text-primary">Cấu hình trang</h1><p className="mt-2 max-w-3xl text-sm text-text-secondary">Chọn một trang trên website để quản lý nội dung tương ứng. Các mục bên dưới đồng bộ với navigation trên header website.</p></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {navigation.map((item) => {
        const config = destination[item.href];
        if (!config) return null;
        return <Link className="group rounded-2xl border border-border-subtle bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-md" href={config.href} key={item.href}>
          <span className="material-symbols-outlined flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-2xl text-brand-blue-dark">{config.icon}</span>
          <h2 className="mt-4 text-lg font-bold text-text-primary group-hover:text-brand-blue-dark">{item.label}</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{config.description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-blue-dark">Mở cấu hình <span aria-hidden="true">→</span></span>
        </Link>;
      })}
    </div>
  </div>;
}
