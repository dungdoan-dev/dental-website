import { getSiteContent } from "@/features/content/services/site-content.service";
import { aboutPageSchema, type AboutPageData } from "../schemas/about.schema";

export async function getAboutPageData(): Promise<AboutPageData | null> {
  return getSiteContent("about_page", aboutPageSchema);
}
