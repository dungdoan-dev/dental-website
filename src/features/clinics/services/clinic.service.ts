import { siteConfig } from "@/config/site";
import { clinicRepository } from "../repositories/clinic.repository";
import type { Clinic, ClinicSummary } from "../types/clinic.type";

export function getClinicSummary(): ClinicSummary {
  return { name: siteConfig.name, description: siteConfig.description, address: siteConfig.contact.address };
}

export async function getClinics(): Promise<readonly Clinic[]> {
  try {
    return await clinicRepository.findAll();
  } catch {
    return [];
  }
}
