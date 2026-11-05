import { getFaqHeading, getFaqItems } from "../services/home.service";
import { FAQAccordion } from "./FAQAccordion";

/** `placement` shows only the questions an admin ticked for that page; without it every question is shown. */
export async function FAQSection({ TitleTag, placement, filterable }: { TitleTag?: "h1" | "h2"; placement?: "home" | "about"; filterable?: boolean } = {}) {
  const [all, heading] = await Promise.all([getFaqItems(), getFaqHeading()]);
  const items = placement ? all.filter((item) => (placement === "home" ? item.showOnHome : item.showOnAbout)) : all;
  if (placement && items.length === 0) return null;
  return <FAQAccordion items={items} TitleTag={TitleTag} filterable={filterable} {...heading} />;
}
