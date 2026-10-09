"use client";

import { useEffect, useRef, useState } from "react";
import type { MutationResult } from "../services/mutation";

type ToastVariant = "success" | "error";
type ToastItem = { id: number; variant: ToastVariant; message: string };
const eventName = "admin:toast";

export function showAdminToast(variant: ToastVariant, message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName, { detail: { variant, message } }));
}

export function showMutationToast(result: MutationResult, successMessage: string) {
  showAdminToast(result.success ? "success" : "error", result.success ? successMessage : result.error);
}

export function useMutationToast(result: MutationResult | null, successMessage: string) {
  const lastResult = useRef<MutationResult | null>(null);
  useEffect(() => {
    if (!result || result === lastResult.current) return;
    lastResult.current = result;
    showMutationToast(result, successMessage);
  }, [result, successMessage]);
}

export function AdminToastViewport() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let nextId = 0;
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ variant?: ToastVariant; message?: string }>).detail;
      if (!detail?.message || (detail.variant !== "success" && detail.variant !== "error")) return;
      const id = ++nextId;
      setToasts((current) => [...current.slice(-3), { id, variant: detail.variant!, message: detail.message! }]);
      window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 5000);
    };
    window.addEventListener(eventName, onToast);
    return () => window.removeEventListener(eventName, onToast);
  }, []);

  return (
    <div aria-label="Thông báo quản trị" aria-live="polite" className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${toast.variant === "success" ? "border-green-200 bg-white text-green-800" : "border-red-200 bg-white text-red-800"}`} key={toast.id} role={toast.variant === "error" ? "alert" : "status"}>
          <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${toast.variant === "success" ? "text-green-600" : "text-red-600"}`}>{toast.variant === "success" ? "check_circle" : "error"}</span>
          <p className="min-w-0 flex-1 leading-5">{toast.message}</p>
          <button aria-label="Đóng thông báo" className="-mr-1 -mt-1 rounded p-1 text-current/70 hover:bg-black/5" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} type="button">×</button>
        </div>
      ))}
    </div>
  );
}
