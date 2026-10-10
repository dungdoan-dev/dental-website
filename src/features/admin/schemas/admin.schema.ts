import { z } from "zod";

const text = (max: number) => z.string().trim().min(1, "Trường này không được để trống.").max(max, `Tối đa ${max} ký tự.`);
const optionalText = (max: number) => z.string().trim().max(max);
export const recordIdSchema = text(100).regex(/^[a-zA-Z0-9_-]+$/, "Mã chỉ gồm chữ, số, dấu - hoặc _.");
export const numericIdSchema = z.string().regex(/^[1-9]\d{0,18}$/, "Mã bản ghi không hợp lệ.").refine((value) => BigInt(value) <= BigInt("9223372036854775807"));
export const slugSchema = text(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường không dấu, số và dấu -.");
export const webUrlSchema = z.string().trim().max(2000).refine((value) => {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; }
  catch { return false; }
}, "URL phải bắt đầu bằng http:// hoặc https://.");
export const imagePathSchema = z.union([
  z.string().trim().max(2000).regex(/^\/(?!\/)(?!.*(?:\.\.|[\s\\?#])).+$/, "Đường dẫn ảnh nội bộ phải bắt đầu bằng / và không chứa .. hoặc khoảng trắng."),
  webUrlSchema,
]);
export const appointmentStatusSchema = z.enum(["pending", "confirmed", "completed", "cancelled"]);
export const serviceFormSchema = z.object({
  id: recordIdSchema, name: text(200), slug: slugSchema,
  shortDescription: text(2000), description: text(50000), image: imagePathSchema,
  badge: optionalText(120), badgeVariant: z.enum(["blue", "green"]), featured: z.boolean(),
  category: z.enum(["pediatric", "general", "aesthetic", "orthodontics", "implant", "periodontics", "other"]),
});
export const serviceSortOrderSchema = z.object({
  id: recordIdSchema,
  sortOrder: z.number().int().min(0).max(99999),
});
const list = z.array(text(2000)).max(50);
export const doctorFormSchema = z.object({
  id: recordIdSchema, name: text(200), slug: slugSchema, avatar: imagePathSchema,
  position: text(200), specialty: text(200), experience: z.number().int().min(0).max(80),
  sortOrder: z.number().int().min(0).max(99999),
  nameLines: z.union([z.literal(1), z.literal(2)]).default(1),
  nameLine2: optionalText(160).optional(),
  description: text(10000), badge: optionalText(120), highlight: optionalText(300),
  category: z.enum(["implant", "ortho", "aesthetic", "surgery", "pediatric"]),
  directoryTitle: optionalText(200), licenseNumber: optionalText(120).optional(), quote: optionalText(2000).optional(),
  languages: list.optional(), specialties: list.optional(), education: list.optional(), experienceHighlights: list.optional(),
  sourceUrl: z.union([z.literal(""), webUrlSchema]).optional(),
  certificates: z.array(z.object({ title: text(200), issuer: text(200), detail: optionalText(2000), image: imagePathSchema })).max(50).optional(),
}).superRefine((data, context) => {
  if (data.nameLines === 2 && !data.nameLine2?.trim()) {
    context.addIssue({ code: "custom", path: ["nameLine2"], message: "Vui lòng nhập nội dung dòng 2 của tên hiển thị." });
  }
});
export const doctorSortOrderSchema = z.object({
  id: recordIdSchema,
  sortOrder: z.number().int().min(0).max(99999),
});
export const articleFormSchema = z.object({
  id: recordIdSchema, title: text(240), slug: slugSchema, excerpt: text(2000), content: text(100000),
  thumbnail: imagePathSchema, author: text(200), category: z.enum(["implant", "veneer", "orthodontics", "kids", "periodontics", "general"]),
  readingMinutes: z.number().int().min(1).max(240), featured: z.boolean(), status: z.enum(["draft", "published"]),
});

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
});
export const appointmentQuerySchema = z.object({
  status: z.union([appointmentStatusSchema, z.literal("")]).optional().catch(undefined),
  q: z.string().trim().max(100).optional().catch(undefined),
  clinicId: recordIdSchema.optional().catch(undefined),
  date: dateOnly.optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(100000).default(1).catch(1),
});

export const articleListQuerySchema = z.object({
  status: z.enum(["draft", "published", "all"]).default("all").catch("all"),
  page: z.coerce.number().int().min(1).max(100000).default(1).catch(1),
});
