"use client";

import { useActionState, useState } from "react";
import type { DentalService } from "@/features/services/types/service.type";
import { serviceDetailSchema, type ServiceDetailData } from "@/features/services/schemas/service-detail.schema";
import { EditableRows } from "./EditableRows";
import { FormFeedback } from "./FormFeedback";
import { updateServiceDetail } from "../content-actions";

type Props = { service: DentalService; detail?: ServiceDetailData };

export function ServiceDetailFormDialog({ service, detail }: Props) {
  const [open, setOpen] = useState(false);
  const [result, formAction, pending] = useActionState(updateServiceDetail, null);
  const initial = serviceDetailSchema.parse(detail ?? {
    eyebrow: service.category,
    title: service.name,
    introduction: service.description,
    highlights: [],
    priceSourceUrl: "",
    prices: [],
    steps: [],
    faqs: [],
  });

  return (
    <>
      <button className="inline-flex min-h-9 items-center gap-1 rounded-xl border border-brand-blue/30 bg-brand-blue-light px-3 text-xs font-bold text-brand-blue-dark transition hover:border-brand-blue hover:bg-brand-blue-dark hover:text-white" onClick={() => setOpen(true)} type="button">
        <span aria-hidden="true" className="material-symbols-outlined text-base">edit_note</span>
        Chi tiết
      </button>
      {open ? (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8" onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <section aria-labelledby="service-detail-title" aria-modal="true" className="admin-dialog-panel flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]" role="dialog">
            <header className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark">Quản lý nội dung trang chi tiết</p>
                <h2 className="mt-1 truncate text-lg font-bold text-text-primary" id="service-detail-title">{service.name}</h2>
              </div>
              <button aria-label="Đóng" className="ml-4 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-container-low text-text-secondary transition hover:bg-surface-container hover:text-text-primary" onClick={() => setOpen(false)} type="button">
                <span aria-hidden="true" className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form action={formAction} className="admin-dialog-form min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />
              <input name="serviceId" type="hidden" value={service.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label>Dòng giới thiệu nhỏ<input defaultValue={initial.eyebrow} maxLength={120} name="eyebrow" placeholder="Ví dụ: Nha khoa thẩm mỹ" /></label>
                <label>Tiêu đề chính *<input defaultValue={initial.title} maxLength={240} name="title" required /></label>
              </div>
              <label>Mô tả mở đầu *<textarea defaultValue={initial.introduction} maxLength={10000} name="introduction" required rows={4} /></label>

              <EditableRows label="Điểm nổi bật" name="highlights" columns={[{ key: "value", label: "Nội dung", multiline: true }]} initialRows={initial.highlights.map((value) => ({ value }))} />
              <section className="space-y-3 rounded-2xl border border-border-subtle p-4">
                <div><h3 className="text-sm font-bold text-text-primary">Bảng giá tham khảo</h3><p className="mt-1 text-xs text-text-secondary">Có thể để trống nếu dịch vụ chưa công khai giá.</p></div>
                <label>Liên kết bảng giá gốc (không bắt buộc)<input defaultValue={initial.priceSourceUrl} maxLength={2000} name="priceSourceUrl" placeholder="https://..." type="url" /></label>
                <EditableRows label="Các hạng mục" name="prices" columns={[{ key: "name", label: "Tên hạng mục" }, { key: "detail", label: "Ghi chú" }, { key: "price", label: "Giá tham khảo" }]} initialRows={initial.prices} />
              </section>
              <EditableRows label="Quy trình thực hiện" name="steps" columns={[{ key: "number", label: "Số thứ tự" }, { key: "title", label: "Tên bước" }, { key: "description", label: "Mô tả", multiline: true }]} initialRows={initial.steps} />
              <EditableRows label="Câu hỏi thường gặp" name="faqs" columns={[{ key: "question", label: "Câu hỏi", multiline: true }, { key: "answer", label: "Câu trả lời", multiline: true }]} initialRows={initial.faqs} />
              <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
                <button className="min-h-11 rounded-xl border border-border-subtle px-4 text-sm font-semibold text-text-secondary hover:bg-surface-container-low" onClick={() => setOpen(false)} type="button">Đóng</button>
                <button className="min-h-11 rounded-xl bg-brand-blue-dark px-5 text-sm font-bold text-white transition hover:bg-brand-blue-hover disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">{pending ? "Đang lưu…" : "Lưu chi tiết dịch vụ"}</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
