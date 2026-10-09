"use client";

import { useState, useTransition } from "react";
import { upsertFaq } from "../actions";
import { showAdminToast } from "./AdminToast";

export function FaqFormDialog({
  faq,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  faq?: { id: string; question: string; answer: string; sortOrder: number };
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    id: faq?.id,
    question: faq?.question ?? "",
    answer: faq?.answer ?? "",
    sortOrder: faq?.sortOrder ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await upsertFaq(formData);
        if (!result.success) throw new Error("FAQ save failed");
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

      {isOpen && (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8">
          <div className="admin-dialog-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle/60 px-5 pb-4 pt-5 text-left sm:px-7 sm:pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {faq ? "Sửa Câu Hỏi FAQ" : "Thêm Câu Hỏi Mới"}
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
                  {isPending ? "Đang lưu..." : "Lưu Câu Hỏi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
