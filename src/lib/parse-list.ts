import type { z } from "zod";

/** Validates each item on its own: one bad record is logged and skipped instead of emptying the whole list. */
export function parseValidItems<T>(schema: z.ZodType<T>, items: readonly unknown[], source: string): T[] {
  return items.flatMap((item, index) => {
    const parsed = schema.safeParse(item);
    if (parsed.success) return [parsed.data];
    const id = item && typeof item === "object" && "id" in item ? String(item.id) : `#${index}`;
    console.error(`[${source}] skipped invalid record ${id}`, parsed.error.issues);
    return [];
  });
}
