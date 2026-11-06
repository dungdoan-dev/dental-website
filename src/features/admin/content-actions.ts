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
      const photo = (src: string, caption: string) => ({ src: imagePathSchema.parse(src), caption });
      const photosOf = (row: Record<string, string>, count: number) => Array.from({ length: count }, (_, i) => row[`photo${i + 1}`] ? photo(row[`photo${i + 1}`], row[`caption${i + 1}`] ?? "") : null).filter((p) => p !== null);
      const photoKeys = (count: number) => Array.from({ length: count }, (_, i) => [`photo${i + 1}`, `caption${i + 1}`]).flat();
      const photoList = (name: string) => readRowList(formData, name, ["photo", "caption"]).filter((row) => row.photo).map((row) => photo(row.photo, row.caption));
      const titledPhotos = (name: string) => readRowList(formData, name, ["title", "text", "photo", "caption"]).filter((row) => row.photo).map((row) => ({ title: row.title, text: row.text, photo: photo(row.photo, row.caption) }));
      content = {
        hero: { title: readField(formData, "heroTitle"), description: readField(formData, "heroDescription"), photo: photo(readField(formData, "heroImage"), readField(formData, "heroCaption")) },
        highlights: readRowList(formData, "highlights", ["value", "label"]),
        founder: {
          name: readField(formData, "founderName"), role: readField(formData, "founderRole"),
          photo: photo(readField(formData, "founderImage"), readField(formData, "founderCaption")),
          paragraphs: readStringList(formData, "founderParagraphs").filter(Boolean),
          credentials: readStringList(formData, "founderCredentials").filter(Boolean),
          traits: readStringList(formData, "founderTraits").filter(Boolean),
        },
        history: {
          title: readField(formData, "historyTitle"), intro: readField(formData, "historyIntro"),
          milestones: readRowList(formData, "milestones", ["date", "tag", "title", "stat", "text", ...photoKeys(4)]).map((row) => ({ date: row.date, tag: row.tag, title: row.title, stat: row.stat, text: row.text, photos: photosOf(row, 4) })),
          archive: photoList("archive"),
        },
        facilities: { title: readField(formData, "facilitiesTitle"), rooms: titledPhotos("rooms"), equipment: titledPhotos("equipment") },
        license: { photo: photo(readField(formData, "licenseImage"), readField(formData, "licenseCaption")), companyInfo: readRowList(formData, "companyInfo", ["label", "value"]) },
        insurance: { steps: readRowList(formData, "insuranceSteps", ["title", "text"]), benefits: readRowList(formData, "insuranceBenefits", ["title", "text"]) },
        activities: {
          featured: { title: readField(formData, "featuredTitle"), description: readField(formData, "featuredDescription"), photos: photoList("featuredPhotos") },
          items: readRowList(formData, "activities", ["category", "title", "description", ...photoKeys(5)]).map((row) => ({ category: row.category, title: row.title, description: row.description, photos: photosOf(row, 5) })),
        },
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
  revalidatePath("/gioi-thieu", "layout");
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
