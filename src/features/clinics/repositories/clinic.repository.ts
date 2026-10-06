import { clinicMockData } from "../data/clinic.mock";
import type { Clinic } from "../types/clinic.type";

export const clinicRepository = {
  async findAll(): Promise<readonly Clinic[]> { return clinicMockData; },
};
