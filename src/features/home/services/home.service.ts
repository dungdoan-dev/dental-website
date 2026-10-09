import { db } from "@/lib/db";
import { getSiteContent } from "@/features/content/services/site-content.service";
import { z } from "zod";
import type { CoreValue, FAQItem, HeroSlide, InsurancePartner, Testimonial } from "../types/home.type";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";
import { HOME_SECTION_COPY, type HomeSectionCopyMap } from "../home-section-copy";

const getCachedHeroSlides = cachePublicData("home:hero-slides", [publicDataTags.heroSlides], () => db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }));
const getCachedCoreValues = cachePublicData("home:core-values", [publicDataTags.coreValues], () => db.coreValue.findMany({
  select: { title: true, slogan: true, description: true, iconKey: true, sortOrder: true },
  orderBy: { sortOrder: "asc" },
}));
const getCachedInsurancePartners = cachePublicData("home:insurance-partners", [publicDataTags.insurancePartners], () => db.$queryRaw<Array<{
  code: string; name: string; description: string; accent: string; logoSrc: string | null;
}>>`
  SELECT code, name, description, accent, logo_src AS "logoSrc"
  FROM insurance_partners ORDER BY sort_order ASC
`);
const getCachedFaqItems = cachePublicData("home:faqs", [publicDataTags.faqs], () => db.faqItem.findMany({
  select: { question: true, answer: true, sortOrder: true },
  orderBy: { sortOrder: "asc" },
}));
const getCachedTestimonials = cachePublicData("home:testimonials", [publicDataTags.testimonials], () => db.testimonial.findMany({ orderBy: { sortOrder: "asc" } }));

export async function getHeroSlides(): Promise<readonly HeroSlide[]> {
  try {
    const slides = await getCachedHeroSlides();
    return slides.map((s) => ({
      id: s.id,
      image: s.image,
      imageAlt: s.imageAlt,
      badge: s.badge,
      title: s.title,
      badgeVariant: s.badgeVariant as "blue" | "green",
      objectPosition: s.objectPosition as "center" | "top",
    }));
  } catch {
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
      iconKey: v.iconKey as "heart" | "care" | "honesty" | "innovation",
    }));
  } catch {
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
      logoSrc: p.logoSrc ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function getWhyChooseImage(): Promise<string | null> {
  try {
    const content = await getSiteContent("home_why_choose", z.object({ image: z.string().min(1) }));
    return content?.image ?? null;
  } catch {
    return null;
  }
}

export async function getFaqItems(): Promise<readonly FAQItem[]> {
  try {
    const items = await getCachedFaqItems();
    return items.map((i) => ({ question: i.question, answer: i.answer }));
  } catch {
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
      customerName: t.customerName,
      rating: t.rating,
      content: t.content,
      avatar: t.avatar ?? undefined,
      source: t.source ?? undefined,
      initials: t.initials,
      accent: t.accent as "blue" | "green" | "blue-dark",
    }));
  } catch {
    return [];
  }
}
