"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ContactAppointmentForm } from "./ContactAppointmentForm";

type ServiceOption = { id: string; name: string };
type AppointmentDialogProviderProps = { children: ReactNode; services: readonly ServiceOption[] };

const AppointmentDialogContext = createContext<(() => void) | null>(null);

export function useAppointmentDialog(): () => void {
  const openDialog = useContext(AppointmentDialogContext);
  if (!openDialog) throw new Error("AppointmentButton phải nằm trong AppointmentDialogProvider");
  return openDialog;
}

export function AppointmentDialogProvider({ children, services }: AppointmentDialogProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openDialog(): void {
    if (dialogRef.current?.open) return;
    setIsOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <AppointmentDialogContext.Provider value={openDialog}>
      {children}
      <dialog
        aria-label="Đặt lịch hẹn"
        className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-2rem)] w-[min(42rem,calc(100vw-2rem))] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border-0 bg-transparent p-0 shadow-2xl backdrop:bg-slate-950/60"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onClose={() => setIsOpen(false)}
        ref={dialogRef}
      >
        <div className="relative">
          <button aria-label="Đóng form đặt lịch" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-text-primary transition hover:bg-border-subtle" onClick={() => dialogRef.current?.close()} type="button"><Icon className="h-5 w-5" name="close" /></button>
          {isOpen ? <ContactAppointmentForm services={services} /> : null}
        </div>
      </dialog>
    </AppointmentDialogContext.Provider>
  );
}
