import { AdminActionForm } from "./AdminActionForm";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { updateDirectoryHero } from "../content-actions";
import { directoryHeroPages, directoryHeroSchema, type DirectoryHeroPage } from "@/features/content/schemas/directory-hero.schema";

const input = "mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary";

// Pages call this first and pass the result as `loading`, so this query runs in parallel with the page's own queries
// instead of after them (a child component only starts when its parent has finished).
export function loadDirectoryHero(page: DirectoryHeroPage) {
  const result = getSupabaseServerClient().then((supabase) => supabase.from("site_content").select("content").eq("key", directoryHeroPages[page].key).maybeSingle());
  result.catch(() => {}); // avoid an unhandled rejection if the page throws before the form awaits it
  return result;
}

export async function DirectoryHeroForm({ page, loading = loadDirectoryHero(page) }: { page: DirectoryHeroPage; loading?: ReturnType<typeof loadDirectoryHero> }) {
  const { label, path, defaults } = directoryHeroPages[page];
  const { data, error } = await loading;
  if (error) throw error;
  const saved = directoryHeroSchema.safeParse(data?.content);
  const hero = saved.success ? saved.data : defaults;

  return (
    <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
      <div className="border-b px-6 py-5"><h2 className="text-base font-bold text-text-primary">{label}</h2><p className="text-xs text-text-secondary">Tiêu đề và mô tả hiển thị đầu trang {path}.</p></div>
      <AdminActionForm action={updateDirectoryHero} submitLabel="Lưu tiêu đề trang" className="space-y-4 p-6">
        <input name="page" type="hidden" value={page} />
        <div className="grid gap-4 md:grid-cols-2"><label className="block text-xs font-semibold text-text-secondary">Tiêu đề<input className={input} defaultValue={hero.title} maxLength={160} name="title" required /></label><label className="block text-xs font-semibold text-text-secondary">Mô tả bên dưới<textarea className={input} defaultValue={hero.description} maxLength={600} name="description" rows={3} /></label></div>
      </AdminActionForm>
    </section>
  );
}
