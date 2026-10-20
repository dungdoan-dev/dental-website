"use client";

import { useState, useTransition } from "react";
import { buttonVariants } from "@/components/admin-ui/button";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { DentalService, ServiceCategory } from "@/features/services/types/service.type";
import { upsertService } from "../actions";
import { ImageUploadField } from "./ImageUploadField";
import { showMutationToast, useMutationToast } from "./AdminToast";
import { LazyEditDialog } from "./LazyEditDialog";
import { getAdminServiceForEdit } from "../read-actions";

const CATEGORIES: { label: string; value: ServiceCategory }[] = [
  { label: "Trồng Răng Implant", value: "implant" },
  { label: "Nha Khoa Thẩm Mỹ", value: "aesthetic" },
  { label: "Chỉnh Nha - Niềng Răng", value: "orthodontics" },
  { label: "Bệnh Lý & Nha Chu", value: "periodontics" },
  { label: "Nha Khoa Trẻ Em", value: "pediatric" },
  { label: "Nha Khoa Tổng Quát", value: "general" },
  { label: "Khác", value: "other" },
];

const defaultButtonClassName = buttonVariants({ variant: "soft", size: "sm" });

// With serviceId the full record is fetched on click; without it the dialog adds a new service.
export function ServiceFormDialog({ serviceId, buttonLabel = "Sửa", buttonClassName = defaultButtonClassName }: { serviceId?: string; buttonLabel?: string; buttonClassName?: string }) {
  if (!serviceId) return <ServiceEditor buttonClassName={buttonClassName} buttonLabel={buttonLabel} />;
  return (
    <LazyEditDialog buttonClassName={buttonClassName} buttonLabel={buttonLabel} load={() => getAdminServiceForEdit(serviceId)}>
      {(service, close) => <ServiceEditor defaultOpen onClose={close} service={service} />}
    </LazyEditDialog>
  );
}

function ServiceEditor({
  service,
  defaultOpen = false,
  onClose,
  buttonLabel = "Sửa",
  buttonClassName = defaultButtonClassName,
}: {
  service?: DentalService;
  defaultOpen?: boolean;
  onClose?: () => void;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const close = () => { setIsOpen(false); onClose?.(); };
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  useMutationToast(result, service ? "Đã cập nhật dịch vụ." : "Đã thêm dịch vụ.");

  const initialFormData = {
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
  };
  const [formData, setFormData] = useState(initialFormData);

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
        // Success toasts directly: closing unmounts this editor before the result effect could run.
        if (saved.success) {
          showMutationToast(saved, service ? "Đã cập nhật dịch vụ." : "Đã thêm dịch vụ.");
          if (!service) setFormData(initialFormData);
          close();
        }
        else setResult(saved);
      } catch { setResult({ success: false, error: "Không thể lưu thay đổi. Vui lòng thử lại." }); }
    });
  };

  return (
    <>
      {defaultOpen ? null : <button
        type="button"
        onClick={() => {
          if (!service) setFormData((current) => ({ ...current, id: current.id || `service-${crypto.randomUUID()}` }));
          setIsOpen(true);
        }}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>}

      <AdminDialog icon="medical_services" onOpenChange={(open) => { if (!open) (close)(); }} open={isOpen} size="lg" title={service ? "Chỉnh sửa Dịch vụ" : "Thêm Dịch vụ Mới"}>
            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />

              <fieldset className="admin-form-section">
                <legend>Nội dung dịch vụ</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
                  <label>Tên dịch vụ *<input onChange={handleNameChange} placeholder="Ví dụ: Cấy Ghép Implant Kỹ Thuật Số" required type="text" value={formData.name} /></label>
                  <label>Chuyên mục *
                    <select onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })} value={formData.category}>
                      {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </label>
                </div>
                <label>Mô tả ngắn *<textarea onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Mô tả tóm tắt nổi bật dịch vụ..." required rows={2} value={formData.shortDescription} /></label>
                <p className="admin-form-hint">Hiện trên thẻ dịch vụ ở trang chủ và trang Dịch vụ, tối đa 4 dòng. Icon trên thẻ được chọn tự động theo chuyên mục.</p>
                <label>Mô tả cơ bản *<textarea onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Giới thiệu dịch vụ khi chưa có trang chi tiết riêng..." required rows={4} value={formData.description} /></label>
                <p className="admin-form-hint">Dùng khi chưa cấu hình nội dung riêng. Khi đã lưu ở nút “Chi tiết”, tiêu đề và mô tả mở đầu của trang dịch vụ được lấy từ form đó.</p>
                {!service ? <ImageUploadField label="Ảnh trang chi tiết *" onChange={(image) => setFormData({ ...formData, image })} required value={formData.image} /> : <p className="admin-form-hint">Ảnh, bảng giá, quy trình và câu hỏi thường gặp được sửa ở nút “Chi tiết”.</p>}
              </fieldset>

              <details className="admin-form-section">
                <summary>Cài đặt nâng cao</summary>
                <label>Đường dẫn trang (slug) *<input className="font-mono" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="trong-rang-implant" required type="text" value={formData.slug} /></label>
                <p className="admin-form-hint">Tự tạo từ tên khi thêm mới. Đổi slug sẽ làm đường dẫn cũ /dich-vu/… không còn hoạt động.</p>
                <p className="admin-form-hint">Mã dịch vụ (tự tạo, không sửa được): <span className="font-mono">{formData.id || "—"}</span></p>
              </details>

              <DialogFooter isPending={isPending} onCancel={() => close()} submitLabel="Lưu Dịch Vụ" />
            </form>
      </AdminDialog>
    </>
  );
}
