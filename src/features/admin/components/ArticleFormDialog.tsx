"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { marked } from "marked";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { Article, ArticleCategory } from "@/features/articles/types/article.type";
import { upsertArticle } from "../actions";
import { ImageUploadField } from "./ImageUploadField";

const TinyMceEditor = dynamic(() => import("./TinyMceEditor").then((module) => module.TinyMceEditor), {
  ssr: false,
  loading: () => <div className="grid min-h-80 place-items-center rounded-xl border border-border-subtle bg-surface text-sm text-text-secondary">Đang tải trình soạn thảo…</div>,
});

function articleContentToHtml(content: string) {
  return /<(?:p|h[1-6]|ul|ol|li|blockquote|table|strong|em|div|br|hr)\b/i.test(content)
    ? content
    : String(marked.parse(content, { async: false }));
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
  article?: Article;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);

  const [formData, setFormData] = useState({
    id: article?.id ?? "",
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    thumbnail: article?.thumbnail ?? "/images/articles/implant-guide.jpg",
    author: article?.author ?? "Đội ngũ Nha Khoa 2000",
    category: article?.category ?? ("implant" as ArticleCategory),
    readingMinutes: article?.readingMinutes ?? 4,
    featured: article?.featured ?? false,
    status: article?.status ?? ("draft" as const),
  });
  const [editorContent, setEditorContent] = useState(() => articleContentToHtml(article?.content ?? ""));

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
        onClick={() => { setEditorContent(articleContentToHtml(formData.content)); setIsOpen(true); }}
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

            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />
              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Tiêu đề chuẩn SEO y khoa..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Slug URL *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary font-mono focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Chuyên mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ArticleCategory,
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Tóm tắt ngắn (Excerpt) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Mô tả tóm tắt nội dung bài viết..."
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-text-primary">Nội dung bài viết / Kiến thức nha khoa *</label>
                <TinyMceEditor value={editorContent} onChange={(content) => { setEditorContent(content); setFormData((current) => ({ ...current, content })); }} />
              </div>

              <p className="text-xs leading-relaxed text-text-secondary">Có thể định dạng tiêu đề, danh sách, liên kết và bảng. Nội dung bài Markdown cũ sẽ được chuyển sang định dạng editor khi mở.</p>
              <label className="block text-sm font-semibold">Trạng thái bài viết<select className="mt-1 min-h-11 w-full rounded-lg border border-border-subtle px-3" onChange={(event) => setFormData({ ...formData, status: event.target.value as "draft" | "published" })} value={formData.status}><option value="draft">Bản nháp — chưa hiển thị công khai</option><option value="published">Xuất bản — hiển thị trên website</option></select></label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2"><ImageUploadField aspect={16 / 9} label="Ảnh thu nhỏ (Thumbnail) *" onChange={(thumbnail) => setFormData({ ...formData, thumbnail })} required value={formData.thumbnail} /></div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Thời gian đọc (phút)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readingMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Tác giả / Bác sĩ kiểm duyệt
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="BS.CKII Võ Văn Tự Hiến"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-text-primary font-medium">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-border-subtle text-brand-blue-dark accent-brand-blue-dark cursor-pointer"
                    />
                    <span>Bài viết nổi bật (Hero trang tin tức)</span>
                  </label>
                </div>
              </div>

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
            </form>
          </div>
        </div>
      )}
    </>
  );
}
