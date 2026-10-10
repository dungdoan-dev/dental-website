import { z } from "zod";
import { serviceGroups } from "../data/service-filter.data";

const categories = serviceGroups.map((group) => group.value) as [string, ...string[]];

export const servicePriceCategoriesSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500),
  rows: z.array(z.object({
    category: z.enum(categories),
    label: z.string().trim().min(1).max(160),
    price: z.string().trim().max(200),
  })).max(20),
});

export type ServicePriceCategories = z.infer<typeof servicePriceCategoriesSchema>;
