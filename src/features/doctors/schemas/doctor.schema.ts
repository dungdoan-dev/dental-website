import { z } from "zod";

export const doctorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  avatar: z.string(),
  position: z.string().min(1),
  specialty: z.string().min(1),
  experience: z.number().int().nonnegative(),
  sortOrder: z.number().int().nonnegative(),
  nameLines: z.union([z.literal(1), z.literal(2)]).default(1),
  nameLine2: z.string().default(""),
  description: z.string().min(1),
  badge: z.string().min(1),
  highlight: z.string().min(1),
  category: z.enum(["implant", "ortho", "aesthetic", "surgery", "pediatric"]),
  directoryTitle: z.string().min(1),
  profile: z.object({
    licenseNumber: z.string(),
    quote: z.string(),
    specialties: z.array(z.string().min(1)),
    languages: z.array(z.string().min(1)),
    education: z.array(z.string().min(1)),
    experienceHighlights: z.array(z.string().min(1)),
    certificates: z.array(z.object({
      title: z.string().min(1),
      issuer: z.string().min(1),
      detail: z.string().min(1),
      image: z.string().min(1),
    })),
    sourceUrl: z.union([z.literal(""), z.url()]),
  }).optional(),
});
