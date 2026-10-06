"use client";

import { useAppointmentDialog } from "@/features/appointments/components/AppointmentDialogProvider";

type AppointmentButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onOpen?: () => void;
};

export function AppointmentButton({ children = "ĐẶT LỊCH HẸN", className = "", onOpen }: AppointmentButtonProps) {
  const openDialog = useAppointmentDialog();
  return <button className={`inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-brand-blue-dark hover:shadow-md ${className}`} onClick={() => { onOpen?.(); openDialog(); }} type="button">{children}</button>;
}
