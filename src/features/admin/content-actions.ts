"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "./auth/admin-auth";
import { contactCtaSchema } from "@/features/content/schemas/contact-cta.schema";
import { aboutPageSchema } from "@/features/about/schemas/about.schema";
import { implantDetailSchema } from "@/features/services/schemas/implant-detail.schema";
import { serviceDetailSchema, serviceDetailContentKey } from "@/features/services/schemas/service-detail.schema";
import type { MutationResult } from "./services/mutation";
import { validationFailure } from "./services/mutation";
import { imagePathSchema } from "./schemas/admin.schema";
import { publicDataTags } from "@/lib/public-data-cache";

type State = MutationResult | null;
type ListRow = Record<string, string>;

function readRowList(formData: FormData, name: string, keys: readonly string[]): ListRow[] {
  const raw = String(formData.get(name) ?? "[]");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length > 50) throw new Error(`Danh sách ${name} không hợp lệ.`);
  return parsed.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`Mục trong ${name} không hợp lệ.`);
    return Object.fromEntries(keys.map((key) => [key, typeof (item as Record<string, unknown>)[key] === "string" ? (item as Record<string, string>)[key].trim() : ""]));
  });
}

function readStringList(formData: FormData, name: string): string[] {
  return readRowList(formData, name, ["value"]).map((row) => row.value);
}

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

async function saveSiteRecord(key: string, title: string, content: unknown) {
  await db.$transaction(async (tx) => {
    await tx.siteContent.upsert({ where: { key }, create: { key, content: content as Prisma.InputJsonValue }, update: { content: content as Prisma.InputJsonValue } });
    await tx.adminContentRevision.create({ data: { kind: "site-content", entityId: key, title, snapshot: content as Prisma.InputJsonValue, actor: process.env.ADMIN_USERNAME?.trim() || "admin" } });
  });
  updateTag(publicDataTags.siteContent);
}

export async function updateStructuredSiteContent(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  const key = readField(formData, "key");
  let content: unknown;
  let title = "";

  try {
    if (key === "home_why_choose") {
      const parsed = z.object({ image: imagePathSchema }).safeParse({ image: readField(formData, "image") });
      if (!parsed.success) return validationFailure(parsed.error);
      content = parsed.data;
      title = "Hình ảnh mục lý do lựa chọn";
    } else if (key === "about_page") {
      const highlights = readRowList(formData, "highlights", ["value", "label"]);
      const principles = readRowList(formData, "principles", ["number", "title", "description"]);
      content = {
        hero: { eyebrow: readField(formData, "heroEyebrow"), title: readField(formData, "heroTitle"), description: readField(formData, "heroDescription"), image: readField(formData, "heroImage") },
        highlights,
        story: { eyebrow: readField(formData, "storyEyebrow"), title: readField(formData, "storyTitle"), paragraphs: readStringList(formData, "storyParagraphs"), founderName: readField(formData, "founderName"), founderRole: readField(formData, "founderRole"), image: readField(formData, "storyImage") },
        visionMission: { eyebrow: readField(formData, "visionEyebrow"), title: readField(formData, "visionTitle"), introduction: readField(formData, "visionIntroduction"), vision: readField(formData, "vision"), mission: readField(formData, "mission") },
        principles: { eyebrow: readField(formData, "principlesEyebrow"), title: readField(formData, "principlesTitle"), introduction: readField(formData, "principlesIntroduction"), items: principles },
        expertise: { eyebrow: readField(formData, "expertiseEyebrow"), title: readField(formData, "expertiseTitle"), description: readField(formData, "expertiseDescription"), commitments: readStringList(formData, "commitments"), image: readField(formData, "expertiseImage") },
        clinics: { eyebrow: readField(formData, "clinicsEyebrow"), title: readField(formData, "clinicsTitle"), description: readField(formData, "clinicsDescription") },
      };
      const parsed = aboutPageSchema.safeParse(content);
      if (!parsed.success) return validationFailure(parsed.error);
      content = parsed.data;
      title = "Nội dung trang giới thiệu";
    } else if (key === "implant_detail") {
      content = {
        priceSourceUrl: readField(formData, "priceSourceUrl"),
        prices: readRowList(formData, "prices", ["name", "detail", "price"]),
        steps: readRowList(formData, "steps", ["number", "title", "description"]),
        faqs: readRowList(formData, "faqs", ["question", "answer"]),
      };
      const parsed = implantDetailSchema.safeParse(content);
      if (!parsed.success) return validationFailure(parsed.error);
      content = parsed.data;
      title = "Chi tiết dịch vụ Implant";
    } else {
      return { success: false, error: "Mục nội dung không được hỗ trợ." };
    }
    await saveSiteRecord(key, title, content);
  } catch {
    return { success: false, error: "Không thể lưu nội dung. Hãy kiểm tra các trường bắt buộc và thử lại." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/gioi-thieu");
  revalidatePath("/dich-vu/trong-rang-implant");
  return { success: true };
}

export async function updateServiceDetail(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  try {
    const serviceId = readField(formData, "serviceId");
    const service = await db.service.findUnique({ where: { id: serviceId }, select: { id: true, name: true, slug: true } });
    if (!service) return { success: false, error: "Không tìm thấy dịch vụ cần cập nhật." };

    const parsed = serviceDetailSchema.safeParse({
      eyebrow: readField(formData, "eyebrow"),
      title: readField(formData, "title"),
      introduction: readField(formData, "introduction"),
      highlights: readStringList(formData, "highlights"),
      priceSourceUrl: readField(formData, "priceSourceUrl"),
      prices: readRowList(formData, "prices", ["name", "detail", "price"]),
      steps: readRowList(formData, "steps", ["number", "title", "description"]),
      faqs: readRowList(formData, "faqs", ["question", "answer"]),
    });
    if (!parsed.success) return validationFailure(parsed.error);

    const key = serviceDetailContentKey(service.id);
    await saveSiteRecord(key, `Chi tiết dịch vụ: ${service.name}`, parsed.data);
    revalidatePath("/admin/services");
    revalidatePath(`/dich-vu/${service.slug}`);
    revalidatePath("/dich-vu");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể lưu chi tiết dịch vụ. Vui lòng kiểm tra thông tin và thử lại." };
  }
}

const insuranceSchema = z.object({
  code: z.string().trim().min(1).max(40), name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000), accent: z.enum(["blue", "green"]),
  logoSrc: z.union([z.literal(""), z.string().trim().startsWith("/images/").max(500)]),
  sortOrder: z.number().int().min(0).max(9999),
});

export async function updateInsurancePartner(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  const parsed = insuranceSchema.safeParse({ code: formData.get("code"), name: formData.get("name"), description: formData.get("description"), accent: formData.get("accent"), logoSrc: formData.get("logoSrc"), sortOrder: Number(formData.get("sortOrder") ?? 0) });
  if (!parsed.success) return validationFailure(parsed.error);
  try {
    const data = parsed.data;
    const count = await db.$executeRaw`UPDATE insurance_partners SET name = ${data.name}, description = ${data.description}, accent = ${data.accent}, logo_src = ${data.logoSrc || null}, sort_order = ${data.sortOrder} WHERE code = ${data.code}`;
    if (!count) return { success: false, error: "Không tìm thấy đối tác bảo hiểm này." };
  } catch { return { success: false, error: "Không thể lưu thông tin bảo hiểm. Vui lòng thử lại." }; }
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  updateTag(publicDataTags.insurancePartners);
  return { success: true };
}

export async function updateContactCta(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  try {
    const clinics = await db.clinic.findMany({ select: { id: true } });
    const settings = contactCtaSchema.safeParse({
      showPhone: formData.get("showPhone") === "on",
      facebookUrl: readField(formData, "facebookUrl"),
      zaloLinks: Object.fromEntries(clinics.map((clinic) => [clinic.id, readField(formData, `zaloUrl-${clinic.id}`)])),
    });
    if (!settings.success) return validationFailure(settings.error);
    await saveSiteRecord("contact_cta", "CTA liên hệ", settings.data);
  } catch { return { success: false, error: "Không thể lưu CTA liên hệ. Vui lòng kiểm tra các liên kết." }; }
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/");
  return { success: true };
}
