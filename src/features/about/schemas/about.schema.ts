import { z } from "zod";

// One photo: the path or uploaded URL plus the caption, which is also used as alt text.
export const aboutPhotoSchema = z.object({ src: z.string(), caption: z.string() });
const titled = z.object({ title: z.string(), text: z.string() });
const photoTitled = titled.extend({ photo: aboutPhotoSchema });

/** Stored in site_content under "about_page"; drives every page under /gioi-thieu. */
export const aboutPageSchema = z.object({
  hero: z.object({ title: z.string(), description: z.string(), photo: aboutPhotoSchema }),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })),
  founder: z.object({
    name: z.string(), role: z.string(), photo: aboutPhotoSchema,
    paragraphs: z.array(z.string()), credentials: z.array(z.string()), traits: z.array(z.string()),
  }),
  history: z.object({
    title: z.string(), intro: z.string(),
    milestones: z.array(z.object({ date: z.string(), tag: z.string(), title: z.string(), stat: z.string(), text: z.string(), photos: z.array(aboutPhotoSchema) })),
    archive: z.array(aboutPhotoSchema),
  }),
  facilities: z.object({ title: z.string(), rooms: z.array(photoTitled), equipment: z.array(photoTitled) }),
  license: z.object({ photo: aboutPhotoSchema, companyInfo: z.array(z.object({ label: z.string(), value: z.string() })) }),
  insurance: z.object({ steps: z.array(titled), benefits: z.array(titled) }),
  activities: z.object({
    featured: z.object({ title: z.string(), description: z.string(), photos: z.array(aboutPhotoSchema) }),
    items: z.array(z.object({ category: z.string(), title: z.string(), description: z.string(), photos: z.array(aboutPhotoSchema) })),
  }),
});

export type AboutPhoto = z.infer<typeof aboutPhotoSchema>;
export type AboutPageData = z.infer<typeof aboutPageSchema>;
