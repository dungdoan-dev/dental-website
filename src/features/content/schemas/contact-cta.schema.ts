import { z } from "zod";

const optionalWebUrl = z.string().trim().refine(
  (value) => value === "" || /^https:\/\//i.test(value),
  "Liên kết phải để trống hoặc bắt đầu bằng https://",
);

const contactCtaDataSchema = z.object({
  showPhone: z.boolean(),
  facebookUrl: optionalWebUrl.default(""),
  zaloLinks: z.record(z.string(), optionalWebUrl).default({}),
});

export const contactCtaSchema = z.preprocess((input: unknown) => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return input;
  const stored = input as Record<string, unknown>;
  if (stored.zaloLinks !== undefined || typeof stored.zaloUrl !== "string") return input;
  const { zaloUrl, ...rest } = stored;
  return { ...rest, zaloLinks: { "clinic-1": zaloUrl } };
}, contactCtaDataSchema);

export type ContactCtaSettings = z.infer<typeof contactCtaSchema>;

export const defaultContactCtaSettings: ContactCtaSettings = {
  showPhone: true,
  facebookUrl: "",
  zaloLinks: {},
};
