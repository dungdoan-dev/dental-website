"use client";

import { useActionState, useState } from "react";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
import { FilePenLine } from "lucide-react";
import { buttonVariants } from "@/components/admin-ui/button";
import { EditableRows } from "./EditableRows";
import { PriceTableEditor } from "./PriceTableEditor";
import type { DentalService } from "@/features/services/types/service.type";
import type { ServiceDetailData } from "@/features/services/schemas/service-detail.schema";
import { ImageUploadField } from "./ImageUploadField";
import { FormFeedback } from "./FormFeedback";
import { updateServiceDetail } from "../content-actions";
import { getAdminServiceDetailForEdit, getAdminServiceForEdit } from "../read-actions";
import { useMutationToast } from "./AdminToast";

// The list passes a summary row; description and image are fetched together with the detail on open.
type Props = { service: Pick<DentalService, "id" | "name" | "category"> };

export function ServiceDetailFormDialog({ service }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [detail, setDetail] = useState<ServiceDetailData | null>(null);
  const [base, setBase] = useState<DentalService | null>(null);
  const [result, formAction, pending] = useActionState(updateServiceDetail, null);
  useMutationToast(result, "Đã cập nhật chi tiết dịch vụ.");

  async function openEditor() {
    setOpen(true);
    setLoading(true);
    setLoadError("");
    try {
      const [loadedDetail, loadedBase] = await Promise.all([getAdminServiceDetailForEdit(service.id), getAdminServiceForEdit(service.id)]);
      setDetail(loadedDetail);
      setBase(loadedBase);
    } catch {
      setLoadError("Không thể tải chi tiết dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  // Saved detail is already validated on the server; parsing here would ship zod to the browser.
  const initial: ServiceDetailData = detail ?? {
    eyebrow: service.category,
    title: service.name,
    introduction: base?.description ?? "",
    highlights: [],
    priceSourceUrl: "",
    prices: [],
    steps: [],
    faqs: [],
  };

  return (
    <>
      <button className={buttonVariants({ variant: "soft", size: "sm" })} onClick={openEditor} type="button">
        <FilePenLine />
        Chi tiết
      </button>
      <AdminDialog eyebrow="Quản lý nội dung trang chi tiết" icon="edit_note" onOpenChange={(next) => { if (!next) setOpen(false); }} open={open} size="xl" title={service.name}>
            {loading ? <p className="p-7 text-sm text-text-secondary" role="status">Đang tải chi tiết dịch vụ…</p> : null}
            {loadError ? <p className="p-7 text-sm text-error" role="alert">{loadError}</p> : null}
            {!loading && !loadError ? <form action={formAction} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />
              <input name="serviceId" type="hidden" value={service.id} />
              <ImageUploadField aspect={16 / 9} label="Ảnh trang chi tiết dịch vụ" defaultValue={base?.image} name="image" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <label>Dòng giới thiệu nhỏ<input defaultValue={initial.eyebrow} maxLength={120} name="eyebrow" placeholder="Ví dụ: Nha khoa thẩm mỹ" /></label>
                <label>Tiêu đề chính *<input defaultValue={initial.title} maxLength={240} name="title" required /></label>
              </div>
              <label>Mô tả mở đầu *<textarea defaultValue={initial.introduction} maxLength={10000} name="introduction" required rows={4} /></label>

              <EditableRows label="Điểm nổi bật" name="highlights" columns={[{ key: "value", label: "Nội dung", multiline: true }]} initialRows={initial.highlights.map((value) => ({ value }))} />
              <section className="space-y-3 rounded-2xl border border-border-subtle p-4">
                <div><h3 className="text-sm font-bold text-text-primary">Bảng giá tham khảo</h3><p className="mt-1 text-xs text-text-secondary">Có thể để trống nếu dịch vụ chưa công khai giá.</p></div>
                <label>Liên kết bảng giá gốc (không bắt buộc)<input defaultValue={initial.priceSourceUrl} maxLength={2000} name="priceSourceUrl" placeholder="https://..." type="url" /></label>
                <div className="space-y-2"><h4 className="text-xs font-semibold text-text-secondary">Các hạng mục giá</h4><PriceTableEditor initialRows={initial.prices} /></div>
              </section>
              <EditableRows label="Quy trình thực hiện" name="steps" columns={[{ key: "number", label: "Số thứ tự" }, { key: "title", label: "Tên bước" }, { key: "description", label: "Mô tả", multiline: true }]} initialRows={initial.steps} />
              <EditableRows label="Câu hỏi thường gặp" name="faqs" columns={[{ key: "question", label: "Câu hỏi", multiline: true }, { key: "answer", label: "Câu trả lời", multiline: true }]} initialRows={initial.faqs} />
              <DialogFooter cancelLabel="Đóng" isPending={pending} onCancel={() => setOpen(false)} submitLabel="Lưu chi tiết dịch vụ" />
            </form> : null}
      </AdminDialog>
    </>
  );
}
