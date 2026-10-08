import { db } from "@/lib/db";
import type { DentalService, ServiceCategory } from "../types/service.type";

export const serviceRepository = {
  async findAll(): Promise<readonly DentalService[]> {
    const services = await db.service.findMany({
      orderBy: { id: "asc" },
    });

    return services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      description: s.description,
      image: s.image,
      badge: s.badge,
      badgeVariant: s.badgeVariant as "blue" | "green",
      featured: s.featured,
      category: s.category as ServiceCategory,
    }));
  },

  async findBySlug(slug: string): Promise<DentalService | null> {
    const s = await db.service.findUnique({
      where: { slug },
    });

    if (!s) return null;

    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      description: s.description,
      image: s.image,
      badge: s.badge,
      badgeVariant: s.badgeVariant as "blue" | "green",
      featured: s.featured,
      category: s.category as ServiceCategory,
    };
  },
};
