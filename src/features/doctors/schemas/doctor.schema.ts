import { z } from "zod";

export const doctorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  avatar: z.string(),
  position: z.string(),
  experience: z.number().int().nonnegative(),
  sortOrder: z.number().int().nonnegative(),
  degree: z.string().default(""),
  description: z.string().min(1),
  badge: z.string(),
  highlight: z.string(),
  category: z.enum(["implant", "ortho", "aesthetic", "surgery", "pediatric"]),
  directoryTitle: z.string(),
  profile: z.object({
    licenseNumber: z.string(),
    quote: z.string(),
    specialties: z.array(z.string().min(1)),
    languages: z.array(z.string().min(1)),
    education: z.array(z.string().min(1)),
    experienceHighlights: z.array(z.string().min(1)),
    certificates: z.array(z.object({
      title: z.string().min(1),
      issuer: z.string(),
      detail: z.string(),
      image: z.string().min(1),
    })),
    sourceUrl: z.union([z.literal(""), z.url()]),
  }).optional(),
});
