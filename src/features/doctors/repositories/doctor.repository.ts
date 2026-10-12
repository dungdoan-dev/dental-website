import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { Doctor, DoctorCategory } from "../types/doctor.type";

function mapDoctor(d: {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  position: string;
  specialty: string;
  experience: number;
  sort_order: number;
  name_lines: number;
  name_line_2: string | null;
  description: string;
  badge: string;
  highlight: string;
  category: string;
  directory_title: string;
  license_number: string | null;
  quote: string | null;
  languages: unknown;
  source_url: string | null;
  doctor_specialties?: { specialty: string; sort_order?: number }[];
  doctor_experience_highlights?: { content: string; sort_order?: number }[];
  doctor_certificates?: { title: string; issuer: string; detail: string; image: string; sort_order?: number }[];
  doctor_education?: { content: string; sort_order?: number }[];
}): Doctor {
  const hasProfile = Boolean(d.license_number || d.quote || d.source_url || d.doctor_specialties?.length || d.doctor_education?.length || d.doctor_experience_highlights?.length || d.doctor_certificates?.length);
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
    sortOrder: d.sort_order,
    nameLines: (d.name_lines === 2 ? 2 : 1),
    nameLine2: d.name_line_2 ?? "",
    description: d.description,
    badge: d.badge,
    highlight: d.highlight,
    category: d.category as DoctorCategory,
    directoryTitle: d.directory_title,
    profile: hasProfile
      ? {
          licenseNumber: d.license_number!,
          quote: d.quote ?? "",
          specialties: d.doctor_specialties?.map((s) => s.specialty) ?? [],
          languages,
          education: d.doctor_education?.map((e) => e.content) ?? [],
          experienceHighlights: d.doctor_experience_highlights?.map((e) => e.content) ?? [],
          certificates:
            d.doctor_certificates?.map((c) => ({
              title: c.title,
              issuer: c.issuer,
              detail: c.detail,
              image: c.image,
            })) ?? [],
          sourceUrl: d.source_url ?? "",
        }
      : undefined,
  };
}

export const doctorRepository = {
  async findAll(): Promise<readonly Doctor[]> {
    const { data: doctors, error } = await getPublicSupabaseClient().from("doctors").select(
      "*, doctor_specialties(specialty,sort_order), doctor_education(content,sort_order), doctor_experience_highlights(content,sort_order), doctor_certificates(title,issuer,detail,image,sort_order)",
    ).order("sort_order").order("id");
    if (error) throw error;

    return doctors.map((doctor) => mapDoctor({
      ...doctor,
      doctor_specialties: doctor.doctor_specialties?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_education: doctor.doctor_education?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_experience_highlights: doctor.doctor_experience_highlights?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_certificates: doctor.doctor_certificates?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    }));
  },

  async findBySlug(slug: string): Promise<Doctor | null> {
    const { data: doctor, error } = await getPublicSupabaseClient().from("doctors").select(
      "*, doctor_specialties(specialty,sort_order), doctor_education(content,sort_order), doctor_experience_highlights(content,sort_order), doctor_certificates(title,issuer,detail,image,sort_order)",
    ).eq("slug", slug).maybeSingle();
    if (error) throw error;

    return doctor ? mapDoctor({
      ...doctor,
      doctor_specialties: doctor.doctor_specialties?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_education: doctor.doctor_education?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_experience_highlights: doctor.doctor_experience_highlights?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
      doctor_certificates: doctor.doctor_certificates?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    }) : null;
  },
};
