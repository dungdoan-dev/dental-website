import type { Article } from "../types/article.type";
import { ArticleCard } from "./ArticleCard";

type ArticleListProps = { articles: readonly Article[] };

export function ArticleList({ articles }: ArticleListProps) {
  return <div className="grid gap-6 md:grid-cols-3">{articles.map((article) => <ArticleCard article={article} key={article.id} />)}</div>;
}
