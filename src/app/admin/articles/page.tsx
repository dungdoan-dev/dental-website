import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { ArticleFormDialog } from "@/features/admin/components/ArticleFormDialog";
import { DeleteArticleButton } from "@/features/admin/components/DeleteButtons";
import type { Article } from "@/features/articles/types/article.type";
import { getArticleCategoryLabel } from "@/features/articles/data/article-categories.data";
import { articleListQuerySchema } from "@/features/admin/schemas/admin.schema";

export const metadata = {
  title: "Bài Viết & Cẩm Nang | Admin Nha Khoa 2000",
};

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const raw = await searchParams;
  const query = articleListQuerySchema.parse({
    status: typeof raw.status === "string" ? raw.status : "all",
    page: typeof raw.page === "string" ? raw.page : 1,
  });
  const pageSize = 20;
  const where = query.status === "all" ? undefined : { status: query.status };
  const total = await db.article.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(query.page, pageCount);
  const articles = await db.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (query.status !== "all") params.set("status", query.status);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/admin/articles${params.size ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Quản Lý Bài Viết &amp; Cẩm Nang Y Khoa
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Các bài viết chia sẻ kiến thức nha khoa, nghiên cứu lâm sàng và cẩm nang chăm sóc răng miệng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tin-tuc"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Xem Trang Tin Tức</span>
          </Link>
          <ArticleFormDialog
            buttonLabel="+ Viết Bài Mới"
            buttonClassName="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-blue-dark hover:bg-brand-blue text-white text-xs font-bold shadow-md transition-all"
          />
        </div>
      </div>

      <nav aria-label="Lọc trạng thái bài viết" className="flex flex-wrap gap-2">
        {[{ label: "Tất cả", value: "all" }, { label: "Bản nháp", value: "draft" }, { label: "Đã xuất bản", value: "published" }].map((filter) => <Link aria-current={query.status === filter.value ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${query.status === filter.value ? "bg-brand-blue-dark text-white" : "border border-border-subtle bg-white text-text-primary"}`} href={filter.value === "all" ? "/admin/articles" : `/admin/articles?status=${filter.value}`} key={filter.value}>{filter.label}</Link>)}
      </nav>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-text-secondary text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Ảnh</th>
                <th className="px-6 py-4">Tiêu đề &amp; Slug</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="px-4 py-4">Chuyên mục</th>
                <th className="px-4 py-4">Tác giả</th>
                <th className="px-4 py-4">Ngày đăng</th>
                <th className="px-4 py-4">Nổi bật</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-on-surface">
              {articles.map((article, idx) => {
                const articleObj: Article = {
                  ...article,
                  publishedAt: article.publishedAt.toISOString(),
                  category: article.category as Article["category"],
                };

                return (
                  <tr
                    key={article.id}
                    className={`hover:bg-background-secondary transition-colors ${
                      idx % 2 === 1 ? "bg-background-secondary/30" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-slate-100 border border-border-subtle shadow-sm">
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-3.5 max-w-sm">
                      <div className="font-bold text-text-primary text-sm hover:text-brand-blue-dark transition-colors line-clamp-1">
                        <Link href={article.status === "published" ? `/tin-tuc/${article.slug}` : "/admin/articles"} target={article.status === "published" ? "_blank" : undefined}>
                          {article.title}
                        </Link>
                      </div>
                      <div className="text-[11px] text-text-secondary font-mono mt-0.5 truncate">
                        /tin-tuc/{article.slug}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${article.status === "published" ? "bg-brand-green-light text-brand-green-dark" : "bg-surface-container text-text-secondary"}`}>{article.status === "published" ? "Đã xuất bản" : "Bản nháp"}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-brand-blue-light px-2.5 py-0.5 text-[11px] font-bold text-brand-blue-dark">
                        {getArticleCategoryLabel(article.category as Article["category"])}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-text-primary font-medium">
                      {article.author}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-xs text-text-secondary">
                      {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3.5">
                      {article.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-dark">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Hero</span>
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary">—</span>
                      )}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <ArticleFormDialog
                          article={articleObj}
                          buttonLabel="Sửa"
                          buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                        />
                        <DeleteArticleButton id={article.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <nav aria-label="Phân trang bài viết" className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
        <p>Hiển thị {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total} bài viết</p>
        <div className="flex items-center gap-2">
          <Link aria-disabled={page <= 1} className={`inline-flex min-h-10 items-center rounded-lg border border-border-subtle bg-white px-4 font-semibold ${page <= 1 ? "pointer-events-none opacity-50" : "hover:border-brand-blue"}`} href={pageHref(Math.max(1, page - 1))}>Trước</Link>
          <span aria-current="page" className="min-w-20 text-center font-semibold text-text-primary">Trang {page} / {pageCount}</span>
          <Link aria-disabled={page >= pageCount} className={`inline-flex min-h-10 items-center rounded-lg border border-border-subtle bg-white px-4 font-semibold ${page >= pageCount ? "pointer-events-none opacity-50" : "hover:border-brand-blue"}`} href={pageHref(Math.min(pageCount, page + 1))}>Tiếp</Link>
        </div>
      </nav>
    </div>
  );
}
