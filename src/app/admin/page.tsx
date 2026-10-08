import { PagesTableManager } from "@/features/admin/components/PagesTableManager";
import { requireAdmin } from "@/features/admin/auth/admin-auth";

export const metadata = {
  title: "Quản Lý Danh Sách Trang & Điều Hướng | Admin Nha Khoa 2000",
  description: "Quản trị nội dung cấu trúc, trạng thái xuất bản, cấu hình SEO và các phiên bản trang.",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  return (
    <div className="w-full">
      <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full">
        <PagesTableManager />
      </div>
    </div>
  );
}
