import type { AppointmentStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; dot: string }
> = {
  pending: {
    label: "Chờ duyệt",
    bg: "bg-[#ffdcbf] text-[#854c00]",
    dot: "bg-[#a86100]",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-brand-blue-light text-brand-blue-dark",
    dot: "bg-brand-blue-dark",
  },
  completed: {
    label: "Hoàn thành",
    bg: "bg-brand-green-light text-brand-green-dark",
    dot: "bg-brand-green",
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-[#ffdad6] text-[#ba1a1a]",
    dot: "bg-[#ba1a1a]",
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${config.bg}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
