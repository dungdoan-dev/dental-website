import { articleRepository } from "../repositories/article.repository";
import { articleSchema } from "../schemas/article.schema";
import type { Article } from "../types/article.type";

export async function getArticles(): Promise<readonly Article[]> {
  return articleSchema.array().parse(await articleRepository.findAll());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await articleRepository.findBySlug(slug);
  return article ? articleSchema.parse(article) : null;
}
