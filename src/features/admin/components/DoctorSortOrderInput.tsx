"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateDoctorSortOrder } from "../actions";

export function DoctorSortOrderInput({ id, sortOrder }: { id: string; sortOrder: number }) {
  const [value, setValue] = useState(String(sortOrder));
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await updateDoctorSortOrder({ id, sortOrder: Number(value) });
      setIsError(!result.success);
      setMessage(result.success ? "Đã lưu" : result.error ?? "Không thể lưu");
    });
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={`doctor-sort-${id}`}>Thứ tự hiển thị</label>
      <input
        className="w-20 rounded-lg border border-border-subtle bg-white px-2.5 py-2 text-center text-sm tabular-nums text-text-primary focus:border-brand-blue-dark focus:outline-none"
        id={`doctor-sort-${id}`}
        max={99999}
        min={0}
        onChange={(event) => setValue(event.target.value)}
        required
        step={1}
        type="number"
        value={value}
      />
      <button
        className="rounded-lg bg-brand-blue-dark px-3 py-2 text-xs font-semibold text-white hover:bg-brand-blue disabled:cursor-wait disabled:opacity-60"
        disabled={isPending || Number(value) === sortOrder}
        type="submit"
      >
        {isPending ? "Đang lưu" : "Lưu"}
      </button>
      <span aria-live="polite" className={`text-xs ${isError ? "text-red-600" : "text-green-700"}`}>
        {message}
      </span>
    </form>
  );
}
