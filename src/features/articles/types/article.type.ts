export type ArticleCategory = "implant" | "veneer" | "orthodontics" | "kids" | "periodontics" | "general";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  publishedAt: string;
  author: string;
  category: ArticleCategory;
  readingMinutes: number;
  featured: boolean;
};
