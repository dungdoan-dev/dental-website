"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { AppointmentStatus } from "@prisma/client";
import { deleteAppointment, updateAppointmentStatus } from "../actions";

export function AppointmentActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: AppointmentStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);

  const handleStatusChange = (status: AppointmentStatus) => {
    startTransition(async () => {
      setResult(null);
      try { setResult(await updateAppointmentStatus(id, status)); }
      catch { setResult({ success: false, error: "Không thể cập nhật lịch hẹn. Vui lòng thử lại." }); }
    });
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch hẹn này khỏi hệ thống?")) {
      startTransition(async () => {
        setResult(null);
        try { setResult(await deleteAppointment(id)); }
        catch { setResult({ success: false, error: "Không thể xóa lịch hẹn. Vui lòng thử lại." }); }
      });
    }
  };

  return (
    <div><div className="flex items-center justify-end gap-2">
      <select
        aria-label="Trạng thái lịch hẹn"
        value={currentStatus}
        disabled={isPending}
        onChange={(e) =>
          handleStatusChange(e.target.value as AppointmentStatus)
        }
        className="rounded-xl border border-border-subtle bg-background-secondary px-3 py-1.5 text-xs font-semibold text-text-primary transition focus:border-brand-blue-dark focus:outline-none cursor-pointer"
      >
        <option value="pending">Chờ duyệt</option>
        <option value="confirmed">Đã xác nhận</option>
        <option value="completed">Hoàn thành</option>
        <option value="cancelled">Hủy lịch</option>
      </select>

      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="p-1.5 rounded-xl text-text-secondary hover:text-error hover:bg-error-container transition-colors disabled:opacity-50"
        title="Xóa lịch hẹn"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div><div className="mt-2 text-left"><FormFeedback result={result} /></div></div>
  );
}
