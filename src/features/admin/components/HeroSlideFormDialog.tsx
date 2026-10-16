"use client";

import { useState, useTransition, type FormEvent } from "react";
import { upsertHeroSlide } from "../actions";
import { ImageUploadField } from "./ImageUploadField";
import { showAdminToast } from "./AdminToast";

type HeroSlideData = {
  id: string;
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  badgeVariant: "blue" | "green";
  objectPosition: "center" | "top";
  sortOrder: number;
};

const emptySlide: HeroSlideData = {
  id: "", image: "", imageAlt: "", badge: "", title: "",
  badgeVariant: "blue", objectPosition: "center", sortOrder: 0,
};

export function HeroSlideFormDialog({
  slide,
  buttonLabel = "+ Thêm slide",
}: {
  slide?: HeroSlideData;
  buttonLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<HeroSlideData>(slide ?? emptySlide);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await upsertHeroSlide({ ...formData, id: slide?.id ?? `slide-${crypto.randomUUID()}`, sortOrder: Number(formData.sortOrder) });
        if (!result.success) {
          setError(result.error);
          showAdminToast("error", result.error);
          return;
        }
        showAdminToast("success", slide ? "Đã cập nhật slide." : "Đã thêm slide.");
        setIsOpen(false);
      } catch {
        const message = "Không thể lưu slide. Hãy kiểm tra lại thông tin và thử lại.";
        setError(message);
        showAdminToast("error", message);
      }
    });
  }

  const updateField = <K extends keyof HeroSlideData>(key: K, value: HeroSlideData[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <button className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-blue-dark px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-blue" onClick={() => setIsOpen(true)} type="button">
        {buttonLabel}
      </button>
      {isOpen ? (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8" onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <div aria-labelledby="hero-slide-dialog-title" aria-modal="true" className="admin-dialog-panel flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]" role="dialog">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <h2 className="text-lg font-bold text-text-primary" id="hero-slide-dialog-title">{slide ? "Chỉnh sửa slide" : "Thêm slide trang chủ"}</h2>
              <button aria-label="Đóng" className="rounded-lg px-2 py-1 text-text-secondary hover:bg-surface-container-low" onClick={() => setIsOpen(false)} type="button">✕</button>
            </div>
            <form className="admin-dialog-form flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7" onSubmit={handleSubmit}>
              <fieldset className="admin-form-section">
                <legend>Ảnh slide</legend>
                <ImageUploadField aspect={16 / 9} label="Ảnh slide (tỉ lệ 16:9, rộng từ 1920px) *" onChange={(image) => updateField("image", image)} required value={formData.image} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>Mô tả ảnh (cho người khiếm thị và Google) *<input onChange={(event) => updateField("imageAlt", event.target.value)} required value={formData.imageAlt} /></label>
                  <label>Phần giữ lại khi ảnh bị cắt
                    <select onChange={(event) => updateField("objectPosition", event.target.value as HeroSlideData["objectPosition"])} value={formData.objectPosition}><option value="center">Giữa ảnh</option><option value="top">Phía trên ảnh</option></select>
                  </label>
                </div>
              </fieldset>
              <fieldset className="admin-form-section">
                <legend>Nội dung</legend>
                <label>Tiêu đề *<input onChange={(event) => updateField("title", event.target.value)} required value={formData.title} /></label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>Nhãn nhỏ<input onChange={(event) => updateField("badge", event.target.value)} value={formData.badge} /></label>
                  <label>Màu nhãn
                    <select onChange={(event) => updateField("badgeVariant", event.target.value as HeroSlideData["badgeVariant"])} value={formData.badgeVariant}><option value="blue">Xanh dương</option><option value="green">Xanh lá</option></select>
                  </label>
                </div>
              </fieldset>
              <fieldset className="admin-form-section">
                <legend>Sắp xếp</legend>
                <label>Thứ tự hiển thị *<input min={0} onChange={(event) => updateField("sortOrder", Number(event.target.value))} required type="number" value={formData.sortOrder} /></label>
                <p className="admin-form-hint">Số nhỏ hiển thị trước.{slide ? ` Mã slide: ${slide.id}` : ""}</p>
              </fieldset>
              {error ? <p className="text-xs text-red-600" role="alert">{error}</p> : null}
              <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                <button className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-semibold" onClick={() => setIsOpen(false)} type="button">Hủy</button>
                <button className="rounded-lg bg-brand-blue-dark px-4 py-2 text-xs font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "Đang lưu..." : "Lưu slide"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
