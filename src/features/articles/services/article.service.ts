import { articleRepository } from "../repositories/article.repository";
import { articleSchema } from "../schemas/article.schema";
import type { Article } from "../types/article.type";
import { cachePublicData, publicDataTags } from "@/lib/public-data-cache";

const getCachedArticles = cachePublicData("articles:list", [publicDataTags.articles], () => articleRepository.findAll());
const getCachedArticleBySlug = cachePublicData("articles:by-slug", [publicDataTags.articles], (slug: string) => articleRepository.findBySlug(slug));

export async function getArticles(): Promise<readonly Article[]> {
  try {
    return articleSchema.array().parse(await getCachedArticles());
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await getCachedArticleBySlug(slug);
    return article ? articleSchema.parse(article) : null;
  } catch {
    return null;
  }
}
