import { getFaqHeading, getFaqItems } from "../services/home.service";
import { FAQAccordion } from "./FAQAccordion";

export async function FAQSection() {
  const [items, heading] = await Promise.all([getFaqItems(), getFaqHeading()]);
  return <FAQAccordion items={items} {...heading} />;
}
