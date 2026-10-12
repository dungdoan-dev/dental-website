import { getPublicSupabaseClient } from "@/lib/supabase/public";
import type { Article, ArticleCategory } from "../types/article.type";

export const articleRepository = {
  async findAll(): Promise<readonly Article[]> {
    const { data: articles, error } = await getPublicSupabaseClient().from("articles").select("*")
      .eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
    if (error) throw error;

    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      thumbnail: a.thumbnail,
      publishedAt: a.published_at,
      author: a.author,
      category: a.category as ArticleCategory,
      readingMinutes: a.reading_minutes,
      featured: a.featured,
      status: a.status,
    }));
  },

  async findBySlug(slug: string): Promise<Article | null> {
    const { data: a, error } = await getPublicSupabaseClient().from("articles").select("*")
      .eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
    if (error) throw error;

    if (!a) return null;

    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      thumbnail: a.thumbnail,
      publishedAt: a.published_at,
      author: a.author,
      category: a.category as ArticleCategory,
      readingMinutes: a.reading_minutes,
      featured: a.featured,
      status: a.status,
    };
  },
};
