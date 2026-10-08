import { doctorRepository } from "../repositories/doctor.repository";
import { doctorSchema } from "../schemas/doctor.schema";
import type { Doctor } from "../types/doctor.type";

export async function getDoctors(): Promise<readonly Doctor[]> {
  try {
    return doctorSchema.array().parse(await doctorRepository.findAll());
  } catch {
    return [];
  }
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  try {
    const doctor = await doctorRepository.findBySlug(slug);
    return doctor ? doctorSchema.parse(doctor) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedDoctors(): Promise<readonly Doctor[]> {
  return (await getDoctors()).filter((doctor) => doctor.featured);
}
