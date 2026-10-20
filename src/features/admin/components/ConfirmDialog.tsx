"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";

// Confirmation modal (replaces window.confirm). Confirm closes it, then runs onConfirm.
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Xác nhận", cancelLabel = "Hủy", onConfirm }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="admin-dialog-overlay fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm" />
        <AlertDialog.Content className="admin-confirm-panel fixed left-1/2 top-1/2 z-[61] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border-subtle bg-white p-6 shadow-2xl outline-none">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-error-container text-error"><span className="material-symbols-outlined text-[22px]">error</span></span>
            <div className="min-w-0">
              <AlertDialog.Title className="text-base font-bold text-text-primary">{title}</AlertDialog.Title>
              {description ? <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</AlertDialog.Description> : null}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className="min-h-11 rounded-xl border border-border-subtle bg-white px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-brand-blue">{cancelLabel}</AlertDialog.Cancel>
            <AlertDialog.Action className="min-h-11 rounded-xl bg-error px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error" onClick={onConfirm}>{confirmLabel}</AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
