"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { articleCategories } from "../data/article-categories.data";
import type { Article, ArticleCategory } from "../types/article.type";
import { ArticleCard } from "./ArticleCard";
import { FeaturedArticle } from "./FeaturedArticle";

type ArticleExplorerProps = { articles: readonly Article[]; featuredArticle?: Article };
type CategoryFilter = "all" | ArticleCategory;

const pageSize = 6;

function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();
}

export function ArticleExplorer({ articles, featuredArticle }: ArticleExplorerProps) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
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
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-3 shadow-sm lg:flex-row">
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {articleCategories.map((item) => {
                const count = item.value === "all" ? articles.length : articles.filter((article) => article.category === item.value).length;
                const active = category === item.value;
                return <button aria-pressed={active} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm ${active ? "bg-brand-blue-dark text-white shadow-sm" : "bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-text-primary"}`} key={item.value} onClick={() => { setCategory(item.value); setPage(1); }} type="button">{item.label} ({count})</button>;
              })}
            </div>
            <label className="relative w-full shrink-0 lg:w-72"><span className="sr-only">Tìm bài viết</span><Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" name="search" /><input className="w-full rounded-full bg-surface-container-low py-2.5 pl-11 pr-4 text-sm text-text-primary outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-blue/30" onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm bài viết, triệu chứng..." type="search" value={query} /></label>
          </div>
        </div>
      </section>
      {featuredArticle && category === "all" && !query.trim() ? <FeaturedArticle article={featuredArticle} /> : null}
      <section aria-label="Danh sách bài viết chuyên môn" className="bg-surface pb-16">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
          <div className="mb-10 text-center"><h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">DANH SÁCH BÀI VIẾT CHUYÊN MÔN</h2><div aria-hidden="true" className="mx-auto mb-3 mt-3 h-1 w-12 rounded-full bg-brand-blue" /><p className="text-sm text-text-secondary">Kiến thức giúp bạn chủ động chăm sóc sức khỏe răng miệng</p></div>
          {currentArticles.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{currentArticles.map((article) => <ArticleCard article={article} key={article.id} />)}</div> : <div className="rounded-2xl bg-white px-6 py-12 text-center text-text-secondary">Không tìm thấy bài viết phù hợp. Hãy thử từ khóa hoặc chuyên mục khác.</div>}
          {pageCount > 1 ? <nav aria-label="Phân trang bài viết" className="mt-12 flex items-center justify-center gap-2"><button aria-label="Trang trước" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-secondary shadow-sm transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} type="button"><Icon name="chevron-left" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button aria-current={pageNumber === currentPage ? "page" : undefined} aria-label={`Trang ${pageNumber}`} className={`h-10 w-10 rounded-full text-sm font-semibold shadow-sm transition ${pageNumber === currentPage ? "bg-brand-blue-dark text-white" : "bg-white text-text-secondary hover:bg-surface-container"}`} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Trang tiếp" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-secondary shadow-sm transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} type="button"><Icon name="chevron-right" /></button></nav> : null}
        </div>
      </section>
    </>
  );
}
