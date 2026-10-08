import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ArticleDetail } from "@/features/articles/components/ArticleDetail";
import { getArticleBySlug, getArticles } from "@/features/articles/services/article.service";
import { generateSeoMetadata } from "@/lib/seo";

type ArticleDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  return article ? generateSeoMetadata({ title: article.title, description: article.excerpt, image: article.thumbnail, url: `/tin-tuc/${article.slug}` }) : generateSeoMetadata({ title: "Không tìm thấy bài viết" });
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([getArticleBySlug(slug), getArticles()]);
  if (!article) notFound();
  return <><div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><Breadcrumb items={[{ label: "Tin tức", href: "/tin-tuc" }, { label: article.title }]} /></div><ArticleDetail article={article} articles={articles} /></>;
}
