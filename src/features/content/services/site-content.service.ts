import type { z } from "zod";
import { siteContentRepository } from "../repositories/site-content.repository";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";

const getCachedSiteContent = cachePublicData("site-content:by-key", [publicDataTags.siteContent], (key: string) => siteContentRepository.findByKey(key));

export async function getSiteContent<T>(key: string, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const content = await getCachedSiteContent(key);
    return content === null ? null : schema.parse(content);
  } catch {
    return null;
  }
}
