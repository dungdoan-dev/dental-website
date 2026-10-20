"use client";

import { useAdminDialogClose } from "./AdminDialog";
import { Button } from "@/components/admin-ui/button";
import { LoaderCircle, Save } from "lucide-react";

// Must stay a direct child of the form so the actions remain visible while scrolling.
export function DialogFooter({ onCancel, isPending, submitLabel, cancelLabel = "Hủy" }: {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  cancelLabel?: string;
}) {
  const requestClose = useAdminDialogClose();
  return (
    <div className="admin-dialog-footer flex items-center justify-end gap-3">
      <Button className="min-h-11 px-5" disabled={isPending} onClick={requestClose ?? onCancel} type="button" variant="outline">{cancelLabel}</Button>
      <Button aria-busy={isPending} className="min-h-11 px-5" disabled={isPending} type="submit">
        {isPending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
        {isPending ? "Đang lưu…" : submitLabel}
      </Button>
    </div>
  );
}
