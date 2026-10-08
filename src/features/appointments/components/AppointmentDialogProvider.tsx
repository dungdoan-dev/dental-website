"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { AppointmentClinicOption } from "../types/appointment.type";
import { AppointmentForm } from "./AppointmentForm";

type ServiceOption = { id: string; name: string };
type AppointmentDialogProviderProps = { children: ReactNode; services: readonly ServiceOption[]; clinics: readonly AppointmentClinicOption[] };

const AppointmentDialogContext = createContext<(() => void) | null>(null);

export function useAppointmentDialog(): () => void {
  const openDialog = useContext(AppointmentDialogContext);
  if (!openDialog) throw new Error("AppointmentButton phải nằm trong AppointmentDialogProvider");
  return openDialog;
}

export function AppointmentDialogProvider({ children, services, clinics }: AppointmentDialogProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function openDialog(): void {
    if (isOpen || dialogRef.current?.open) return;
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    const focusTarget = window.matchMedia("(pointer: coarse)").matches
      ? dialog.querySelector<HTMLElement>("h2")
      : dialog.querySelector<HTMLInputElement>('input[name="name"]');
    focusTarget?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      const visibleTrigger = trigger?.isConnected && trigger.getClientRects().length > 0
        ? trigger
        : Array.from(document.querySelectorAll<HTMLElement>("[data-appointment-trigger]")).find((button) => button.getClientRects().length > 0);
      visibleTrigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <AppointmentDialogContext.Provider value={openDialog}>
      {children}
      <dialog
        aria-label="Đặt lịch hẹn"
        className="fixed left-1/2 top-1/2 m-0 max-h-[calc(100dvh-1rem)] w-[min(36rem,calc(100vw-1rem))] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-x-hidden overflow-y-auto rounded-2xl border-0 bg-transparent p-0 shadow-2xl backdrop:bg-slate-950/60"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        onClose={() => setIsOpen(false)}
        ref={dialogRef}
      >
        <div className="relative">
          <button aria-label="Đóng form đặt lịch" className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-text-primary transition hover:bg-border-subtle" onClick={() => dialogRef.current?.close()} type="button"><Icon className="h-5 w-5" name="close" /></button>
          {isOpen ? <AppointmentForm clinics={clinics} compact services={services} /> : null}
        </div>
      </dialog>
    </AppointmentDialogContext.Provider>
  );
}
