"use client";

import { useState, useTransition } from "react";
import { upsertTestimonial } from "../actions";

export function TestimonialFormDialog({
  testimonial,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  testimonial?: {
    id: string;
    customerName: string;
    rating: number;
    content: string;
    source?: string;
    initials: string;
    accent: string;
  };
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    id: testimonial?.id ?? "",
    customerName: testimonial?.customerName ?? "",
    rating: testimonial?.rating ?? 5,
    content: testimonial?.content ?? "",
    source: testimonial?.source ?? "",
    initials: testimonial?.initials ?? "KH",
    accent: testimonial?.accent ?? "blue",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customerName = e.target.value;
    const words = customerName.trim().split(" ");
    const initials =
      words.length >= 2
        ? `${words[words.length - 2][0]}${words[words.length - 1][0]}`.toUpperCase()
        : customerName.slice(0, 2).toUpperCase();

    setFormData((prev) => ({
      ...prev,
      customerName,
      initials: testimonial ? prev.initials : initials,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await upsertTestimonial({
        ...formData,
        id: formData.id || `review-${crypto.randomUUID()}`,
        rating: Number(formData.rating),
      });
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8">
          <div className="admin-dialog-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle/60 px-5 pb-4 pt-5 text-left sm:px-7 sm:pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {testimonial ? "Chỉnh sửa Đánh giá" : "Thêm Đánh giá Mới"}
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

            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm text-left sm:px-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Tên khách hàng *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.customerName}
                    onChange={handleNameChange}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Bác Trần Thanh Tùng"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Chữ cái đầu (Initials)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.initials}
                    onChange={(e) =>
                      setFormData({ ...formData, initials: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary uppercase font-bold focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Số sao đánh giá (1-5) *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 sao</option>
                    <option value={4}>⭐⭐⭐⭐ 4 sao</option>
                    <option value={3}>⭐⭐⭐ 3 sao</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Nguồn / Dịch vụ đã làm
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Việt kiều Úc • Implant Toàn Hàm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Nội dung chia sẻ *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none leading-relaxed"
                  placeholder="Cảm nhận thực tế của khách hàng..."
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Màu sắc đại diện</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="accent"
                      value="blue"
                      checked={formData.accent === "blue"}
                      onChange={() => setFormData({ ...formData, accent: "blue" })}
                      className="accent-brand-blue-dark cursor-pointer"
                    />
                    <span className="text-brand-blue font-bold">Xanh dương</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="accent"
                      value="green"
                      checked={formData.accent === "green"}
                      onChange={() => setFormData({ ...formData, accent: "green" })}
                      className="accent-brand-green-dark cursor-pointer"
                    />
                    <span className="text-brand-green font-bold">Xanh lá</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="accent"
                      value="blue-dark"
                      checked={formData.accent === "blue-dark"}
                      onChange={() => setFormData({ ...formData, accent: "blue-dark" })}
                      className="accent-brand-blue-dark cursor-pointer"
                    />
                    <span className="text-brand-blue-dark font-bold">Xanh navy</span>
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
                  {isPending ? "Đang lưu..." : "Lưu Đánh Giá"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
