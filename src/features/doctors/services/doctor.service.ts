import { doctorRepository } from "../repositories/doctor.repository";
import { doctorSchema } from "../schemas/doctor.schema";
import type { Doctor } from "../types/doctor.type";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";

const getCachedDoctors = cachePublicData("doctors:list", [publicDataTags.doctors], () => doctorRepository.findAll());
const getCachedDoctorBySlug = cachePublicData("doctors:by-slug", [publicDataTags.doctors], (slug: string) => doctorRepository.findBySlug(slug));

export async function getDoctors(): Promise<readonly Doctor[]> {
  try {
    return doctorSchema.array().parse(await getCachedDoctors());
  } catch {
    return [];
  }
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  try {
    const doctor = await getCachedDoctorBySlug(slug);
    return doctor ? doctorSchema.parse(doctor) : null;
  } catch {
    return null;
  }
}
