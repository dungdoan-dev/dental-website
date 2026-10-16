"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "./auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";
import { serviceFormSchema, serviceSortOrderSchema, doctorFormSchema, doctorSortOrderSchema, articleFormSchema, faqSchema, testimonialSchema, numericIdSchema, recordIdSchema, appointmentStatusSchema, imagePathSchema } from "./schemas/admin.schema";
import { runMutation, validationFailure, saveRevision, SlugConflictError } from "./services/mutation";
import { publicDataTags } from "@/lib/public-data-cache";
import { sanitizeArticleContent } from "@/features/articles/lib/article-content";

const heroSlideSchema = z.object({
  id: recordIdSchema, image: imagePathSchema, imageAlt: z.string().trim().min(1).max(200),
  badge: z.string().trim().max(120), title: z.string().trim().min(1).max(200),
  badgeVariant: z.enum(["blue", "green"]), objectPosition: z.enum(["center", "top"]),
  sortOrder: z.number().int().min(0).max(9999),
});

const coreValueSchema = z.object({
  id: numericIdSchema,
  title: z.string().trim().min(1).max(80),
  slogan: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(1200),
  iconKey: z.enum(["heart", "care", "honesty", "innovation"]),
  sortOrder: z.number().int().min(0).max(999),
});

const clinicFormSchema = z.object({
  id: recordIdSchema,
  name: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(500),
  phone: z.string().trim().min(1).max(100),
  workingHours: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  image: imagePathSchema,
});

export async function updateCoreValue(_previous: import("./services/mutation").MutationResult | null, formData: FormData) {
  await requireAdmin();
  const parsed = coreValueSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slogan: formData.get("slogan"),
    description: formData.get("description"),
    iconKey: formData.get("iconKey"),
    sortOrder: Number(formData.get("sortOrder")),
  });
  if (!parsed.success) return validationFailure(parsed.error);
  const { id, ...data } = parsed.data;
  return runMutation(async () => {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("core_values").update({
      title: data.title, slogan: data.slogan, description: data.description,
      icon_key: data.iconKey, sort_order: data.sortOrder,
    }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/home");
    revalidatePath("/");
    updateTag(publicDataTags.coreValues);
  });
}

function revalidateContent(paths: string[]) {
  revalidatePath("/admin");
  for (const path of paths) {
    if (path.includes("[") && path.includes("]")) revalidatePath(path, "page");
    else revalidatePath(path);
  }
  if (paths.includes("/admin/services")) {
    updateTag(publicDataTags.services);
    updateTag(publicDataTags.siteContent);
  }
  if (paths.includes("/admin/doctors")) updateTag(publicDataTags.doctors);
  if (paths.includes("/admin/articles")) updateTag(publicDataTags.articles);
  if (paths.includes("/admin/home")) updateTag(publicDataTags.heroSlides);
}

export async function upsertHeroSlide(input: z.infer<typeof heroSlideSchema>) {
  await requireAdmin();
  const parsed = heroSlideSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from("hero_slides").upsert({
      id: parsed.data.id, image: parsed.data.image, image_alt: parsed.data.imageAlt, badge: parsed.data.badge,
      title: parsed.data.title, badge_variant: parsed.data.badgeVariant, object_position: parsed.data.objectPosition,
      sort_order: parsed.data.sortOrder,
    });
    if (error) throw error;
    await saveRevision("slider", parsed.data.id, parsed.data.title, parsed.data);
    revalidateContent(["/admin/home", "/"]);
  });
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("hero_slides").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateContent(["/admin/home", "/"]);
  });
}

export async function updateAppointmentStatus(id: string, status: unknown) {
  await requireAdmin();
  const parsed = z.object({ id: numericIdSchema, status: appointmentStatusSchema }).safeParse({ id, status });
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("appointments").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) throw error;
    revalidateContent(["/admin/appointments"]);
  });
}

export async function deleteAppointment(id: string) {
  await requireAdmin();
  const parsed = numericIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("appointments").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateContent(["/admin/appointments"]);
  });
}

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export async function upsertService(input: ServiceFormData) {
  await requireAdmin();
  const parsed = serviceFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const data = parsed.data;
  return runMutation(async () => {
    const supabase = await getSupabaseServerClient();
    const { data: duplicate, error: duplicateError } = await supabase.from("services").select("id").eq("slug", data.slug).maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
    const { data: existing, error: existingError } = await supabase.from("services").select("sort_order").eq("id", data.id).maybeSingle();
    if (existingError) throw existingError;
    const { error } = await supabase.from("services").upsert({
      id: data.id, name: data.name, slug: data.slug, short_description: data.shortDescription,
      description: data.description, image: data.image, badge: data.badge, badge_variant: data.badgeVariant,
      featured: data.featured, sort_order: existing?.sort_order ?? 0, category: data.category,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    await saveRevision("service", data.id, data.name, data);
    revalidateContent(["/admin/services", "/dich-vu", "/dich-vu/[slug]", "/"]);
  });
}

export async function updateServiceSortOrder(input: { id: string; sortOrder: number }) {
  await requireAdmin();
  const parsed = serviceSortOrderSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("services").update({ sort_order: parsed.data.sortOrder, updated_at: new Date().toISOString() }).eq("id", parsed.data.id);
    if (error) throw error;
    revalidateContent(["/admin/services", "/dich-vu", "/"]);
  });
}

export async function deleteService(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("services").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateContent(["/admin/services", "/dich-vu", "/"]);
  });
}

export type DoctorFormData = z.infer<typeof doctorFormSchema>;
export async function upsertDoctor(input: DoctorFormData) {
  await requireAdmin();
  const parsed = doctorFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const { education, specialties, experienceHighlights, certificates, ...data } = parsed.data;
  const base = { ...data, licenseNumber: data.licenseNumber || null, quote: data.quote || null, sourceUrl: data.sourceUrl || null };
  return runMutation(async () => {
    const supabase = await getSupabaseServerClient();
    const { data: duplicate, error: duplicateError } = await supabase.from("doctors").select("id").eq("slug", data.slug).maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
    const { error } = await supabase.from("doctors").upsert({
      id: base.id, name: base.name, slug: base.slug, avatar: base.avatar, position: base.position,
      experience: base.experience, sort_order: base.sortOrder,
      degree: base.degree, description: base.description,
      badge: base.badge, highlight: base.highlight, category: base.category, directory_title: base.directoryTitle,
      license_number: base.licenseNumber, quote: base.quote, languages: base.languages, source_url: base.sourceUrl,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    // One DB transaction: a failed insert keeps the old rows instead of leaving them deleted.
    const { error: detailsError } = await supabase.rpc("replace_doctor_details", {
      p_doctor_id: data.id,
      p_education: education ?? null,
      p_specialties: specialties ?? null,
      p_experience_highlights: experienceHighlights ?? null,
      p_certificates: certificates ?? null,
    });
    if (detailsError) throw detailsError;
    await saveRevision("doctor", data.id, data.name, parsed.data);
    revalidateContent(["/admin/doctors", "/bac-si", "/bac-si/[slug]", "/"]);
  });
}

export async function updateDoctorSortOrder(input: { id: string; sortOrder: number }) {
  await requireAdmin();
  const parsed = doctorSortOrderSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("doctors").update({ sort_order: parsed.data.sortOrder, updated_at: new Date().toISOString() }).eq("id", parsed.data.id);
    if (error) throw error;
    revalidateContent(["/admin/doctors", "/bac-si", "/"]);
  });
}

export async function deleteDoctor(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("doctors").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateContent(["/admin/doctors", "/bac-si", "/"]);
  });
}

export type ArticleFormData = z.infer<typeof articleFormSchema>;
export async function upsertArticle(input: ArticleFormData) {
  await requireAdmin();
  const parsed = articleFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const data = { ...parsed.data, content: sanitizeArticleContent(parsed.data.content) };
  return runMutation(async () => {
    const supabase = await getSupabaseServerClient();
    const { data: duplicate, error: duplicateError } = await supabase.from("articles").select("id").eq("slug", data.slug).maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
    const { data: previous, error: previousError } = await supabase.from("articles").select("status,published_at").eq("id", data.id).maybeSingle();
    if (previousError) throw previousError;
    const publishedAt = data.status === "published" && previous?.status !== "published" ? new Date().toISOString() : previous?.published_at ?? new Date().toISOString();
    const { error } = await supabase.from("articles").upsert({
      id: data.id, title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content,
      thumbnail: data.thumbnail, published_at: publishedAt, author: data.author, category: data.category,
      reading_minutes: data.readingMinutes, featured: data.featured, status: data.status,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    await saveRevision("article", data.id, data.title, { ...data, publishedAt });
    revalidateContent(["/admin/articles", "/tin-tuc", "/tin-tuc/[slug]", "/"]);
  });
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("articles").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateContent(["/admin/articles", "/tin-tuc", "/"]);
  });
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
function revalidateHome(tag: string) {
  revalidatePath("/admin/home");
  revalidatePath("/");
  updateTag(tag);
}

export async function upsertFaq(input: z.infer<typeof faqSchema>) {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const { id, question, answer, sortOrder } = parsed.data;
  return runMutation(async () => {
    const row = { question, answer, sort_order: sortOrder };
    const supabase = await getSupabaseServerClient();
    const { error } = id ? await supabase.from("faq_items").update(row).eq("id", id) : await supabase.from("faq_items").insert(row);
    if (error) throw error;
    revalidateHome(publicDataTags.faqs);
  });
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  const parsed = numericIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("faq_items").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateHome(publicDataTags.faqs);
  });
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export async function upsertTestimonial(input: z.infer<typeof testimonialSchema>) {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const data = parsed.data;
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("testimonials").upsert({
      id: data.id, customer_name: data.customerName, rating: data.rating, content: data.content,
      avatar: data.avatar || null, source: data.source ?? "", initials: data.initials,
      accent: data.accent, sort_order: data.sortOrder,
    });
    if (error) throw error;
    revalidateHome(publicDataTags.testimonials);
  });
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { error } = await (await getSupabaseServerClient()).from("testimonials").delete().eq("id", parsed.data);
    if (error) throw error;
    revalidateHome(publicDataTags.testimonials);
  });
}

// ─────────────────────────────────────────────────────────────
// CLINICS
// ─────────────────────────────────────────────────────────────
export async function updateClinic(data: {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  description: string;
  image: string;
}) {
  await requireAdmin();
  const parsed = clinicFormSchema.safeParse(data);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    const { id, ...clinicData } = parsed.data;
    const { error } = await (await getSupabaseServerClient()).from("clinics").update({
      name: clinicData.name, address: clinicData.address, phone: clinicData.phone,
      working_hours: clinicData.workingHours, description: clinicData.description, image: clinicData.image,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/clinics");
    revalidatePath("/");
    revalidatePath("/lien-he");
    updateTag(publicDataTags.clinics);
  });
}
