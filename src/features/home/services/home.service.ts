import { getPublicSupabaseClient } from "@/lib/supabase/public";
import { getSiteContent } from "@/features/content/services/site-content.service";
import { z } from "zod";
import type { CoreValue, FAQItem, HeroSlide, InsurancePartner, Testimonial } from "../types/home.type";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";
import { HOME_SECTION_COPY, type HomeSectionCopyMap } from "../home-section-copy";

const getCachedHeroSlides = cachePublicData("home:hero-slides", [publicDataTags.heroSlides], async () => {
  const { data, error } = await getPublicSupabaseClient().from("hero_slides").select("*").order("sort_order");
  if (error) throw error;
  return data;
});
const getCachedCoreValues = cachePublicData("home:core-values", [publicDataTags.coreValues], async () => {
  const { data, error } = await getPublicSupabaseClient().from("core_values").select("title,slogan,description,icon_key,sort_order").order("sort_order");
  if (error) throw error;
  return data;
});
const getCachedInsurancePartners = cachePublicData("home:insurance-partners", [publicDataTags.insurancePartners], async () => {
  const { data, error } = await getPublicSupabaseClient().from("insurance_partners").select("code,name,description,accent,logo_src").order("sort_order");
  if (error) throw error;
  return data;
});
const getCachedFaqItems = cachePublicData("home:faqs", [publicDataTags.faqs], async () => {
  const { data, error } = await getPublicSupabaseClient().from("faq_items").select("question,answer,category,sort_order").order("sort_order");
  if (error) throw error;
  return data;
});
const getCachedTestimonials = cachePublicData("home:testimonials", [publicDataTags.testimonials], async () => {
  const { data, error } = await getPublicSupabaseClient().from("testimonials").select("*").order("sort_order");
  if (error) throw error;
  return data;
});

export async function getHeroSlides(): Promise<readonly HeroSlide[]> {
  try {
    const slides = await getCachedHeroSlides();
    return slides.map((s) => ({
      id: s.id,
      image: s.image,
      imageAlt: s.image_alt,
      badge: s.badge,
      title: s.title,
      badgeVariant: s.badge_variant as "blue" | "green",
      objectPosition: s.object_position as "center" | "top",
    }));
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return [];
  }
}

export async function getCoreValues(): Promise<readonly CoreValue[]> {
  try {
    const values = await getCachedCoreValues();
    return values.map((v) => ({
      title: v.title,
      slogan: v.slogan,
      description: v.description,
      iconKey: v.icon_key as "heart" | "care" | "honesty" | "innovation",
    }));
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return [];
  }
}

export async function getInsurancePartners(): Promise<
  readonly InsurancePartner[]
> {
  try {
    const partners = await getCachedInsurancePartners();
    return partners.map((p) => ({
      code: p.code,
      name: p.name,
      description: p.description,
      accent: p.accent as "blue" | "green",
      logoSrc: p.logo_src ?? undefined,
    }));
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return [];
  }
}

export async function getWhyChooseImage(): Promise<string | null> {
  try {
    const content = await getSiteContent("home_why_choose", z.object({ image: z.string().min(1) }));
    return content?.image ?? null;
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return null;
  }
}

export async function getFaqItems(): Promise<readonly FAQItem[]> {
  try {
    const items = await getCachedFaqItems();
    return items.map((i) => ({ question: i.question, answer: i.answer, category: i.category }));
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return [];
  }
}

export async function getFaqHeading(): Promise<{ title: string; note: string }> {
  const copy = await getHomeSectionCopy();
  return copy.faq;
}

export async function getHomeSectionCopy(): Promise<HomeSectionCopyMap> {
  const [content, legacyFaq] = await Promise.all([
    getSiteContent("home_section_copy", z.record(z.string(), z.object({ title: z.string(), note: z.string() }))),
    getSiteContent("home_faq_heading", z.object({ title: z.string(), note: z.string() })),
  ]);
  const result = { ...HOME_SECTION_COPY } as unknown as HomeSectionCopyMap;
  if (content) {
    for (const key of Object.keys(HOME_SECTION_COPY) as Array<keyof typeof HOME_SECTION_COPY>) {
      const entry = content[key];
      if (entry) result[key] = { title: entry.title || HOME_SECTION_COPY[key].title, note: entry.note || HOME_SECTION_COPY[key].note };
    }
  }
  if (!content?.faq && legacyFaq) result.faq = legacyFaq;
  return result;
}

export async function getTestimonials(): Promise<readonly Testimonial[]> {
  try {
    const list = await getCachedTestimonials();
    return list.map((t) => ({
      id: t.id,
      customerName: t.customer_name,
      rating: t.rating,
      content: t.content,
      avatar: t.avatar ?? undefined,
      source: t.source ?? undefined,
      initials: t.initials,
      accent: t.accent as "blue" | "green" | "blue-dark",
    }));
  } catch (error) {
    console.error("[home.service] public data load failed", error);
    return [];
  }
}
