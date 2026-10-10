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
  for (const { key, content } of contentRecords) {
    if (key === "about_page") {
      const parsed = aboutPageSchema.safeParse(content);
      if (parsed.success) editableContent.push({ key: "about_page", content: parsed.data });
    }
  }

  return (
    <ContentDatabaseManager
      contentRecords={editableContent}
      contactCtaSettings={contactCtaSettings}
      clinics={clinics.map(({ id, label }) => ({ id, label }))}
      section={section}
    />
  );
}
