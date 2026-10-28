import { getFaqHeading, getFaqItems } from "../services/home.service";
import { FAQAccordion } from "./FAQAccordion";

export async function FAQSection({ TitleTag, limit, filterable }: { TitleTag?: "h1" | "h2"; limit?: number; filterable?: boolean } = {}) {
  const [items, heading] = await Promise.all([getFaqItems(), getFaqHeading()]);
  return <FAQAccordion items={limit ? items.slice(0, limit) : items} TitleTag={TitleTag} filterable={filterable} {...heading} />;
}
