import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getArticleCategoryLabel } from "../data/article-categories.data";
import type { Article } from "../types/article.type";

type FeaturedArticleProps = { article: Article };

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(article.publishedAt));
  return (
    <section aria-label="Bài viết nổi bật" className="bg-surface pb-14">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <article className="group rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(20,70,85,0.06)] transition-shadow hover:shadow-[0_18px_48px_rgba(20,70,85,0.1)] lg:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <Link aria-label={`Đọc bài viết: ${article.title}`} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-container lg:col-span-7" href={`/tin-tuc/${article.slug}`}><Image alt={article.title} className="object-cover transition-transform duration-700 group-hover:scale-105" fill priority sizes="(max-width: 1024px) 100vw, 58vw" src={article.thumbnail} /><span className="absolute left-4 top-4 rounded-full bg-brand-blue-dark px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">Bài Viết Nổi Bật</span></Link>
            <div className="lg:col-span-5"><div className="mb-4 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-brand-green-light px-3 py-1 font-bold uppercase tracking-wider text-brand-green-dark">{getArticleCategoryLabel(article.category)}</span><span className="inline-flex items-center gap-1 text-text-secondary"><Icon className="h-3.5 w-3.5" name="clock" />{article.readingMinutes} phút đọc</span><span aria-hidden="true" className="text-outline-variant">•</span><time className="text-text-secondary" dateTime={article.publishedAt}>{publishedDate}</time></div><h2 className="text-2xl font-bold leading-snug text-text-primary transition-colors group-hover:text-brand-blue-dark"><Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link></h2><p className="mt-3 line-clamp-3 leading-relaxed text-text-secondary">{article.excerpt}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-container pt-5"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue-dark"><Icon name="shield-check" /></span><span className="text-sm"><span className="block text-xs text-text-secondary">Biên tập</span><span className="font-bold text-text-primary">{article.author}</span></span></div><Link className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-brand-blue-dark transition-colors hover:bg-brand-blue-dark hover:text-white" href={`/tin-tuc/${article.slug}`}>Đọc bài viết<Icon className="h-4 w-4" name="arrow-right" /></Link></div></div>
          </div>
        </article>
      </div>
    </section>
  );
}
