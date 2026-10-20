"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "./auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { contactCtaSchema } from "@/features/content/schemas/contact-cta.schema";
import { aboutPageSchema } from "@/features/about/schemas/about.schema";
import { implantDetailSchema } from "@/features/services/schemas/implant-detail.schema";
import { serviceDetailSchema } from "@/features/services/schemas/service-detail.schema";
import { directoryHeroPages, directoryHeroSchema } from "@/features/content/schemas/directory-hero.schema";
import { servicePriceCategoriesSchema } from "@/features/services/schemas/service-price-categories.schema";
import type { MutationResult } from "./services/mutation";
import { validationFailure } from "./services/mutation";
import { imagePathSchema } from "./schemas/admin.schema";
import { publicDataTags } from "@/lib/public-data-cache";
import { saveContent } from "./services/mutation";

type State = MutationResult | null;
type ListRow = Record<string, string>;

function readRowList(formData: FormData, name: string, keys: readonly string[]): ListRow[] {
  const raw = formData.get(name);
  // A missing field must not be read as an empty list, or saving would wipe the stored rows.
  if (typeof raw !== "string") throw new Error(`Thiếu danh sách ${name}.`);
  const parsed: unknown = JSON.parse(raw);
  // Per-list limits (e.g. 100 price rows) are enforced by each content schema; this only stops runaway input.
  if (!Array.isArray(parsed) || parsed.length > 500) throw new Error(`Danh sách ${name} không hợp lệ.`);
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
  await saveContent("site-content", { key, content }, title, content);
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
      const images = z.object({
        heroImage: imagePathSchema,
        storyImage: imagePathSchema,
        expertiseImage: imagePathSchema,
      }).safeParse({
        heroImage: readField(formData, "heroImage"),
        storyImage: readField(formData, "storyImage"),
        expertiseImage: readField(formData, "expertiseImage"),
      });
      if (!images.success) return validationFailure(images.error);
      const highlights = readRowList(formData, "highlights", ["value", "label"]);
      const principles = readRowList(formData, "principles", ["number", "title", "description"]);
      content = {
        hero: { eyebrow: readField(formData, "heroEyebrow"), title: readField(formData, "heroTitle"), description: readField(formData, "heroDescription"), image: images.data.heroImage },
        highlights,
        story: { eyebrow: readField(formData, "storyEyebrow"), title: readField(formData, "storyTitle"), paragraphs: readStringList(formData, "storyParagraphs"), founderName: readField(formData, "founderName"), founderRole: readField(formData, "founderRole"), image: images.data.storyImage },
        visionMission: { eyebrow: readField(formData, "visionEyebrow"), title: readField(formData, "visionTitle"), introduction: readField(formData, "visionIntroduction"), vision: readField(formData, "vision"), mission: readField(formData, "mission") },
        principles: { eyebrow: readField(formData, "principlesEyebrow"), title: readField(formData, "principlesTitle"), introduction: readField(formData, "principlesIntroduction"), items: principles },
        expertise: { eyebrow: readField(formData, "expertiseEyebrow"), title: readField(formData, "expertiseTitle"), description: readField(formData, "expertiseDescription"), commitments: readStringList(formData, "commitments"), image: images.data.expertiseImage },
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

    const image = imagePathSchema.safeParse(formData.get("image"));
    if (!image.success) return validationFailure(image.error);

    const saved = await saveContent("service-detail", { serviceId, image: image.data, content: parsed.data }, "Chi tiết dịch vụ", parsed.data);
    updateTag(publicDataTags.siteContent);
    updateTag(publicDataTags.services);
    revalidatePath("/admin/services");
    revalidatePath(`/dich-vu/${saved.slug}`);
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
  logoSrc: z.union([z.literal(""), imagePathSchema]),
  sortOrder: z.number().int().min(0).max(9999),
});

export async function updateInsurancePartner(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  const parsed = insuranceSchema.safeParse({ code: formData.get("code"), name: formData.get("name"), description: formData.get("description"), accent: formData.get("accent"), logoSrc: formData.get("logoSrc"), sortOrder: Number(formData.get("sortOrder") ?? 0) });
  if (!parsed.success) return validationFailure(parsed.error);
  try {
    const data = parsed.data;
    const { data: updated, error } = await (await getSupabaseServerClient()).from("insurance_partners").update({
      name: data.name, description: data.description, accent: data.accent,
      logo_src: data.logoSrc || null, sort_order: data.sortOrder,
    }).eq("code", data.code).select("code");
    if (error) throw error;
    if (!updated?.length) return { success: false, error: "Không tìm thấy đối tác bảo hiểm này." };
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
    const { data: clinics, error } = await (await getSupabaseServerClient()).from("clinics").select("id");
    if (error) throw error;
    const settings = contactCtaSchema.safeParse({
      showPhone: formData.get("showPhone") === "on",
      facebookUrl: readField(formData, "facebookUrl"),
      zaloLinks: Object.fromEntries(clinics.map((clinic) => [clinic.id, readField(formData, `zaloUrl-${clinic.id}`)])),
      viberUrl: readField(formData, "viberUrl"),
      whatsappUrl: readField(formData, "whatsappUrl"),
    });
    if (!settings.success) return validationFailure(settings.error);
    // The call button dials each clinic's own phone, so the numbers are edited here but stored on the clinic.
    const phones = z.array(z.string().trim().min(1, "Số điện thoại không được để trống").max(100)).safeParse(clinics.map((clinic) => readField(formData, `phone-${clinic.id}`)));
    if (!phones.success) return validationFailure(phones.error);
    await saveContent("contact-cta", {
      key: "contact_cta", content: settings.data,
      phones: clinics.map((clinic, index) => ({ id: clinic.id, phone: phones.data[index] })),
    }, "CTA liên hệ", settings.data);
    updateTag(publicDataTags.clinics);
    updateTag(publicDataTags.siteContent);
  } catch { return { success: false, error: "Không thể lưu CTA liên hệ. Vui lòng kiểm tra các liên kết." }; }
  revalidatePath("/admin/clinics");
  revalidatePath("/lien-he");
  revalidatePath("/");
  return { success: true };
}

export async function updateDirectoryHero(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  const page = readField(formData, "page");
  if (!Object.hasOwn(directoryHeroPages, page)) return { success: false, error: "Trang không hợp lệ." };
  const { key, label, path } = directoryHeroPages[page as keyof typeof directoryHeroPages];
  const parsed = directoryHeroSchema.safeParse({ title: readField(formData, "title"), description: readField(formData, "description") });
  if (!parsed.success) return validationFailure(parsed.error);
  try {
    await saveSiteRecord(key, label, parsed.data);
  } catch {
    return { success: false, error: "Không thể lưu tiêu đề trang. Vui lòng thử lại." };
  }
  revalidatePath(path);
  return { success: true };
}

export async function updateServicePriceCategories(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  try {
    const rows = readRowList(formData, "rows", ["category", "label", "price"]);
    const parsed = servicePriceCategoriesSchema.safeParse({ title: readField(formData, "title"), description: readField(formData, "description"), rows });
    if (!parsed.success) return validationFailure(parsed.error);
    await saveSiteRecord("service_price_categories", "Bảng giá theo danh mục kỹ thuật", parsed.data);
  } catch {
    return { success: false, error: "Không thể lưu bảng giá danh mục. Vui lòng kiểm tra lại nội dung." };
  }
  revalidatePath("/bang-gia");
  revalidatePath("/dich-vu");
  revalidatePath("/");
  return { success: true };
}

const homeCopyKeys = ["services", "doctors", "whyChoose", "clinics", "insurance", "faq", "testimonials", "vision", "values"] as const;
const homeCopySchema = z.record(z.string(), z.object({ title: z.string().trim().min(1).max(160), note: z.string().trim().max(400) }));

export async function updateHomeSectionCopy(_previous: State, formData: FormData): Promise<MutationResult> {
  await requireAdmin();
  const candidate = Object.fromEntries(homeCopyKeys.map((key) => [key, {
    title: formData.get(`${key}Title`),
    note: formData.get(`${key}Note`),
  }]));
  const parsed = homeCopySchema.safeParse(candidate);
  if (!parsed.success) return validationFailure(parsed.error);
  try {
    await saveSiteRecord("home_section_copy", "Tiêu đề và ghi chú các mục trang chủ", parsed.data);
  } catch {
    return { success: false, error: "Không thể lưu nội dung tiêu đề trang chủ. Vui lòng thử lại." };
  }
  revalidatePath("/");
  revalidatePath("/admin/home");
  return { success: true };
}
