import { doctorRepository } from "../repositories/doctor.repository";
import { doctorSchema, doctorSummarySchema } from "../schemas/doctor.schema";
import type { Doctor, DoctorSummary } from "../types/doctor.type";
import { parseValidItems } from "@/lib/parse-list";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";

const getCachedDoctors = cachePublicData("doctors:summary-list", [publicDataTags.doctors], () => doctorRepository.findAll());
const getCachedDoctorBySlug = cachePublicData("doctors:by-slug", [publicDataTags.doctors], (slug: string) => doctorRepository.findBySlug(slug));

export async function getDoctors(): Promise<readonly DoctorSummary[]> {
  try {
    return parseValidItems(doctorSummarySchema, await getCachedDoctors(), "doctor.service");
  } catch (error) {
    console.error("[doctor.service] public data load failed", error);
    return [];
  }
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  try {
    const doctor = await getCachedDoctorBySlug(slug);
    return doctor ? doctorSchema.parse(doctor) : null;
  } catch (error) {
    console.error("[doctor.service] public data load failed", error);
    return null;
  }
}
