import { ContentDatabaseManager, type SiteContentRecord } from "@/features/admin/components/ContentDatabaseManager";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { aboutPageSchema } from "@/features/about/schemas/about.schema";
import { defaultAboutContent } from "@/features/about/data/about-content";

export const metadata = { title: "Nội dung website | Admin Nha Khoa 2000" };

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  await requireAdmin();
  const { section = "all" } = await searchParams;
  const supabase = await getSupabaseServerClient();
  const contentRecords = await supabase.from("site_content").select("key,content").order("key");
  if (contentRecords.error) throw contentRecords.error;

  const editableContent: SiteContentRecord[] = [];
  let aboutRecordFound = false;
  let aboutRecordInvalid = false;
  for (const { key, content } of contentRecords.data ?? []) {
    if (key === "about_page") {
      aboutRecordFound = true;
      const parsed = aboutPageSchema.safeParse(content);
      if (parsed.success) editableContent.push({ key: "about_page", content: parsed.data });
      else aboutRecordInvalid = true;
    }
  }

  // Without a valid record the pages show the built-in content; the form starts from it so saving creates the record.
  if (!aboutRecordFound || aboutRecordInvalid) editableContent.push({ key: "about_page", content: defaultAboutContent });
  const aboutContentWarning = aboutRecordInvalid
    ? "Bản ghi about_page trong cơ sở dữ liệu theo cấu trúc cũ. Form đang hiện nội dung mặc định của trang; bấm Lưu để ghi đè bản ghi cũ."
    : !aboutRecordFound
      ? "Chưa có bản ghi about_page. Form đang hiện nội dung mặc định của trang; bấm Lưu để tạo bản ghi."
      : undefined;

  return (
    <ContentDatabaseManager
      contentRecords={editableContent}
      contentWarning={aboutContentWarning}
      section={section}
    />
  );
}
