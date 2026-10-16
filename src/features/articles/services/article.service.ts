import { articleRepository } from "../repositories/article.repository";
import { articleSchema } from "../schemas/article.schema";
import type { Article } from "../types/article.type";
import { parseValidItems } from "@/lib/parse-list";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";

const getCachedArticles = cachePublicData("articles:list", [publicDataTags.articles], () => articleRepository.findAll());
const getCachedArticleBySlug = cachePublicData("articles:by-slug", [publicDataTags.articles], (slug: string) => articleRepository.findBySlug(slug));

export async function getArticles(): Promise<readonly Article[]> {
  try {
    return parseValidItems(articleSchema, await getCachedArticles(), "article.service");
  } catch (error) {
    console.error("[article.service] public data load failed", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await getCachedArticleBySlug(slug);
    return article ? articleSchema.parse(article) : null;
  } catch (error) {
    console.error("[article.service] public data load failed", error);
    return null;
  }
}
