import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/admin-ui/badge";
import { Button, buttonVariants } from "@/components/admin-ui/button";
import { Card } from "@/components/admin-ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/table";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { DirectoryHeroForm, loadDirectoryHero } from "@/features/admin/components/DirectoryHeroForm";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
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
  const hero = loadDirectoryHero("articles");
  const raw = await searchParams;
  const query = articleListQuerySchema.parse({
    status: typeof raw.status === "string" ? raw.status : "all",
    page: typeof raw.page === "string" ? raw.page : 1,
  });
  const pageSize = 20;
  const supabase = await getSupabaseServerClient();
  // Fresh builders per call: a Postgrest builder mutates itself, so it cannot be reused for a second page.
  const countQuery = () => {
    const q = supabase.from("articles").select("id", { count: "exact", head: true });
    return query.status !== "all" ? q.eq("status", query.status) : q;
  };
  const pageQuery = (pageNumber: number) => {
    const q = supabase.from("articles").select("id,title,slug,excerpt,thumbnail,published_at,author,category,reading_minutes,featured,status");
    return (query.status !== "all" ? q.eq("status", query.status) : q)
      .order("published_at", { ascending: false })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);
  };
  // Count and the requested page run together; the page is only refetched when the URL asks for one past the end.
  const [{ count, error: countError }, firstPage] = await Promise.all([countQuery(), pageQuery(query.page)]);
  if (countError) throw countError;
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(query.page, pageCount);
  const { data: articleRows, error } = page === query.page ? firstPage : await pageQuery(page);
  if (error) throw error;
  const articles = articleRows.map((article) => ({
    ...article,
    publishedAt: new Date(article.published_at),
    readingMinutes: article.reading_minutes,
  }));

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (query.status !== "all") params.set("status", query.status);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/admin/articles${params.size ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<>
          <Button asChild size="sm" variant="outline"><Link prefetch={false} href="/tin-tuc" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang tin tức</Link></Button>
          <ArticleFormDialog buttonClassName={buttonVariants({ size: "sm" })} buttonLabel="+ Viết bài mới" />
        </>}
        description="Các bài viết chia sẻ kiến thức nha khoa, nghiên cứu lâm sàng và cẩm nang chăm sóc răng miệng."
        title="Bài viết & cẩm nang"
      />

      <DirectoryHeroForm loading={hero} page="articles" />

      <nav aria-label="Lọc trạng thái bài viết" className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-[7px] bg-white p-1 shadow-card">
        {[{ label: "Tất cả", value: "all" }, { label: "Bản nháp", value: "draft" }, { label: "Đã xuất bản", value: "published" }].map((filter) => (
          <Link
            aria-current={query.status === filter.value ? "page" : undefined}
            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${query.status === filter.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-primary"}`}
            href={filter.value === "all" ? "/admin/articles" : `/admin/articles?status=${filter.value}`}
            key={filter.value}
          >{filter.label}</Link>
        ))}
      </nav>

      <Card className="gap-0 overflow-hidden py-0">
        <Table aria-label="Danh sách bài viết" className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-24 pl-6">Ảnh</TableHead>
              <TableHead>Tiêu đề &amp; slug</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-40">Chuyên mục</TableHead>
              <TableHead className="w-44">Tác giả</TableHead>
              <TableHead className="w-32">Ngày đăng</TableHead>
              <TableHead className="w-24">Nổi bật</TableHead>
              <TableHead className="w-44 pr-6 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => {
              const articleObj: Omit<Article, "content"> = {
                ...article,
                publishedAt: article.publishedAt.toISOString(),
                category: article.category as Article["category"],
              };

              return (
                <TableRow key={article.id}>
                  <TableCell className="pl-6">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md border bg-muted">
                      <Image alt={article.title} className="object-cover" fill sizes="64px" src={article.thumbnail} />
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <Link prefetch={false} className="line-clamp-1 text-sm font-semibold hover:text-primary" href={article.status === "published" ? `/tin-tuc/${article.slug}` : "/admin/articles"} target={article.status === "published" ? "_blank" : undefined}>{article.title}</Link>
                    <div className="truncate font-mono text-xs text-muted-foreground">/tin-tuc/{article.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={article.status === "published" ? "bg-emerald-500/10 text-emerald-700" : ""} variant={article.status === "published" ? "secondary" : "outline"}>{article.status === "published" ? "Đã xuất bản" : "Bản nháp"}</Badge>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{getArticleCategoryLabel(article.category as Article["category"])}</Badge></TableCell>
                  <TableCell className="whitespace-normal text-sm"><span className="line-clamp-2" title={article.author}>{article.author}</span></TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</TableCell>
                  <TableCell>{article.featured ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><CircleCheck className="size-4" /> Hero</span> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <ArticleFormDialog article={articleObj} buttonClassName={buttonVariants({ variant: "soft", size: "sm" })} buttonLabel="Sửa" />
                      <DeleteArticleButton id={article.id} name={article.title} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {articles.length === 0 ? <TableRow><TableCell className="h-24 text-center text-muted-foreground" colSpan={8}>Chưa có bài viết nào ở mục này.</TableCell></TableRow> : null}
          </TableBody>
        </Table>
      </Card>

      <nav aria-label="Phân trang bài viết" className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>Hiển thị {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total} bài viết</p>
        <div className="flex items-center gap-2">
          {page > 1 ? <Button asChild size="sm" variant="outline"><Link href={pageHref(page - 1)}><ChevronLeft /> Trang trước</Link></Button> : <Button aria-disabled="true" disabled size="sm" variant="outline"><ChevronLeft /> Trang trước</Button>}
          <span aria-current="page" className="min-w-20 text-center font-semibold text-foreground">Trang {page} / {pageCount}</span>
          {page < pageCount ? <Button asChild size="sm" variant="outline"><Link href={pageHref(page + 1)}>Trang sau <ChevronRight /></Link></Button> : <Button aria-disabled="true" disabled size="sm" variant="outline">Trang sau <ChevronRight /></Button>}
        </div>
      </nav>
    </div>
  );
}
