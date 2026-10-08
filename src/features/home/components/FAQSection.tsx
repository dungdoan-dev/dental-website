import { getFaqItems } from "../services/home.service";
import { FAQAccordion } from "./FAQAccordion";

export async function FAQSection() {
  const items = await getFaqItems();
  return <FAQAccordion items={items} />;
}
