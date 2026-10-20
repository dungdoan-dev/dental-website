"use client";

import { useState, useTransition } from "react";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
import { upsertFaq } from "../actions";
import { showAdminToast } from "./AdminToast";

export function FaqFormDialog({
  faq,
  nextSortOrder = 0,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  faq?: { id: string; question: string; answer: string; sortOrder: number };
  nextSortOrder?: number;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    id: faq?.id,
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    sortOrder: faq?.sortOrder ?? nextSortOrder,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await upsertFaq(formData);
        if (!result.success) {
          showAdminToast("error", result.error);
          return;
        }
        showAdminToast("success", faq ? "Đã cập nhật câu hỏi." : "Đã thêm câu hỏi.");
        setIsOpen(false);
      } catch {
        showAdminToast("error", "Không thể lưu câu hỏi. Vui lòng thử lại.");
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

      <AdminDialog icon="help" onOpenChange={(open) => { if (!open) (() => setIsOpen(false))(); }} open={isOpen} size="md" title={faq ? "Sửa Câu Hỏi FAQ" : "Thêm Câu Hỏi Mới"}>
            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm text-left sm:px-7">
              <div>
                <label className="block font-semibold text-text-primary mb-1">Câu hỏi *</label>
                <input
                  required
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Ví dụ: Trồng răng Implant có đau không?"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Câu trả lời chuyên môn *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none leading-relaxed"
                  placeholder="Nội dung giải đáp thắc mắc chi tiết..."
                />
              </div>

              <label className="block font-semibold text-text-primary">Thứ tự hiển thị
                <input className="mt-1 w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 font-normal text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none" min={0} name="sortOrder" onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} type="number" value={formData.sortOrder} />
              </label>

              <DialogFooter isPending={isPending} onCancel={() => setIsOpen(false)} submitLabel="Lưu Câu Hỏi" />
            </form>
      </AdminDialog>
    </>
  );
}
