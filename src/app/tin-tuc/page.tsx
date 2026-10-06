import type { Metadata } from "next";
import { ArticleConsultationSection } from "@/features/articles/components/ArticleConsultationSection";
import { ArticleDirectoryHero } from "@/features/articles/components/ArticleDirectoryHero";
import { ArticleExplorer } from "@/features/articles/components/ArticleExplorer";
import { getArticles } from "@/features/articles/services/article.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Cẩm nang & kiến thức nha khoa",
  description: "Cẩm nang chăm sóc răng miệng, Implant, răng sứ, chỉnh nha và nha khoa trẻ em tại Nha Khoa 2000.",
  url: "/tin-tuc",
});

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featuredArticle = articles.find((article) => article.featured);

  return (
    <>
      <ArticleDirectoryHero />
      <ArticleExplorer articles={articles} featuredArticle={featuredArticle} />
      <ArticleConsultationSection />
    </>
  );
}
