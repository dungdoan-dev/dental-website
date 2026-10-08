import { db } from "@/lib/db";
import type { Article, ArticleCategory } from "../types/article.type";

export const articleRepository = {
  async findAll(): Promise<readonly Article[]> {
    const articles = await db.article.findMany({
      where: { status: "published", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
    });

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      thumbnail: a.thumbnail,
      publishedAt: a.publishedAt.toISOString(),
      author: a.author,
      category: a.category as ArticleCategory,
      readingMinutes: a.readingMinutes,
      featured: a.featured,
      status: a.status,
    }));
  },

  async findBySlug(slug: string): Promise<Article | null> {
    const a = await db.article.findFirst({
      where: { slug, status: "published", publishedAt: { lte: new Date() } },
    });

    if (!a) return null;

    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      thumbnail: a.thumbnail,
      publishedAt: a.publishedAt.toISOString(),
      author: a.author,
      category: a.category as ArticleCategory,
      readingMinutes: a.readingMinutes,
      featured: a.featured,
      status: a.status,
    };
  },
};
