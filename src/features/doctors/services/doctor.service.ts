import { doctorRepository } from "../repositories/doctor.repository";
import { doctorSchema } from "../schemas/doctor.schema";
import type { Doctor } from "../types/doctor.type";

export async function getDoctors(): Promise<readonly Doctor[]> {
  return doctorSchema.array().parse(await doctorRepository.findAll());
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const doctor = await doctorRepository.findBySlug(slug);
  return doctor ? doctorSchema.parse(doctor) : null;
}

export async function getFeaturedDoctors(): Promise<readonly Doctor[]> {
  return (await getDoctors()).filter((doctor) => doctor.featured);
}
