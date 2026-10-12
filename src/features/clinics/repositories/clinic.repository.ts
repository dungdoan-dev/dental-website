import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { Clinic } from "../types/clinic.type";

export const clinicRepository = {
  async findAll(): Promise<readonly Clinic[]> {
    const { data: clinics, error } = await getPublicSupabaseClient().from("clinics")
      .select("*, clinic_facilities(name, sort_order)").order("id");
    if (error) throw error;

    return clinics.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      label: c.label,
      badge: c.badge,
      address: c.address,
      phone: c.phone,
      image: c.image,
      description: c.description,
      workingHours: c.working_hours,
      facilities: (c.clinic_facilities ?? []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order).map((f: { name: string }) => f.name),
      googleMapsUrl: c.google_maps_url ?? undefined,
      accent: c.accent as "blue" | "green",
    }));
  },
};
