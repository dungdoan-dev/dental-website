import { serviceMockData } from "../data/service.mock";
import type { DentalService } from "../types/service.type";

export const serviceRepository = {
  async findAll(): Promise<readonly DentalService[]> {
    return serviceMockData;
  },

  async findBySlug(slug: string): Promise<DentalService | null> {
    return serviceMockData.find((service) => service.slug === slug) ?? null;
  },
};
