import { ContentDatabaseManager, type SiteContentRecord } from "@/features/admin/components/ContentDatabaseManager";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { db } from "@/lib/db";
import { getContactCtaSettings } from "@/features/content/services/contact-cta.service";
import { aboutPageSchema } from "@/features/about/schemas/about.schema";
import { getClinics } from "@/features/clinics/services/clinic.service";

export const metadata = { title: "Nội dung website | Admin Nha Khoa 2000" };

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  await requireAdmin();
  const { section = "all" } = await searchParams;
  const [contentRecords, contactCtaSettings, clinics] = await Promise.all([
    db.siteContent.findMany({ orderBy: { key: "asc" } }),
    getContactCtaSettings(),
    getClinics(),
  ]);

  const editableContent: SiteContentRecord[] = [];
  let aboutRecordFound = false;
  let aboutRecordInvalid = false;
  for (const { key, content } of contentRecords) {
    if (key === "about_page") {
      aboutRecordFound = true;
      const parsed = aboutPageSchema.safeParse(content);
      if (parsed.success) editableContent.push({ key: "about_page", content: parsed.data });
      else aboutRecordInvalid = true;
    }
  }

  const aboutContentWarning = aboutRecordInvalid
    ? "Dữ liệu trang giới thiệu trong cơ sở dữ liệu không khớp cấu trúc hiện tại nên form chưa thể hiển thị. Dữ liệu chưa bị thay đổi; cần kiểm tra lại nội dung hoặc cấu trúc JSON."
    : !aboutRecordFound
      ? "Chưa tìm thấy bản ghi about_page. Hãy chạy migration khởi tạo nội dung website trước khi chỉnh sửa trang này."
      : undefined;

  return (
    <ContentDatabaseManager
      contentRecords={editableContent}
      contentWarning={aboutContentWarning}
      contactCtaSettings={contactCtaSettings}
      clinics={clinics.map(({ id, label }) => ({ id, label }))}
      section={section}
    />
  );
}
