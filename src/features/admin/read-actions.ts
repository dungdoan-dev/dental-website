"use server";

import { requireAdmin } from "./auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { recordIdSchema } from "./schemas/admin.schema";
import { serviceDetailContentKey, serviceDetailSchema, type ServiceDetailData } from "@/features/services/schemas/service-detail.schema";
import { implantDetailSchema } from "@/features/services/schemas/implant-detail.schema";
import type { Article } from "@/features/articles/types/article.type";
import type { DentalService, ServiceCategory } from "@/features/services/types/service.type";
import type { Doctor } from "@/features/doctors/types/doctor.type";
import { doctorRepository } from "@/features/doctors/repositories/doctor.repository";

export async function getAdminArticleForEdit(id: string): Promise<Article> {
  await requireAdmin();
  const parsedId = recordIdSchema.parse(id);
  const { data, error } = await (await getSupabaseServerClient())
    .from("articles")
    .select("id,title,slug,excerpt,content,thumbnail,published_at,author,category,reading_minutes,featured,status")
    .eq("id", parsedId)
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    thumbnail: data.thumbnail,
    publishedAt: data.published_at,
    author: data.author,
    category: data.category as Article["category"],
    readingMinutes: data.reading_minutes,
    featured: data.featured,
    status: data.status,
  };
}

export async function getAdminServiceDetailForEdit(serviceId: string): Promise<ServiceDetailData | null> {
  await requireAdmin();
  const parsedId = recordIdSchema.parse(serviceId);
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from("site_content")
    .select("content")
    .eq("key", serviceDetailContentKey(parsedId))
    .maybeSingle();
  if (error) throw error;
  // Invalid/legacy saved content falls back to defaults so the editor can still open and overwrite it.
  if (data) return serviceDetailSchema.safeParse(data.content).data ?? null;

  const { data: service, error: serviceError } = await supabase.from("services")
    .select("slug,name,description")
    .eq("id", parsedId)
    .single();
  if (serviceError) throw serviceError;
  if (service.slug !== "trong-rang-implant") return null;

  const { data: legacy, error: legacyError } = await supabase.from("site_content")
    .select("content")
    .eq("key", "implant_detail")
    .maybeSingle();
  if (legacyError) throw legacyError;
  const parsed = implantDetailSchema.safeParse(legacy?.content);
  return parsed.success ? serviceDetailSchema.parse({
    eyebrow: "Nha khoa chuyên sâu · Implant",
    title: service.name,
    introduction: service.description,
    highlights: [],
    ...parsed.data,
  }) : null;
}

export async function getAdminServiceForEdit(id: string): Promise<DentalService> {
  await requireAdmin();
  const { data: s, error } = await (await getSupabaseServerClient()).from("services")
    .select("id,name,slug,short_description,description,image,badge,badge_variant,featured,sort_order,category")
    .eq("id", recordIdSchema.parse(id))
    .single();
  if (error) throw error;
  return {
    id: s.id, name: s.name, slug: s.slug, shortDescription: s.short_description, description: s.description,
    image: s.image, badge: s.badge, badgeVariant: s.badge_variant as "blue" | "green", featured: s.featured,
    sortOrder: s.sort_order, category: s.category as ServiceCategory,
  };
}

export async function getAdminDoctorForEdit(id: string): Promise<Doctor> {
  await requireAdmin();
  const doctor = await doctorRepository.findById(recordIdSchema.parse(id));
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
}
