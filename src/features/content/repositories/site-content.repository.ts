import { getPublicSupabaseClient } from "@/lib/supabase/public";

export const siteContentRepository = {
  async findByKey(key: string): Promise<unknown | null> {
    const { data, error } = await getPublicSupabaseClient().from("site_content").select("content").eq("key", key).maybeSingle();
    if (error) throw error;
    return data?.content ?? null;
  },
};
