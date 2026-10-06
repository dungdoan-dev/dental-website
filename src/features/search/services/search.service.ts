import { getArticles } from "@/features/articles/services/article.service";
import { getDoctors } from "@/features/doctors/services/doctor.service";
import { getServices } from "@/features/services/services/service.service";

export type WebsiteSearchResult = {
  id: string;
  type: "Dịch vụ" | "Bác sĩ" | "Tin tức";
  title: string;
  description: string;
  href: string;
};

function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi");
}

export async function searchWebsite(rawQuery: string): Promise<readonly WebsiteSearchResult[]> {
  const query = normalizeSearchText(rawQuery.trim().slice(0, 80));
  if (!query) return [];

  const [services, doctors, articles] = await Promise.all([getServices(), getDoctors(), getArticles()]);
  const results: WebsiteSearchResult[] = [
    ...services.map((service) => ({
      id: service.id,
      type: "Dịch vụ" as const,
      title: service.name,
      description: service.shortDescription,
      href: `/dich-vu/${service.slug}`,
    })),
    ...doctors.map((doctor) => ({
      id: doctor.id,
      type: "Bác sĩ" as const,
      title: doctor.name,
      description: `${doctor.position} · ${doctor.specialty}`,
      href: `/bac-si/${doctor.slug}`,
    })),
    ...articles.map((article) => ({
      id: article.id,
      type: "Tin tức" as const,
      title: article.title,
      description: article.excerpt,
      href: `/tin-tuc/${article.slug}`,
    })),
  ];

  return results.filter((result) => normalizeSearchText(`${result.title} ${result.description}`).includes(query));
}
