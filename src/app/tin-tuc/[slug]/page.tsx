import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { ArticleDetail } from "@/features/articles/components/ArticleDetail";
import { getArticleBySlug } from "@/features/articles/services/article.service";
import { generateSeoMetadata } from "@/lib/seo";

type ArticleDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const article = await getArticleBySlug((await params).slug);
  return article ? generateSeoMetadata({ title: article.title, description: article.excerpt, image: article.thumbnail, url: `/tin-tuc/${article.slug}` }) : generateSeoMetadata({ title: "Không tìm thấy bài viết" });
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = await getArticleBySlug((await params).slug);
  if (!article) notFound();
  return <Container className="py-12"><Breadcrumb items={[{ label: "Tin tức", href: "/tin-tuc" }, { label: article.title }]} /><ArticleDetail article={article} /></Container>;
}
