"use client";

import { useActionState, type ReactNode } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import { useMutationToast } from "./AdminToast";

type AdminFormAction = (state: MutationResult | null, formData: FormData) => Promise<MutationResult>;

export function AdminActionForm({ action, children, className = "", submitLabel, submitClassName = "inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-blue-dark px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-wait disabled:opacity-60" }: {
  action: AdminFormAction;
  children: ReactNode;
  className?: string;
  submitLabel: string;
  submitClassName?: string;
}) {
  const [result, formAction, pending] = useActionState(action, null);
  useMutationToast(result, "Đã lưu thay đổi.");
  return <form action={formAction} className={`admin-inline-form ${className}`}>{children}<div className="mt-3"><FormFeedback result={result} /></div><div className="pt-3"><button className={submitClassName} disabled={pending} type="submit">{pending ? <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Đang lưu…</> : submitLabel}</button></div></form>;
}
