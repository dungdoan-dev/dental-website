import { articleRepository } from "../repositories/article.repository";
import { articleSchema } from "../schemas/article.schema";
import type { Article } from "../types/article.type";

export async function getArticles(): Promise<readonly Article[]> {
  try {
    return articleSchema.array().parse(await articleRepository.findAll());
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await articleRepository.findBySlug(slug);
    return article ? articleSchema.parse(article) : null;
  } catch {
    return null;
  }
}
