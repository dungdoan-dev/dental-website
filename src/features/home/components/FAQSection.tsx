import { getFaqHeading, getFaqItems } from "../services/home.service";
import { FAQAccordion } from "./FAQAccordion";

export async function FAQSection({ TitleTag }: { TitleTag?: "h1" | "h2" } = {}) {
  const [items, heading] = await Promise.all([getFaqItems(), getFaqHeading()]);
  return <FAQAccordion items={items} TitleTag={TitleTag} {...heading} />;
}
