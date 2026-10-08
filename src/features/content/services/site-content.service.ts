import type { z } from "zod";
import { siteContentRepository } from "../repositories/site-content.repository";

export async function getSiteContent<T>(key: string, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const content = await siteContentRepository.findByKey(key);
    return content === null ? null : schema.parse(content);
  } catch {
    return null;
  }
}
