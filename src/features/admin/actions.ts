"use server";

import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "./auth/admin-auth";
import { z } from "zod";
import { serviceFormSchema, doctorFormSchema, articleFormSchema, numericIdSchema, recordIdSchema, appointmentStatusSchema, imagePathSchema } from "./schemas/admin.schema";
import { runMutation, validationFailure, saveRevision, SlugConflictError } from "./services/mutation";
import { publicDataTags } from "@/lib/public-data-cache";

const heroSlideSchema = z.object({
  id: recordIdSchema, image: imagePathSchema, imageAlt: z.string().trim().min(1).max(200),
  badge: z.string().trim().max(120), title: z.string().trim().min(1).max(200),
  badgeVariant: z.enum(["blue", "green"]), objectPosition: z.enum(["center", "top"]),
  sortOrder: z.number().int().min(0).max(9999),
});

function revalidateContent(paths: string[]) {
  revalidatePath("/admin");
  for (const path of paths) revalidatePath(path);
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
    await db.$transaction(async (tx) => {
      await tx.heroSlide.upsert({ where: { id: parsed.data.id }, create: parsed.data, update: parsed.data });
      await saveRevision(tx, "slider", parsed.data.id, parsed.data.title, parsed.data);
    });
    revalidateContent(["/admin/home", "/"]);
  });
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.heroSlide.delete({ where: { id: parsed.data } });
    revalidateContent(["/admin/home", "/"]);
  });
}

export async function updateAppointmentStatus(id: string, status: unknown) {
  await requireAdmin();
  const parsed = z.object({ id: numericIdSchema, status: appointmentStatusSchema }).safeParse({ id, status });
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.appointment.update({ where: { id: BigInt(parsed.data.id) }, data: { status: parsed.data.status } });
    revalidateContent(["/admin/appointments"]);
  });
}

export async function deleteAppointment(id: string) {
  await requireAdmin();
  const parsed = numericIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.appointment.delete({ where: { id: BigInt(parsed.data) } });
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
    await db.$transaction(async (tx) => {
      const duplicate = await tx.service.findUnique({ where: { slug: data.slug }, select: { id: true } });
      if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
      await tx.service.upsert({ where: { id: data.id }, create: data, update: data });
      await saveRevision(tx, "service", data.id, data.name, data);
    });
    revalidateContent(["/admin/services", "/dich-vu", "/dich-vu/[slug]", "/"]);
  });
}

export async function deleteService(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.service.delete({ where: { id: parsed.data } });
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
    await db.$transaction(async (tx) => {
      const duplicate = await tx.doctor.findUnique({ where: { slug: data.slug }, select: { id: true } });
      if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
      await tx.doctor.upsert({ where: { id: data.id }, create: base, update: base });
      if (education) {
        await tx.doctorEducation.deleteMany({ where: { doctorId: data.id } });
        await tx.doctorEducation.createMany({ data: education.map((content, sortOrder) => ({ doctorId: data.id, content, sortOrder })) });
      }
      if (specialties) {
        await tx.doctorSpecialty.deleteMany({ where: { doctorId: data.id } });
        await tx.doctorSpecialty.createMany({ data: specialties.map((specialty, sortOrder) => ({ doctorId: data.id, specialty, sortOrder })) });
      }
      if (experienceHighlights) {
        await tx.doctorExperienceHighlight.deleteMany({ where: { doctorId: data.id } });
        await tx.doctorExperienceHighlight.createMany({ data: experienceHighlights.map((content, sortOrder) => ({ doctorId: data.id, content, sortOrder })) });
      }
      if (certificates) {
        await tx.doctorCertificate.deleteMany({ where: { doctorId: data.id } });
        await tx.doctorCertificate.createMany({ data: certificates.map((certificate, sortOrder) => ({ ...certificate, doctorId: data.id, sortOrder })) });
      }
      await saveRevision(tx, "doctor", data.id, data.name, parsed.data);
    });
    revalidateContent(["/admin/doctors", "/bac-si", "/bac-si/[slug]", "/"]);
  });
}

export async function deleteDoctor(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.doctor.delete({ where: { id: parsed.data } });
    revalidateContent(["/admin/doctors", "/bac-si", "/"]);
  });
}

export type ArticleFormData = z.infer<typeof articleFormSchema>;
export async function upsertArticle(input: ArticleFormData) {
  await requireAdmin();
  const parsed = articleFormSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const data = parsed.data;
  return runMutation(async () => {
    await db.$transaction(async (tx) => {
      const duplicate = await tx.article.findUnique({ where: { slug: data.slug }, select: { id: true } });
      if (duplicate && duplicate.id !== data.id) throw new SlugConflictError();
      const previous = await tx.article.findUnique({ where: { id: data.id }, select: { status: true, publishedAt: true } });
      const publishedAt = data.status === "published" && previous?.status !== "published" ? new Date() : previous?.publishedAt ?? new Date();
      await tx.article.upsert({ where: { id: data.id }, create: { ...data, publishedAt }, update: { ...data, publishedAt } });
      await saveRevision(tx, "article", data.id, data.title, { ...data, publishedAt });
    });
    revalidateContent(["/admin/articles", "/tin-tuc", "/tin-tuc/[slug]", "/"]);
  });
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const parsed = recordIdSchema.safeParse(id);
  if (!parsed.success) return validationFailure(parsed.error);
  return runMutation(async () => {
    await db.article.delete({ where: { id: parsed.data } });
    revalidateContent(["/admin/articles", "/tin-tuc", "/"]);
  });
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
export async function upsertFaq(data: {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}) {
  await requireAdmin();
  if (data.id) {
    await db.faqItem.update({
      where: { id: BigInt(data.id) },
      data: {
        question: data.question,
        answer: data.answer,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  } else {
    await db.faqItem.create({
      data: {
        question: data.question,
        answer: data.answer,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  revalidatePath("/admin/home");
  revalidatePath("/");
  updateTag(publicDataTags.faqs);
  return { success: true };
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await db.faqItem.delete({ where: { id: BigInt(id) } });
  revalidatePath("/admin/home");
  revalidatePath("/");
  updateTag(publicDataTags.faqs);
  return { success: true };
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export async function upsertTestimonial(data: {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  source?: string;
  initials: string;
  accent: string;
  sortOrder?: number;
}) {
  await requireAdmin();
  await db.testimonial.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      customerName: data.customerName,
      rating: Number(data.rating),
      content: data.content,
      source: data.source ?? "",
      initials: data.initials,
      accent: data.accent,
      sortOrder: data.sortOrder ?? 0,
    },
    update: {
      customerName: data.customerName,
      rating: Number(data.rating),
      content: data.content,
      source: data.source ?? "",
      initials: data.initials,
      accent: data.accent,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath("/admin/home");
  revalidatePath("/");
  updateTag(publicDataTags.testimonials);
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/home");
  revalidatePath("/");
  updateTag(publicDataTags.testimonials);
  return { success: true };
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
}) {
  await requireAdmin();
  await db.clinic.update({
    where: { id: data.id },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      workingHours: data.workingHours,
      description: data.description,
    },
  });

  revalidatePath("/admin/clinics");
  revalidatePath("/");
  updateTag(publicDataTags.clinics);
  return { success: true };
}
