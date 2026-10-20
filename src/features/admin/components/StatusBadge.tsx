import type { AppointmentStatus } from "@/features/appointments/types/appointment.type";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; dot: string }
> = {
  pending: {
    label: "Chờ duyệt",
    bg: "bg-amber-500/10 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Hoàn thành",
    bg: "bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

export function StatusBadge({
  status,
}: {
  status: AppointmentStatus | string;
}) {
  const config = STATUS_CONFIG[status as AppointmentStatus] ?? {
    label: status,
    bg: "bg-surface-variant text-on-surface-variant",
    dot: "bg-outline",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
