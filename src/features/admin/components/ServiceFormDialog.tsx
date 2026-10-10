"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { DentalService, ServiceCategory } from "@/features/services/types/service.type";
import { upsertService } from "../actions";
import { ImageUploadField } from "./ImageUploadField";
import { useMutationToast } from "./AdminToast";

const CATEGORIES: { label: string; value: ServiceCategory }[] = [
  { label: "Trồng Răng Implant", value: "implant" },
  { label: "Nha Khoa Thẩm Mỹ", value: "aesthetic" },
  { label: "Chỉnh Nha - Niềng Răng", value: "orthodontics" },
  { label: "Bệnh Lý & Nha Chu", value: "periodontics" },
  { label: "Nha Khoa Trẻ Em", value: "pediatric" },
  { label: "Nha Khoa Tổng Quát", value: "general" },
  { label: "Khác", value: "other" },
];

export function ServiceFormDialog({
  service,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  service?: DentalService;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  useMutationToast(result, service ? "Đã cập nhật dịch vụ." : "Đã thêm dịch vụ.");

  const [formData, setFormData] = useState({
    id: service?.id ?? "",
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    shortDescription: service?.shortDescription ?? "",
    description: service?.description ?? "",
    image: service?.image ?? "/images/services/implant-digital.jpg",
    badge: service?.badge ?? "Tiêu biểu",
    badgeVariant: service?.badgeVariant ?? ("blue" as const),
    featured: service?.featured ?? false,
    category: service?.category ?? ("general" as ServiceCategory),
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: service ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setResult(null);
      try {
        const saved = await upsertService(formData);
        setResult(saved);
        if (saved.success) setIsOpen(false);
      } catch { setResult({ success: false, error: "Không thể lưu thay đổi. Vui lòng thử lại." }); }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!service) setFormData((current) => ({ ...current, id: current.id || `service-${crypto.randomUUID()}` }));
          setIsOpen(true);
        }}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8">
          <div className="admin-dialog-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle/60 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {service ? "Chỉnh sửa Dịch vụ" : "Thêm Dịch vụ Mới"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Tên dịch vụ *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Ví dụ: Cấy Ghép Implant Kỹ Thuật Số"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Slug URL *</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none font-mono"
                    placeholder="trong-rang-implant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Mã ID dịch vụ *</label>
                  <input
                    required
                    disabled={!!service}
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none font-mono disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Chuyên mục kỹ thuật *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ServiceCategory,
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
                <label className="block font-semibold text-text-primary mb-1">Mô tả ngắn (Trang chủ / Danh sách) *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Mô tả tóm tắt nổi bật dịch vụ..."
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Mô tả chi tiết *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Mô tả chuyên môn đầy đủ..."
                />
              </div>

              {!service ? <ImageUploadField label="Ảnh trang chi tiết *" onChange={(image) => setFormData({ ...formData, image })} required value={formData.image} /> : null}

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
                  {isPending ? "Đang lưu..." : "Lưu Dịch Vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
