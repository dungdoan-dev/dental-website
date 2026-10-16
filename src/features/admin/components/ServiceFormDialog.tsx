"use client";

import { useState, useTransition } from "react";
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

const defaultButtonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm";

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
        // Success toasts directly: closing unmounts this editor before the result effect could run.
        if (saved.success) { showMutationToast(saved, service ? "Đã cập nhật dịch vụ." : "Đã thêm dịch vụ."); close(); }
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
                onClick={() => close()}
                className="p-1.5 rounded-xl text-text-secondary hover:bg-surface-container hover:text-text-primary transition"
              >
                ✕
              </button>
            </div>

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
                <p className="admin-form-hint">Hiện trên thẻ dịch vụ ở trang chủ và trang Dịch vụ (khoảng 3 dòng).</p>
                <label>Mô tả chi tiết *<textarea onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả chuyên môn đầy đủ..." required rows={4} value={formData.description} /></label>
                {!service ? <ImageUploadField label="Ảnh trang chi tiết *" onChange={(image) => setFormData({ ...formData, image })} required value={formData.image} /> : <p className="admin-form-hint">Ảnh, bảng giá, quy trình và câu hỏi thường gặp được sửa ở nút “Chi tiết”.</p>}
              </fieldset>

              <details className="admin-form-section">
                <summary>Cài đặt nâng cao</summary>
                <label>Đường dẫn trang (slug) *<input className="font-mono" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="trong-rang-implant" required type="text" value={formData.slug} /></label>
                <p className="admin-form-hint">Tự tạo từ tên khi thêm mới. Đổi slug sẽ làm đường dẫn cũ /dich-vu/… không còn hoạt động.</p>
                <p className="admin-form-hint">Mã dịch vụ (tự tạo, không sửa được): <span className="font-mono">{formData.id || "—"}</span></p>
              </details>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle/60">
                <button
                  type="button"
                  onClick={() => close()}
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
