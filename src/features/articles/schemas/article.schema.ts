import { z } from "zod";

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  thumbnail: z.string(),
  publishedAt: z.iso.datetime(),
  author: z.string().min(1),
  category: z.enum(["implant", "veneer", "orthodontics", "kids", "periodontics", "general"]),
  readingMinutes: z.number().int().positive(),
  featured: z.boolean(),
});
