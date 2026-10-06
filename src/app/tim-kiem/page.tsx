import type { Metadata } from "next";
import { SearchPageContent } from "@/features/search/components/SearchPageContent";
import { generateSeoMetadata } from "@/lib/seo";

type SearchPageProps = { searchParams: Promise<{ q?: string | string[] }> };

export const metadata: Metadata = {
  ...generateSeoMetadata({ title: "Tìm kiếm", description: "Tìm dịch vụ, bác sĩ và bài viết tại Nha Khoa 2000." }),
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] ?? "" : q ?? "";
  return <SearchPageContent query={query} />;
}
