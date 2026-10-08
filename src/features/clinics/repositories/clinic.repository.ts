import { db } from "@/lib/db";
import type { Clinic } from "../types/clinic.type";

export const clinicRepository = {
  async findAll(): Promise<readonly Clinic[]> {
    const clinics = await db.clinic.findMany({
      include: {
        facilities: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    return clinics.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      label: c.label,
      badge: c.badge,
      address: c.address,
      phone: c.phone,
      image: c.image,
      description: c.description,
      workingHours: c.workingHours,
      facilities: c.facilities.map((f) => f.name),
      googleMapsUrl: c.googleMapsUrl ?? undefined,
      accent: c.accent as "blue" | "green",
    }));
  },
};
