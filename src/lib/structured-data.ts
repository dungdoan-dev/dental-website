import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

const DAY_CODES: [RegExp, string][] = [
  [/^(t2|thứ hai)$/, "Mo"], [/^(t3|thứ ba)$/, "Tu"], [/^(t4|thứ tư)$/, "We"], [/^(t5|thứ năm)$/, "Th"],
  [/^(t6|thứ sáu)$/, "Fr"], [/^(t7|thứ bảy)$/, "Sa"], [/^(cn|chủ nhật)$/, "Su"],
];

function dayCode(text: string): string | undefined {
  const value = text.trim().toLocaleLowerCase("vi-VN");
  return DAY_CODES.find(([pattern]) => pattern.test(value))?.[1];
}

/**
 * Turns admin text such as "Thứ hai - Thứ bảy: 08:00 – 12:00 | 13:30 – 20:00" or
 * "08:00–12:00 | 13:30–20:00 (T2 - T7)" into schema.org openingHours ["Mo-Sa 08:00-12:00", ...].
 * Returns undefined when the days or times cannot be read, rather than publishing a guess.
 */
export function parseOpeningHours(text: string): string[] | undefined {
  const days = text.match(/(T[2-7]|CN|Thứ (?:hai|ba|tư|năm|sáu|bảy)|Chủ nhật)\s*[-–]\s*(T[2-7]|CN|Thứ (?:hai|ba|tư|năm|sáu|bảy)|Chủ nhật)/i);
  const from = days && dayCode(days[1]);
  const to = days && dayCode(days[2]);
  const times = [...text.matchAll(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/g)];
  if (!from || !to || !times.length) return undefined;
  const pad = (hour: string) => hour.padStart(2, "0");
  return times.map(([, h1, m1, h2, m2]) => `${from}-${to} ${pad(h1)}:${m1}-${pad(h2)}:${m2}`);
}

type ClinicForSchema = { id: string; name: string; address: string; phone: string; image: string; workingHours: string; googleMapsUrl?: string };

/** Organization plus one Dentist (LocalBusiness) per clinic, rendered once in the public layout. */
export function clinicsJsonLd(clinics: readonly ClinicForSchema[]) {
  const organizationId = absoluteUrl("/#organization");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/images/logo/nha-khoa-2000.png"),
        description: siteConfig.description,
        foundingDate: "1999",
      },
      ...clinics.map((clinic) => ({
        "@type": "Dentist",
        "@id": absoluteUrl(`/lien-he#${clinic.id}`),
        name: `${siteConfig.name} – ${clinic.name}`,
        url: absoluteUrl("/lien-he"),
        image: clinic.image ? absoluteUrl(clinic.image) : undefined,
        telephone: clinic.phone,
        address: { "@type": "PostalAddress", streetAddress: clinic.address, addressLocality: "TP. Hồ Chí Minh", addressCountry: "VN" },
        openingHours: parseOpeningHours(clinic.workingHours),
        hasMap: clinic.googleMapsUrl || undefined,
        parentOrganization: { "@id": organizationId },
      })),
    ],
  };
}

export function breadcrumbJsonLd(items: readonly { label: string; href?: string }[]) {
  const trail = [{ label: "Trang chủ", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      // The last crumb is the current page; Google allows it without an item URL.
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function physicianJsonLd(doctor: { name: string; fullName: string; slug: string; avatar: string; description: string; specialties: readonly string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.fullName,
    url: absoluteUrl(`/bac-si/${doctor.slug}`),
    image: absoluteUrl(doctor.avatar),
    description: doctor.description,
    medicalSpecialty: "Dentistry",
    knowsAbout: doctor.specialties.length ? doctor.specialties : undefined,
    worksFor: { "@id": absoluteUrl("/#organization") },
  };
}

export function articleJsonLd(article: { title: string; slug: string; excerpt: string; thumbnail: string; publishedAt: Date | string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.thumbnail),
    datePublished: new Date(article.publishedAt).toISOString(),
    author: article.author ? { "@type": "Person", name: article.author } : { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: absoluteUrl(`/tin-tuc/${article.slug}`),
  };
}
