"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { Article, ArticleCategory } from "@/features/articles/types/article.type";
import { upsertArticle } from "../actions";
import { getAdminArticleForEdit } from "../read-actions";
import { ImageUploadField } from "./ImageUploadField";
import { useMutationToast } from "./AdminToast";

const TinyMceEditor = dynamic(() => import("./TinyMceEditor").then((module) => module.TinyMceEditor), {
  ssr: false,
  loading: () => <div className="grid min-h-80 place-items-center rounded-xl border border-border-subtle bg-surface text-sm text-text-secondary">Đang tải trình soạn thảo…</div>,
});

async function articleContentToHtml(content: string) {
  if (!content || /<(?:p|h[1-6]|ul|ol|li|blockquote|table|strong|em|div|br|hr)\b/i.test(content)) return content;
  const { marked } = await import("marked");
  return String(marked.parse(content, { async: false }));
}

const CATEGORIES: { label: string; value: ArticleCategory }[] = [
  { label: "Trồng Răng Implant", value: "implant" },
  { label: "Răng Sứ Thẩm Mỹ", value: "veneer" },
  { label: "Niềng Răng - Chỉnh Nha", value: "orthodontics" },
  { label: "Nha Khoa Trẻ Em", value: "kids" },
  { label: "Bệnh Lý & Nướu", value: "periodontics" },
  { label: "Chăm Sóc Răng Miệng", value: "general" },
];

export function ArticleFormDialog({
  article,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  article?: Omit<Article, "content">;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  useMutationToast(result, article ? "Đã cập nhật bài viết." : "Đã thêm bài viết.");

  const [formData, setFormData] = useState({
    id: article?.id ?? "",
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: "",
    thumbnail: article?.thumbnail ?? "/images/articles/implant-guide.jpg",
    author: article?.author ?? "Đội ngũ Nha Khoa 2000",
    category: article?.category ?? ("implant" as ArticleCategory),
    readingMinutes: article?.readingMinutes ?? 4,
    featured: article?.featured ?? false,
    status: article?.status ?? ("draft" as const),
  });
  const [editorContent, setEditorContent] = useState("");

  async function openEditor() {
    setLoadError("");
    setIsOpen(true);
    if (!article) return;
    setIsLoading(true);
    try {
      const fullArticle = await getAdminArticleForEdit(article.id);
      setFormData({
        id: fullArticle.id,
        title: fullArticle.title,
        slug: fullArticle.slug,
        excerpt: fullArticle.excerpt,
        content: fullArticle.content,
        thumbnail: fullArticle.thumbnail,
        author: fullArticle.author,
        category: fullArticle.category,
        readingMinutes: fullArticle.readingMinutes,
        featured: fullArticle.featured,
        status: fullArticle.status ?? "draft",
      });
      setEditorContent(await articleContentToHtml(fullArticle.content));
    } catch {
      setLoadError("Không thể tải nội dung bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: article ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setResult(null);
      try {
        const saved = await upsertArticle({
        ...formData,
        id: formData.id || `article-${crypto.randomUUID()}`,
        readingMinutes: Number(formData.readingMinutes),
      });
        setResult(saved);
        if (saved.success) setIsOpen(false);
      } catch { setResult({ success: false, error: "Không thể lưu thay đổi. Vui lòng thử lại." }); }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8">
          <div className="admin-dialog-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle/60 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">article</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {article ? "Chỉnh sửa Bài Viết" : "Thêm Bài Viết Mới"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-text-secondary hover:bg-surface-container hover:text-text-primary transition"
              >
                ✕
              </button>
            </div>

            {isLoading ? <p className="p-7 text-sm text-text-secondary" role="status">Đang tải nội dung bài viết…</p> : null}
            {loadError ? <p className="p-7 text-sm text-error" role="alert">{loadError}</p> : null}
            {!isLoading && !loadError ? <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />

              <fieldset className="admin-form-section">
                <legend>Nội dung bài viết</legend>
                <label>Tiêu đề *<input onChange={handleTitleChange} placeholder="Tiêu đề chuẩn SEO y khoa..." required type="text" value={formData.title} /></label>
                <label>Tóm tắt ngắn *<textarea onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Mô tả tóm tắt nội dung bài viết..." required rows={2} value={formData.excerpt} /></label>
                <p className="admin-form-hint">Hiện dưới tiêu đề ở danh sách bài viết và khi chia sẻ lên mạng xã hội.</p>
                <div>
                  <p className="mb-2 text-[0.8125rem] font-semibold text-text-primary">Nội dung *</p>
                  <TinyMceEditor value={editorContent} onChange={(content) => { setEditorContent(content); setFormData((current) => ({ ...current, content })); }} />
                  <p className="admin-form-hint mt-2">Có thể định dạng tiêu đề, danh sách, liên kết và bảng. Bài Markdown cũ được tự chuyển sang định dạng editor khi mở.</p>
                </div>
              </fieldset>

              <fieldset className="admin-form-section">
                <legend>Xuất bản và hiển thị</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>Trạng thái<select onChange={(event) => setFormData({ ...formData, status: event.target.value as "draft" | "published" })} value={formData.status}><option value="draft">Bản nháp (chưa hiển thị)</option><option value="published">Xuất bản (hiển thị trên website)</option></select></label>
                  <label>Chuyên mục *
                    <select onChange={(e) => setFormData({ ...formData, category: e.target.value as ArticleCategory })} value={formData.category}>
                      {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </label>
                </div>
                <ImageUploadField aspect={16 / 9} label="Ảnh đại diện bài viết (16:9) *" onChange={(thumbnail) => setFormData({ ...formData, thumbnail })} required value={formData.thumbnail} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,10rem)]">
                  <label>Tác giả / Bác sĩ kiểm duyệt<input onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Bác sĩ Võ Văn Tự Hiến" type="text" value={formData.author} /></label>
                  <label>Thời gian đọc (phút)<input min="1" onChange={(e) => setFormData({ ...formData, readingMinutes: Number(e.target.value) })} type="number" value={formData.readingMinutes} /></label>
                </div>
                <label><input checked={formData.featured} className="h-4 w-4 accent-brand-blue-dark" onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} type="checkbox" />Bài nổi bật (hiển thị lớn ở đầu trang Kiến thức)</label>
              </fieldset>

              <details className="admin-form-section">
                <summary>Cài đặt nâng cao</summary>
                <label>Đường dẫn bài viết (slug) *<input className="font-mono" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required type="text" value={formData.slug} /></label>
                <p className="admin-form-hint">Tự tạo từ tiêu đề khi thêm mới. Đổi slug sẽ làm đường dẫn cũ /tin-tuc/… không còn hoạt động.</p>
              </details>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle/60">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-container"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-brand-blue-dark px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-blue disabled:opacity-50 transition-all"
                >
                  {isPending ? "Đang lưu..." : "Lưu Bài Viết"}
                </button>
              </div>
            </form> : null}
          </div>
        </div>
      )}
    </>
  );
}
