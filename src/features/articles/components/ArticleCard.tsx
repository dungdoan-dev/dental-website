import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getArticleCategoryLabel } from "../data/article-categories.data";
import type { Article } from "../types/article.type";

type ArticleCardProps = { article: Article };

export function ArticleCard({ article }: ArticleCardProps) {
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(article.publishedAt));
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(20,70,85,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,70,85,0.1)]">
      <Link aria-label={`Đọc bài viết: ${article.title}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-container" href={`/tin-tuc/${article.slug}`}>
        <Image alt={article.title} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" src={article.thumbnail} />
        <span className="absolute left-3.5 top-3.5 rounded-full bg-brand-blue-light/95 px-3 py-1 text-[11px] font-semibold text-brand-blue-dark shadow-sm backdrop-blur-sm">{getArticleCategoryLabel(article.category)}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary"><time dateTime={article.publishedAt}>{publishedDate}</time><span aria-hidden="true">•</span><span className="inline-flex items-center gap-1"><Icon className="h-3.5 w-3.5" name="clock" />{article.readingMinutes} phút đọc</span></div>
        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-brand-blue-dark"><Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link></h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-container pt-5 text-xs"><span className="min-w-0 truncate text-text-secondary">{article.author}</span><Link className="inline-flex shrink-0 items-center gap-1 font-bold text-brand-blue-dark hover:text-brand-blue" href={`/tin-tuc/${article.slug}`}>Xem thêm<Icon className="h-4 w-4" name="arrow-right" /></Link></div>
      </div>
    </article>
  );
}
