import { articleMockData } from "../data/article.mock";
import type { Article } from "../types/article.type";

export const articleRepository = {
  async findAll(): Promise<readonly Article[]> {
    return [...articleMockData].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },
  async findBySlug(slug: string): Promise<Article | null> {
    return articleMockData.find((article) => article.slug === slug) ?? null;
  },
};
