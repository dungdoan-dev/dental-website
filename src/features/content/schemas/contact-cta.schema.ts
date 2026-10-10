import { z } from "zod";

const optionalWebUrl = z.string().trim().refine(
  (value) => value === "" || /^https:\/\//i.test(value),
  "Liên kết phải để trống hoặc bắt đầu bằng https://",
);

const contactCtaDataSchema = z.object({
  showPhone: z.boolean(),
  facebookUrl: optionalWebUrl.default(""),
  zaloLinks: z.record(z.string(), optionalWebUrl).default({}),
  viberUrl: optionalWebUrl.default(""),
  whatsappUrl: optionalWebUrl.default(""),
});

export const contactCtaSchema = z.preprocess((input: unknown) => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return input;
  const stored = input as Record<string, unknown>;
  const firstLink = (key: string) => {
    const links = stored[key];
    return links && typeof links === "object" && !Array.isArray(links)
      ? Object.values(links).find((value) => typeof value === "string") ?? ""
      : "";
  };
  return {
    ...stored,
    zaloLinks: stored.zaloLinks && typeof stored.zaloLinks === "object" && !Array.isArray(stored.zaloLinks)
      ? stored.zaloLinks
      : typeof stored.zaloUrl === "string" ? { "clinic-1": stored.zaloUrl } : typeof stored.zaloLinks === "undefined" ? {} : { "clinic-1": firstLink("zaloLinks") },
    viberUrl: typeof stored.viberUrl === "string" ? stored.viberUrl : firstLink("viberLinks"),
    whatsappUrl: typeof stored.whatsappUrl === "string" ? stored.whatsappUrl : firstLink("whatsappLinks"),
  };
}, contactCtaDataSchema);

export type ContactCtaSettings = z.infer<typeof contactCtaSchema>;

export const defaultContactCtaSettings: ContactCtaSettings = {
  showPhone: true,
  facebookUrl: "",
  zaloLinks: {},
  viberUrl: "",
  whatsappUrl: "",
};
