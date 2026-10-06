import { serviceRepository } from "../repositories/service.repository";
import { serviceSchema } from "../schemas/service.schema";
import type { DentalService } from "../types/service.type";

export async function getServices(): Promise<readonly DentalService[]> {
  const services = await serviceRepository.findAll();
  return serviceSchema.array().parse(services);
}

export async function getServiceBySlug(slug: string): Promise<DentalService | null> {
  const service = await serviceRepository.findBySlug(slug);
  return service ? serviceSchema.parse(service) : null;
}

export async function getFeaturedServices(): Promise<readonly DentalService[]> {
  return (await getServices()).filter((service) => service.featured);
}
