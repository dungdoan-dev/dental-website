"use client";

import { useActionState, type ReactNode } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import { useMutationToast } from "./AdminToast";
import { buttonVariants } from "@/components/admin-ui/button";
import { LoaderCircle, Save } from "lucide-react";

type AdminFormAction = (state: MutationResult | null, formData: FormData) => Promise<MutationResult>;

export function AdminActionForm({ action, children, className = "", submitLabel, submitClassName = `${buttonVariants()} min-h-11 px-5` }: {
  action: AdminFormAction;
  children: ReactNode;
  className?: string;
  submitLabel: string;
  submitClassName?: string;
}) {
  const [result, formAction, pending] = useActionState(action, null);
  useMutationToast(result, "Đã lưu thay đổi.");
  return <form action={formAction} className={`admin-inline-form ${className}`}>{children}{result ? <div className="admin-form-feedback"><FormFeedback result={result} /></div> : null}<div className="admin-inline-footer"><button aria-busy={pending} className={submitClassName} disabled={pending} type="submit">{pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}{pending ? "Đang lưu…" : submitLabel}</button></div></form>;
}
