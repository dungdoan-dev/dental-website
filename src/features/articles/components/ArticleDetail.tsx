import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getArticleCategoryLabel } from "../data/article-categories.data";
import type { Article } from "../types/article.type";

type ArticleDetailProps = { article: Article };

export function ArticleDetail({ article }: ArticleDetailProps) {
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(article.publishedAt));
  return (
    <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[16/9] bg-surface-container"><Image alt={article.title} className="object-cover" fill priority sizes="(max-width: 896px) 100vw, 896px" src={article.thumbnail} /></div>
      <div className="p-6 sm:p-8 md:p-12"><div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary"><span className="rounded-full bg-brand-blue-light px-3 py-1 font-semibold text-brand-blue-dark">{getArticleCategoryLabel(article.category)}</span><time dateTime={article.publishedAt}>{publishedDate}</time><span aria-hidden="true">•</span><span className="inline-flex items-center gap-1"><Icon className="h-4 w-4" name="clock" />{article.readingMinutes} phút đọc</span></div><h1 className="mt-5 text-3xl font-extrabold leading-tight text-text-primary md:text-4xl">{article.title}</h1><p className="mt-5 text-lg font-medium leading-relaxed text-text-secondary">{article.excerpt}</p><div className="mt-8 border-t border-border-subtle pt-8 text-base leading-8 text-text-primary"><p>{article.content}</p></div><p className="mt-8 rounded-xl bg-brand-blue-light/60 p-4 text-sm leading-relaxed text-text-secondary">Thông tin trong bài mang tính tham khảo. Bác sĩ cần thăm khám trực tiếp để tư vấn phương án phù hợp với tình trạng của bạn.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 rounded-full bg-brand-blue-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-blue" href="/bac-si#booking-section"><Icon className="h-4 w-4" name="calendar" />Đặt lịch thăm khám</Link><Link className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-6 py-3 text-sm font-semibold text-brand-blue-dark transition hover:bg-surface-container" href="/tin-tuc"><Icon className="h-4 w-4" name="arrow-left" />Xem bài viết khác</Link></div></div>
    </article>
  );
}
