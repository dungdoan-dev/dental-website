import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { DentalService, ServiceCategory } from "../types/service.type";

export const serviceRepository = {
  async findAll(): Promise<readonly DentalService[]> {
    const { data: services, error } = await getPublicSupabaseClient().from("services").select("*").order("sort_order").order("id");
    if (error) throw error;

    return services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.short_description,
      description: s.description,
      image: s.image,
      badge: s.badge,
      badgeVariant: s.badge_variant as "blue" | "green",
      featured: s.featured,
      sortOrder: s.sort_order,
      category: s.category as ServiceCategory,
    }));
  },

  async findBySlug(slug: string): Promise<DentalService | null> {
    const { data: s, error } = await getPublicSupabaseClient().from("services").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;

    if (!s) return null;

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.short_description,
      description: s.description,
      image: s.image,
      badge: s.badge,
      badgeVariant: s.badge_variant as "blue" | "green",
      featured: s.featured,
      sortOrder: s.sort_order,
      category: s.category as ServiceCategory,
    };
  },
};
