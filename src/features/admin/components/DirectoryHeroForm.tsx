import { AdminActionForm } from "./AdminActionForm";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateDirectoryHero } from "../content-actions";
import { directoryHeroPages, directoryHeroSchema, type DirectoryHeroPage } from "@/features/content/schemas/directory-hero.schema";

const input = "mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary";

export async function DirectoryHeroForm({ page }: { page: DirectoryHeroPage }) {
  const { key, label, path, defaults } = directoryHeroPages[page];
  const { data, error } = await (await getSupabaseServerClient()).from("site_content").select("content").eq("key", key).maybeSingle();
  if (error) throw error;
  const saved = directoryHeroSchema.safeParse(data?.content);
  const hero = saved.success ? saved.data : defaults;

  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle/50 bg-white shadow-sm">
      <div className="border-b border-border-subtle/60 bg-surface-container-low/50 px-6 py-4"><h2 className="text-base font-bold text-text-primary">{label}</h2><p className="text-xs text-text-secondary">Tiêu đề và mô tả hiển thị đầu trang {path}.</p></div>
      <AdminActionForm action={updateDirectoryHero} submitLabel="Lưu tiêu đề trang" className="space-y-4 p-6">
        <input name="page" type="hidden" value={page} />
        <div className="grid gap-4 md:grid-cols-2"><label className="block text-xs font-semibold text-text-secondary">Tiêu đề<input className={input} defaultValue={hero.title} maxLength={160} name="title" required /></label><label className="block text-xs font-semibold text-text-secondary">Mô tả bên dưới<textarea className={input} defaultValue={hero.description} maxLength={600} name="description" rows={3} /></label></div>
      </AdminActionForm>
    </section>
  );
}
