import { db } from "@/lib/db";

export const siteContentRepository = {
  async findByKey(key: string): Promise<unknown | null> {
    const rows = await db.$queryRaw<Array<{ content: unknown }>>`
      SELECT content FROM site_content WHERE key = ${key} LIMIT 1
    `;
    return rows[0]?.content ?? null;
  },
};
