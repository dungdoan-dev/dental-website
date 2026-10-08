import { unstable_cache } from "next/cache";

const CACHE_SECONDS = 300;

export const publicDataTags = {
  services: "public-services",
  doctors: "public-doctors",
  articles: "public-articles",
  clinics: "public-clinics",
  siteContent: "public-site-content",
  heroSlides: "public-hero-slides",
  coreValues: "public-core-values",
  insurancePartners: "public-insurance-partners",
  faqs: "public-faqs",
  testimonials: "public-testimonials",
} as const;

export function cachePublicData<Args extends unknown[], T>(
  key: string,
  tags: readonly string[],
  load: (...args: Args) => Promise<T>,
) {
  return unstable_cache(load, ["public-data", key], {
    revalidate: CACHE_SECONDS,
    tags: [...tags],
  });
}
