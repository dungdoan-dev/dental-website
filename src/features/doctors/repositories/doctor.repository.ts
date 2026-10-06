import { doctorMockData } from "../data/doctor.mock";
import type { Doctor } from "../types/doctor.type";

export const doctorRepository = {
  async findAll(): Promise<readonly Doctor[]> {
    return doctorMockData;
  },
  async findBySlug(slug: string): Promise<Doctor | null> {
    return doctorMockData.find((doctor) => doctor.slug === slug) ?? null;
  },
};
