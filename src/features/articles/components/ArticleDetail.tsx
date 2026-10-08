import Image from "next/image";
import Link from "next/link";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Icon } from "@/components/ui/Icon";
import { articleCategories, getArticleCategoryLabel } from "../data/article-categories.data";
import type { Article } from "../types/article.type";
import { ArticleBody, getArticleHeadings } from "./ArticleBody";

type ArticleDetailProps = { article: Article; articles: readonly Article[] };

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link className="group overflow-hidden rounded-2xl border border-border-subtle bg-white transition hover:-translate-y-0.5 hover:shadow-lg" href={`/tin-tuc/${article.slug}`}>
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-low"><Image alt={article.title} className="object-cover transition duration-500 group-hover:scale-[1.03]" fill sizes="(max-width: 640px) 100vw, 360px" src={article.thumbnail} /></div>
      <div className="space-y-2 p-4"><span className="text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">{getArticleCategoryLabel(article.category)}</span><h3 className="line-clamp-2 font-bold leading-snug text-text-primary group-hover:text-brand-blue-dark">{article.title}</h3><p className="text-xs text-text-secondary">{new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(article.publishedAt))} · {article.readingMinutes} phút đọc</p></div>
    </Link>
  );
}

export function ArticleDetail({ article, articles }: ArticleDetailProps) {
  const publishedDate = new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC", dateStyle: "long" }).format(new Date(article.publishedAt));
  const headings = getArticleHeadings(article.content);
  const orderedArticles = [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const currentIndex = orderedArticles.findIndex((item) => item.id === article.id);
  const previous = currentIndex >= 0 ? orderedArticles[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? orderedArticles[currentIndex - 1] : undefined;
  const recentArticles = orderedArticles.filter((item) => item.id !== article.id).slice(0, 3);
  const related = orderedArticles.filter((item) => item.id !== article.id && item.category === article.category).slice(0, 2);
  const relatedArticles = related.length ? related : recentArticles.slice(0, 2);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pb-24">
      <aside className="order-2 space-y-5 lg:order-1">
        <form action="/tin-tuc" className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm" role="search">
          <label className="text-sm font-bold text-text-primary" htmlFor="article-sidebar-search">Tìm trong kiến thức nha khoa</label>
          <div className="relative mt-3"><Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" name="search" /><input className="min-h-11 w-full rounded-xl border border-border-subtle bg-background-secondary pl-9 pr-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15" defaultValue="" id="article-sidebar-search" name="q" placeholder="Nhập từ khóa..." type="search" /></div>
          <button className="mt-3 min-h-10 w-full rounded-xl bg-brand-blue-dark px-4 text-sm font-bold text-white transition hover:bg-brand-blue-hover" type="submit">Tìm bài viết</button>
        </form>

        <nav aria-label="Chuyên mục kiến thức" className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm">
          <h2 className="text-sm font-extrabold text-text-primary">Chuyên mục</h2>
          <ul className="mt-3 space-y-1">{articleCategories.filter((item) => item.value !== "all").map((category) => {
            const count = articles.filter((item) => item.category === category.value).length;
            return <li key={category.value}><Link className={`flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm transition hover:bg-brand-blue-light hover:text-brand-blue-dark ${article.category === category.value ? "bg-brand-blue-light font-bold text-brand-blue-dark" : "text-text-secondary"}`} href={`/tin-tuc?category=${category.value}#article-list`}><span>{category.label}</span><span className="shrink-0 text-xs tabular-nums">{count}</span></Link></li>;
          })}</ul>
        </nav>

        <section aria-labelledby="recent-articles-title" className="rounded-2xl border border-border-subtle bg-white p-4 shadow-sm">
          <h2 className="text-sm font-extrabold text-text-primary" id="recent-articles-title">Bài viết mới</h2>
          <div className="mt-3 space-y-3">{recentArticles.map((item) => <Link className="group flex gap-3" href={`/tin-tuc/${item.slug}`} key={item.id}><span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-low"><Image alt="" className="object-cover transition group-hover:scale-105" fill sizes="80px" src={item.thumbnail} /></span><span className="min-w-0"><span className="line-clamp-2 text-xs font-bold leading-relaxed text-text-primary group-hover:text-brand-blue-dark">{item.title}</span><time className="mt-1 block text-[11px] text-text-secondary" dateTime={item.publishedAt}>{new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(new Date(item.publishedAt))}</time></span></Link>)}</div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-brand-blue-dark p-5 text-white shadow-sm">
          <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/12"><Icon name="calendar" /></span>
          <h2 className="mt-4 text-lg font-extrabold">Cần tư vấn thêm?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">Bác sĩ sẽ thăm khám và trao đổi phương án phù hợp với tình trạng răng miệng của bạn.</p>
          <AppointmentButton className="mt-5 w-full justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-blue-dark hover:bg-brand-blue-light"><Icon className="h-4 w-4" name="calendar" />Đặt lịch thăm khám</AppointmentButton>
        </section>

        <div className="rounded-2xl border border-brand-green/20 bg-brand-green-light p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-text-primary"><Icon className="h-5 w-5 text-brand-green-dark" name="check-circle" />Thông tin tham khảo</div><p className="mt-2 text-xs leading-relaxed text-text-secondary">Nội dung giúp bạn tìm hiểu thêm, không thay thế chẩn đoán hoặc tư vấn trực tiếp từ bác sĩ.</p></div>
      </aside>

      <main className="order-1 min-w-0 lg:order-2">
        <article className="overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-[0_16px_48px_rgba(23,49,58,0.07)]">
          <header className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-10">
            <div className="flex flex-wrap items-center gap-2"><Link className="rounded-full bg-brand-blue-light px-3 py-1.5 text-xs font-bold text-brand-blue-dark transition hover:bg-brand-blue-dark hover:text-white" href={`/tin-tuc?category=${article.category}#article-list`}>{getArticleCategoryLabel(article.category)}</Link><span className="text-xs text-text-secondary">Kiến thức nha khoa</span></div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-[2.65rem]">{article.title}</h1>
            <p className="mt-4 text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border-subtle pt-5 text-sm text-text-secondary">
              <span className="inline-flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-blue-light text-brand-blue-dark"><Icon className="h-4 w-4" name="person" /></span><span><span className="block text-[11px] text-text-secondary">Tác giả</span><span className="font-bold text-text-primary">{article.author}</span></span></span>
              <time className="inline-flex items-center gap-2" dateTime={article.publishedAt}><Icon className="h-4 w-4 text-brand-blue-dark" name="calendar" />{publishedDate}</time>
              <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-brand-blue-dark" name="clock" />{article.readingMinutes} phút đọc</span>
            </div>
          </header>

          <div className="relative aspect-[16/9] max-h-[34rem] bg-surface-container-low"><Image alt={article.title} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 900px" src={article.thumbnail} /></div>

          <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            {headings.length ? <nav aria-label="Mục lục bài viết" className="mb-9 rounded-2xl border border-brand-blue/20 bg-brand-blue-light/50 p-5 sm:p-6"><h2 className="flex items-center gap-2 text-base font-extrabold text-text-primary"><Icon className="h-5 w-5 text-brand-blue-dark" name="list" />Trong bài viết</h2><ol className="mt-3 space-y-2">{headings.map((heading, index) => <li className={heading.level === 3 ? "pl-4" : ""} key={`${heading.id}-${index}`}><a className="text-sm leading-relaxed text-text-secondary transition hover:text-brand-blue-dark hover:underline" href={`#${heading.id}`}>{heading.text}</a></li>)}</ol></nav> : null}
            <div className="mx-auto max-w-[46rem]"><ArticleBody content={article.content} /></div>
            <p className="mx-auto mt-9 max-w-[46rem] rounded-2xl border border-brand-blue/15 bg-brand-blue-light/45 p-5 text-sm leading-relaxed text-text-secondary">Nội dung bài viết mang tính tham khảo. Hãy trao đổi trực tiếp với bác sĩ để được đánh giá và tư vấn phù hợp với tình trạng của bạn.</p>
            <div className="mt-8 flex flex-wrap gap-3"><AppointmentButton className="gap-2 rounded-full bg-brand-blue-dark px-6 py-3 text-sm hover:bg-brand-blue-hover"><Icon className="h-4 w-4" name="calendar" />Đặt lịch thăm khám</AppointmentButton><Link className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-6 py-3 text-sm font-semibold text-brand-blue-dark transition hover:bg-surface-container" href="/tin-tuc"><Icon className="h-4 w-4" name="arrow-left" />Tất cả bài viết</Link></div>
          </div>
        </article>

        <section aria-label="Tác giả bài viết" className="mt-6 flex flex-col gap-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-blue-light text-brand-blue-dark"><Icon className="h-7 w-7" name="medical-services" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark">Biên soạn bởi</p><h2 className="mt-1 font-extrabold text-text-primary">{article.author}</h2><p className="mt-1 text-sm leading-relaxed text-text-secondary">Nội dung được chia sẻ nhằm hỗ trợ bạn hiểu thêm về sức khỏe răng miệng; bác sĩ sẽ tư vấn sau khi thăm khám cụ thể.</p></div></section>

        {previous || next ? <nav aria-label="Điều hướng bài viết" className="mt-5 grid gap-3 sm:grid-cols-2">{previous ? <Link className="group rounded-2xl border border-border-subtle bg-white p-4 transition hover:border-brand-blue/40 hover:bg-brand-blue-light/40" href={`/tin-tuc/${previous.slug}`}><span className="flex items-center gap-1 text-xs font-bold text-text-secondary group-hover:text-brand-blue-dark"><Icon className="h-4 w-4" name="arrow-left" />Bài trước</span><span className="mt-2 line-clamp-2 block text-sm font-bold text-text-primary">{previous.title}</span></Link> : <span />}{next ? <Link className="group rounded-2xl border border-border-subtle bg-white p-4 text-left transition hover:border-brand-blue/40 hover:bg-brand-blue-light/40 sm:text-right" href={`/tin-tuc/${next.slug}`}><span className="flex items-center gap-1 text-xs font-bold text-text-secondary group-hover:text-brand-blue-dark sm:justify-end">Bài tiếp theo<Icon className="h-4 w-4" name="arrow-right" /></span><span className="mt-2 line-clamp-2 block text-sm font-bold text-text-primary">{next.title}</span></Link> : null}</nav> : null}

        {relatedArticles.length ? <section aria-labelledby="related-articles-title" className="mt-10"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark">Đọc tiếp</p><h2 className="mt-1 text-xl font-extrabold text-text-primary" id="related-articles-title">Bài viết liên quan</h2></div><Link className="shrink-0 text-sm font-bold text-brand-blue-dark hover:underline" href="/tin-tuc">Xem tất cả</Link></div><div className="grid gap-4 sm:grid-cols-2">{relatedArticles.map((item) => <ArticleCard article={item} key={item.id} />)}</div></section> : null}
      </main>
    </div>
  );
}
