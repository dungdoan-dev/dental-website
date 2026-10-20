"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import { showMutationToast } from "./AdminToast";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  deleteService,
  deleteDoctor,
  deleteArticle,
  deleteFaq,
  deleteTestimonial,
  deleteHeroSlide,
} from "../actions";

function BaseDeleteButton({
  onDelete,
  name,
  label = "Xóa",
}: {
  onDelete: () => Promise<unknown>;
  name?: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  const [confirming, setConfirming] = useState(false);

  const runDelete = () => {
    startTransition(async () => {
      setResult(null);
      try {
        const response = await onDelete();
        if (response && typeof response === "object" && "success" in response) {
          const mutationResult = response as MutationResult;
          showMutationToast(mutationResult, "Đã xóa mục thành công.");
          setResult(mutationResult);
        } else {
          showMutationToast({ success: true }, "Đã xóa mục thành công.");
          setResult({ success: true });
        }
      } catch {
        const errorResult = { success: false as const, error: "Không thể xóa mục này. Vui lòng thử lại." };
        showMutationToast(errorResult, "Đã xóa mục thành công.");
        setResult(errorResult);
      }
    });
  };

  return (
    <div className="space-y-2">
    <button
      type="button"
      disabled={isPending}
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 rounded-xl border border-error-container bg-error-container/60 px-2.5 py-1 text-xs font-bold text-error transition hover:bg-error hover:text-white disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[15px]">delete</span>
      <span>{isPending ? "Đang xóa..." : label}</span>
    </button>
    <FormFeedback result={result?.success ? null : result} />
    <ConfirmDialog confirmLabel="Xóa" description="Thao tác này không thể hoàn tác." onConfirm={runDelete} onOpenChange={setConfirming} open={confirming} title={name ? `Xóa "${name}"?` : "Xóa mục này?"} />
    </div>
  );
}

export function DeleteServiceButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteService(id)} />;
}

export function DeleteDoctorButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteDoctor(id)} />;
}

export function DeleteArticleButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteArticle(id)} />;
}

export function DeleteFaqButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteFaq(id)} />;
}

export function DeleteTestimonialButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteTestimonial(id)} />;
}

export function DeleteHeroSlideButton({ id, name }: { id: string; name?: string }) {
  return <BaseDeleteButton name={name} onDelete={() => deleteHeroSlide(id)} />;
}
