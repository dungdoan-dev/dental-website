import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 ${className}`}
        id={inputId}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
