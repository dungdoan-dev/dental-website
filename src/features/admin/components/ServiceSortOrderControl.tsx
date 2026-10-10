"use client";

import { useState, useTransition } from "react";
import { updateServiceSortOrder } from "../actions";
import { showAdminToast } from "./AdminToast";

export function ServiceSortOrderControl({ id, initialValue }: { id: string; initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();
  function save() {
    startTransition(async () => {
      const result = await updateServiceSortOrder({ id, sortOrder: value });
      showAdminToast(result.success ? "success" : "error", result.success ? "Đã cập nhật thứ tự dịch vụ." : result.error || "Không thể cập nhật thứ tự.");
    });
  }
  return <div className="flex items-center gap-2"><input aria-label="Thứ tự dịch vụ" className="w-20 rounded-lg border border-border-subtle px-2 py-2 text-center" min={0} max={99999} onChange={(event) => setValue(Number(event.target.value))} type="number" value={value} /><button className="rounded-lg bg-brand-blue-dark px-3 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={pending || value === initialValue} onClick={save} type="button">{pending ? "Đang lưu" : "Lưu"}</button></div>;
}
