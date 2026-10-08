import { serviceRepository } from "../repositories/service.repository";
import { getSiteContent } from "@/features/content/services/site-content.service";
import { implantDetailSchema, type ImplantDetailData } from "../schemas/implant-detail.schema";
import { serviceDetailContentKey, serviceDetailSchema, type ServiceDetailData } from "../schemas/service-detail.schema";
import { serviceSchema } from "../schemas/service.schema";
import type { DentalService } from "../types/service.type";

export async function getServices(): Promise<readonly DentalService[]> {
  try {
    const services = await serviceRepository.findAll();
    return serviceSchema.array().parse(services);
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<DentalService | null> {
  try {
    const service = await serviceRepository.findBySlug(slug);
    return service ? serviceSchema.parse(service) : null;
  } catch {
    return null;
  }
}

export async function getFeaturedServices(): Promise<readonly DentalService[]> {
  return (await getServices()).filter((service) => service.featured);
}

export async function getImplantDetailData(): Promise<ImplantDetailData | null> {
  try {
    return await getSiteContent("implant_detail", implantDetailSchema);
  } catch {
    return null;
  }
}

export async function getServiceDetailData(serviceId: string): Promise<ServiceDetailData | null> {
  try {
    return await getSiteContent(serviceDetailContentKey(serviceId), serviceDetailSchema);
  } catch {
    return null;
  }
}
