import { getSiteContent } from "@/features/content/services/site-content.service";
import { defaultAboutContent } from "../data/about-content";
import { aboutPageSchema, type AboutPageData } from "../schemas/about.schema";

export async function getAboutContent(): Promise<AboutPageData> {
  return (await getSiteContent("about_page", aboutPageSchema)) ?? defaultAboutContent;
}
