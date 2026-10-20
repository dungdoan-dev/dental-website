"use client";

import { useAdminDialogClose } from "./AdminDialog";

// Must stay a direct child of the form: globals.css makes `.admin-dialog-form > div:last-child` sticky.
export function DialogFooter({ onCancel, isPending, submitLabel, cancelLabel = "Hủy" }: {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  cancelLabel?: string;
}) {
  const requestClose = useAdminDialogClose();
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border-subtle/60 pt-4">
      <button className="min-h-11 rounded-xl border border-border-subtle bg-white px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-brand-blue" onClick={requestClose ?? onCancel} type="button">{cancelLabel}</button>
      <button aria-busy={isPending} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-blue-dark px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-wait disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Đang lưu…</> : submitLabel}
      </button>
    </div>
  );
}
