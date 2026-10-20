"use client";

import { useState, useTransition } from "react";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
import { upsertTestimonial } from "../actions";
import { showAdminToast } from "./AdminToast";
import { ImageUploadField } from "./ImageUploadField";

export function TestimonialFormDialog({
  testimonial,
  nextSortOrder = 0,
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
    sortOrder: number;
    avatar?: string | null;
  };
  nextSortOrder?: number;
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
    accent: (testimonial?.accent ?? "blue") as "blue" | "green" | "blue-dark",
    sortOrder: testimonial?.sortOrder ?? nextSortOrder,
    avatar: testimonial?.avatar ?? "",
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
      try {
        const result = await upsertTestimonial({
          ...formData,
          id: formData.id || `review-${crypto.randomUUID()}`,
          rating: Number(formData.rating),
        });
        if (!result.success) {
          showAdminToast("error", result.error);
          return;
        }
        showAdminToast("success", testimonial ? "Đã cập nhật đánh giá." : "Đã thêm đánh giá.");
        setIsOpen(false);
      } catch {
        showAdminToast("error", "Không thể lưu đánh giá. Vui lòng thử lại.");
      }
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

      <AdminDialog icon="rate_review" onOpenChange={(open) => { if (!open) (() => setIsOpen(false))(); }} open={isOpen} size="md" title={testimonial ? "Chỉnh sửa Đánh giá" : "Thêm Đánh giá Mới"}>
            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm text-left sm:px-7">
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

              <ImageUploadField aspect={1} label="Ảnh khách hàng (không bắt buộc)" onChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))} value={formData.avatar} />

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

              <label className="block font-semibold text-text-primary">Thứ tự hiển thị
                <input className="mt-1 w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 font-normal text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none" min={0} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} type="number" value={formData.sortOrder} />
              </label>

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

              <DialogFooter isPending={isPending} onCancel={() => setIsOpen(false)} submitLabel="Lưu Đánh Giá" />
            </form>
      </AdminDialog>
    </>
  );
}
