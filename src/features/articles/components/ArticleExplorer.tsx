"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { articleCategories } from "../data/article-categories.data";
import type { Article, ArticleCategory } from "../types/article.type";
import { ArticleCard } from "./ArticleCard";
import { FeaturedArticle } from "./FeaturedArticle";

type CategoryFilter = "all" | ArticleCategory;
type ArticleExplorerProps = { articles: readonly Article[]; featuredArticle?: Article; initialCategory?: CategoryFilter; initialQuery?: string };

const pageSize = 6;

function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();
}

export function ArticleExplorer({ articles, featuredArticle, initialCategory = "all", initialQuery = "" }: ArticleExplorerProps) {
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return articles.filter((article) => {
      if (category !== "all" && article.category !== category) return false;
      if (category === "all" && !normalizedQuery && article.featured) return false;
      if (!normalizedQuery) return true;
      return normalizeSearch(`${article.title} ${article.excerpt} ${article.author}`).includes(normalizedQuery);
    });
  }, [articles, category, query]);

  const pageCount = Math.ceil(filteredArticles.length / pageSize);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const currentArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <section aria-label="Tìm và lọc bài viết" className="bg-surface pb-8">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
          <div className="rounded-3xl border border-border-subtle bg-white p-5 shadow-[0_12px_40px_rgba(23,49,58,0.05)] sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 border-b border-border-subtle pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">Khám phá kiến thức nha khoa</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">Tìm bài viết hoặc chọn chuyên mục bạn quan tâm.</p>
              </div>
              <label className="relative block w-full lg:max-w-80"><span className="sr-only">Tìm bài viết</span><Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" name="search" /><input className="w-full rounded-xl border border-border-subtle bg-background-secondary py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20" onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm bài viết, triệu chứng..." type="search" value={query} /></label>
            </div>
            <div aria-label="Lọc theo chuyên mục" className="flex flex-wrap gap-2.5 pt-6" role="group">
              {articleCategories.map((item) => {
                const count = item.value === "all" ? articles.length : articles.filter((article) => article.category === item.value).length;
                const active = category === item.value;
                return <button aria-pressed={active} className={`max-w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark ${active ? "border-brand-blue-dark bg-brand-blue-dark text-white shadow-sm" : "border-border-subtle bg-background-secondary text-text-secondary hover:border-brand-blue hover:bg-brand-blue-light hover:text-brand-blue-dark"}`} key={item.value} onClick={() => { setCategory(item.value); setPage(1); }} type="button">{item.label} ({count})</button>;
              })}
            </div>
          </div>
        </div>
      </section>
      {featuredArticle && category === "all" && !query.trim() ? <FeaturedArticle article={featuredArticle} /> : null}
      <section aria-label="Danh sách bài viết chuyên môn" className="bg-surface pb-16" id="article-list">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
          <div className="mb-10 text-center"><h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">DANH SÁCH BÀI VIẾT CHUYÊN MÔN</h2><div aria-hidden="true" className="mx-auto mb-3 mt-3 h-1 w-12 rounded-full bg-brand-blue" /><p className="text-sm text-text-secondary">Kiến thức giúp bạn chủ động chăm sóc sức khỏe răng miệng</p></div>
          {currentArticles.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{currentArticles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <div className="rounded-2xl bg-white px-6 py-12 text-center text-text-secondary">Không tìm thấy bài viết phù hợp. Hãy thử từ khóa hoặc chuyên mục khác.</div>}
          {pageCount > 1 ? <nav aria-label="Phân trang bài viết" className="mt-12 flex items-center justify-center gap-2"><button aria-label="Trang trước" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-secondary shadow-sm transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} type="button"><Icon name="chevron-left" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button aria-current={pageNumber === currentPage ? "page" : undefined} aria-label={`Trang ${pageNumber}`} className={`h-10 w-10 rounded-full text-sm font-semibold shadow-sm transition ${pageNumber === currentPage ? "bg-brand-blue-dark text-white" : "bg-white text-text-secondary hover:bg-surface-container"}`} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Trang tiếp" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-secondary shadow-sm transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} type="button"><Icon name="chevron-right" /></button></nav> : null}
        </div>
      </section>
    </>
  );
}
