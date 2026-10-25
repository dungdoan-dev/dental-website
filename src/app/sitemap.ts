import type { MetadataRoute } from "next";
import { getArticles } from "@/features/articles/services/article.service";
import { getDoctors } from "@/features/doctors/services/doctor.service";
import { getServices } from "@/features/services/services/service.service";
import { getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [services, doctors, articles] = await Promise.all([
    getServices(),
    getDoctors(),
    getArticles(),
  ]);

  const staticPaths = [
    "/",
    "/gioi-thieu",
    "/hoi-dap",
    "/dich-vu",
    "/bac-si",
    "/tin-tuc",
    "/bang-gia",
    "/lien-he",
  ];

  return [
    ...staticPaths.map((path) => ({ url: new URL(path, baseUrl).toString() })),
    ...services.map(({ slug }) => ({ url: new URL(`/dich-vu/${slug}`, baseUrl).toString() })),
    ...doctors.map(({ slug }) => ({ url: new URL(`/bac-si/${slug}`, baseUrl).toString() })),
    ...articles.map(({ slug, publishedAt }) => ({
      url: new URL(`/tin-tuc/${slug}`, baseUrl).toString(),
      lastModified: new Date(publishedAt),
    })),
  ];
}
