"use client";

import { useActionState, type ReactNode } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";

type AdminFormAction = (state: MutationResult | null, formData: FormData) => Promise<MutationResult>;

export function AdminActionForm({ action, children, className = "", submitLabel, submitClassName = "rounded-xl bg-brand-blue-dark px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" }: {
  action: AdminFormAction;
  children: ReactNode;
  className?: string;
  submitLabel: string;
  submitClassName?: string;
}) {
  const [result, formAction, pending] = useActionState(action, null);
  return <form action={formAction} className={`admin-inline-form ${className}`}>{children}<div className="mt-3"><FormFeedback result={result} /></div><div className="pt-3"><button className={submitClassName} disabled={pending} type="submit">{pending ? "Đang lưu…" : submitLabel}</button></div></form>;
}
