"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type DatePickerFieldProps = {
  id: string;
  errorId?: string;
  invalid?: boolean;
  compact?: boolean;
};

export function DatePickerField({ id, errorId, invalid = false, compact = false }: DatePickerFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState("");
  const [year, month, day] = date.split("-");
  const displayDate = year && month && day ? `${day}/${month}/${year}` : "dd/mm/yyyy";

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const resetDate = () => setDate("");
    form?.addEventListener("reset", resetDate);
    return () => form?.removeEventListener("reset", resetDate);
  }, []);

  return (
    <div className={`relative flex min-w-0 items-center justify-between rounded-xl border border-border-subtle bg-background-secondary text-text-primary transition focus-within:border-brand-blue focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-blue/20 ${compact ? "mt-0.5 h-11 px-3 text-base sm:text-sm" : "mt-1.5 h-[50px] px-4 text-base"}`} ref={containerRef}>
      <span aria-hidden="true" className={date ? "" : "text-text-secondary"}>{displayDate}</span>
      <Icon className="h-5 w-5 text-text-secondary" name="calendar" />
      <input
        aria-describedby={errorId}
        aria-invalid={invalid}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        id={id}
        lang="vi-VN"
        name="appointmentDay"
        onChange={(event) => setDate(event.currentTarget.value)}
        onClick={(event) => event.currentTarget.showPicker?.()}
        required
        type="date"
        value={date}
      />
    </div>
  );
}
