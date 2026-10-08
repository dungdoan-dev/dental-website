import type { Metadata } from "next";
import { ArticleConsultationSection } from "@/features/articles/components/ArticleConsultationSection";
import { ArticleDirectoryHero } from "@/features/articles/components/ArticleDirectoryHero";
import { ArticleExplorer } from "@/features/articles/components/ArticleExplorer";
import { getArticles } from "@/features/articles/services/article.service";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { generateSeoMetadata } from "@/lib/seo";
import { articleCategories } from "@/features/articles/data/article-categories.data";
import type { ArticleCategory } from "@/features/articles/types/article.type";

export const metadata: Metadata = generateSeoMetadata({
  title: "Cẩm nang & kiến thức nha khoa",
  description: "Cẩm nang chăm sóc răng miệng, Implant, răng sứ, chỉnh nha và nha khoa trẻ em tại Nha Khoa 2000.",
  url: "/tin-tuc",
});

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category, q }, articles, clinics] = await Promise.all([searchParams, getArticles(), getClinics()]);
  const featuredArticle = articles.find((article) => article.featured);
  const initialCategory: "all" | ArticleCategory = category && articleCategories.some((item) => item.value === category) ? category as ArticleCategory : "all";
  const initialQuery = typeof q === "string" ? q.slice(0, 100) : "";

  return (
    <>
      <ArticleDirectoryHero />
      <ArticleExplorer articles={articles} featuredArticle={featuredArticle} initialCategory={initialCategory} initialQuery={initialQuery} />
      <ArticleConsultationSection clinics={clinics} />
    </>
  );
}
