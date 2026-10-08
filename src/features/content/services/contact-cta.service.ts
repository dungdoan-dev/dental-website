import { getSiteContent } from "./site-content.service";
import { contactCtaSchema, defaultContactCtaSettings } from "../schemas/contact-cta.schema";
import type { ContactCtaSettings } from "../schemas/contact-cta.schema";

export async function getContactCtaSettings(): Promise<ContactCtaSettings> {
  try {
    return await getSiteContent("contact_cta", contactCtaSchema) ?? defaultContactCtaSettings;
  } catch {
    return defaultContactCtaSettings;
  }
}
