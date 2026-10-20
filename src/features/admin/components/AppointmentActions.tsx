"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type { AppointmentStatus } from "@/features/appointments/types/appointment.type";
import { deleteAppointment, updateAppointmentStatus } from "../actions";
import { showMutationToast } from "./AdminToast";
import { ConfirmDialog } from "./ConfirmDialog";

export function AppointmentActions({
  id,
  currentStatus,
  name,
}: {
  id: string;
  currentStatus: AppointmentStatus;
  name?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleStatusChange = (status: AppointmentStatus) => {
    startTransition(async () => {
      setResult(null);
      try {
        const response = await updateAppointmentStatus(id, status);
        showMutationToast(response, "Đã cập nhật trạng thái lịch hẹn.");
        setResult(response);
      } catch {
        const errorResult = { success: false as const, error: "Không thể cập nhật lịch hẹn. Vui lòng thử lại." };
        showMutationToast(errorResult, "Đã cập nhật trạng thái lịch hẹn.");
        setResult(errorResult);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      setResult(null);
      try {
        const response = await deleteAppointment(id);
        showMutationToast(response, "Đã xóa lịch hẹn.");
        setResult(response);
      } catch {
        const errorResult = { success: false as const, error: "Không thể xóa lịch hẹn. Vui lòng thử lại." };
        showMutationToast(errorResult, "Đã xóa lịch hẹn.");
        setResult(errorResult);
      }
    });
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
        onClick={() => setConfirmingDelete(true)}
        className="p-1.5 rounded-xl text-text-secondary hover:text-error hover:bg-error-container transition-colors disabled:opacity-50"
        title="Xóa lịch hẹn"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div><div className="mt-2 text-left"><FormFeedback result={result} /></div>
      <ConfirmDialog confirmLabel="Xóa lịch hẹn" description="Lịch hẹn sẽ bị xóa khỏi hệ thống và không thể khôi phục." onConfirm={handleDelete} onOpenChange={setConfirmingDelete} open={confirmingDelete} title={name ? `Xóa lịch hẹn của "${name}"?` : "Xóa lịch hẹn này?"} />
    </div>
  );
}
