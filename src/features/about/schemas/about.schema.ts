import { z } from "zod";

export const aboutPageSchema = z.object({
  hero: z.object({ eyebrow: z.string(), title: z.string(), description: z.string(), image: z.string() }),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })),
  story: z.object({
    eyebrow: z.string(), title: z.string(), paragraphs: z.array(z.string()),
    founderName: z.string(), founderRole: z.string(), image: z.string(),
  }),
  visionMission: z.object({
    eyebrow: z.string(), title: z.string(), introduction: z.string(),
    vision: z.string(), mission: z.string(),
  }),
  principles: z.object({
    eyebrow: z.string(), title: z.string(), introduction: z.string(),
    items: z.array(z.object({ number: z.string(), title: z.string(), description: z.string() })),
  }),
  expertise: z.object({
    eyebrow: z.string(), title: z.string(), description: z.string(),
    commitments: z.array(z.string()), image: z.string(),
  }),
  clinics: z.object({ eyebrow: z.string(), title: z.string(), description: z.string() }),
});

export type AboutPageData = z.infer<typeof aboutPageSchema>;
