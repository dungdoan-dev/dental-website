export type ArticleCategory = "implant" | "veneer" | "orthodontics" | "kids" | "periodontics" | "general";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  /** Large image inside the article; falls back to the thumbnail. */
  coverImage?: string;
  publishedAt: string;
  author: string;
  category: ArticleCategory;
  readingMinutes: number;
  featured: boolean;
  status?: "draft" | "published";
};

export type ArticleSummary = Omit<Article, "content">;
