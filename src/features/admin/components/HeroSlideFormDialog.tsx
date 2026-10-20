"use client";

import { useState, useTransition, type FormEvent } from "react";
import { buttonVariants } from "@/components/admin-ui/button";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
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
      <button className={buttonVariants({ size: "sm" })} onClick={() => setIsOpen(true)} type="button">
        {buttonLabel}
      </button>
      <AdminDialog icon="home" onOpenChange={(open) => { if (!open) setIsOpen(false); }} open={isOpen} size="lg" title={slide ? "Chỉnh sửa slide" : "Thêm slide trang chủ"}>
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
              <DialogFooter isPending={isPending} onCancel={() => setIsOpen(false)} submitLabel="Lưu slide" />
            </form>
      </AdminDialog>
    </>
  );
}
