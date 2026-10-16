"use client";

import { useState, useTransition, type ReactNode } from "react";
import { showAdminToast } from "./AdminToast";

// Lists only ship summary rows; the full record is fetched when the admin clicks the button.
export function LazyEditDialog<T>({ load, buttonLabel, buttonClassName, children }: {
  load: () => Promise<T>;
  buttonLabel: string;
  buttonClassName: string;
  children: (record: T, close: () => void) => ReactNode;
}) {
  const [record, setRecord] = useState<T | null>(null);
  const [isLoading, startTransition] = useTransition();

  function open() {
    startTransition(async () => {
      try { setRecord(await load()); }
      catch { showAdminToast("error", "Không thể tải dữ liệu. Vui lòng thử lại."); }
    });
  }

  return (
    <>
      <button className={buttonClassName} disabled={isLoading} onClick={open} type="button">{isLoading ? "Đang tải…" : buttonLabel}</button>
      {record ? children(record, () => setRecord(null)) : null}
    </>
  );
}
