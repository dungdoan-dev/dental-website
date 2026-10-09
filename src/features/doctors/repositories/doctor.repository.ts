import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { Doctor, DoctorCategory } from "../types/doctor.type";

function mapDoctor(d: {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  position: string;
  specialty: string;
  experience: number;
  sortOrder: number;
  description: string;
  badge: string;
  highlight: string;
  category: string;
  directoryTitle: string;
  licenseNumber: string | null;
  quote: string | null;
  languages: Prisma.JsonValue | null;
  sourceUrl: string | null;
  specialties?: { specialty: string }[];
  education?: { content: string }[];
  experienceHighlights?: { content: string }[];
  certificates?: { title: string; issuer: string; detail: string; image: string }[];
}): Doctor {
  const hasProfile = Boolean(d.licenseNumber || d.quote || d.sourceUrl || d.specialties?.length || d.education?.length || d.experienceHighlights?.length || d.certificates?.length);
  const languages = Array.isArray(d.languages)
    ? d.languages.filter((language): language is string => typeof language === "string")
    : typeof d.languages === "string"
      ? [d.languages]
      : [];

  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    avatar: d.avatar,
    position: d.position,
    specialty: d.specialty,
    experience: d.experience,
    sortOrder: d.sortOrder,
    description: d.description,
    badge: d.badge,
    highlight: d.highlight,
    category: d.category as DoctorCategory,
    directoryTitle: d.directoryTitle,
    profile: hasProfile
      ? {
          licenseNumber: d.licenseNumber!,
          quote: d.quote ?? "",
          specialties: d.specialties?.map((s) => s.specialty) ?? [],
          languages,
          education: d.education?.map((e) => e.content) ?? [],
          experienceHighlights: d.experienceHighlights?.map((e) => e.content) ?? [],
          certificates:
            d.certificates?.map((c) => ({
              title: c.title,
              issuer: c.issuer,
              detail: c.detail,
              image: c.image,
            })) ?? [],
          sourceUrl: d.sourceUrl ?? "",
        }
      : undefined,
  };
}

export const doctorRepository = {
  async findAll(): Promise<readonly Doctor[]> {
    const doctors = await db.doctor.findMany({
      include: {
        specialties: { orderBy: { sortOrder: "asc" } },
        education: { orderBy: { sortOrder: "asc" } },
        experienceHighlights: { orderBy: { sortOrder: "asc" } },
        certificates: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    return doctors.map(mapDoctor);
  },

  async findBySlug(slug: string): Promise<Doctor | null> {
    const doctor = await db.doctor.findUnique({
      where: { slug },
      include: {
        specialties: { orderBy: { sortOrder: "asc" } },
        education: { orderBy: { sortOrder: "asc" } },
        experienceHighlights: { orderBy: { sortOrder: "asc" } },
        certificates: { orderBy: { sortOrder: "asc" } },
      },
    });

    return doctor ? mapDoctor(doctor) : null;
  },
};
