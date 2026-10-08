import { db } from "@/lib/db";
import { getSiteContent } from "@/features/content/services/site-content.service";
import { z } from "zod";
import type { CoreValue, FAQItem, HeroSlide, InsurancePartner, Testimonial } from "../types/home.type";

export async function getHeroSlides(): Promise<readonly HeroSlide[]> {
  try {
    const slides = await db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
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
    const values = await db.coreValue.findMany({ orderBy: { sortOrder: "asc" } });
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
    const partners = await db.$queryRaw<Array<{
      code: string; name: string; description: string; accent: string; logoSrc: string | null;
    }>>`
      SELECT code, name, description, accent, logo_src AS "logoSrc"
      FROM insurance_partners ORDER BY sort_order ASC
    `;
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
    const items = await db.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
    return items.map((i) => ({ question: i.question, answer: i.answer }));
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<readonly Testimonial[]> {
  try {
    const list = await db.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
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
