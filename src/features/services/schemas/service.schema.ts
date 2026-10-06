import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  badge: z.string().min(1),
  badgeVariant: z.enum(["blue", "green"]),
  featured: z.boolean(),
  category: z.enum(["implant", "aesthetic", "orthodontics", "general", "surgery"]),
});
