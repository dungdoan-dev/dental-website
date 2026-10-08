"use client";

import { useState } from "react";

type Row = Record<string, string>;
type Column = { key: string; label: string; multiline?: boolean };

export function EditableRows({ label, name, columns, initialRows = [], value, onChange }: {
  label: string;
  name?: string;
  columns: readonly Column[];
  initialRows?: readonly Row[];
  value?: readonly Row[];
  onChange?: (rows: Row[]) => void;
}) {
  const [localRows, setLocalRows] = useState<Row[]>(() => initialRows.map((row) => ({ ...row })));
  const rows = value ?? localRows;
  function change(next: Row[]) { if (onChange) onChange(next); else setLocalRows(next); }
  return (
    <fieldset className="min-w-0 space-y-3 rounded-xl border border-border-subtle p-3">
      <legend className="px-1 text-sm font-semibold text-text-primary">{label}</legend>
      {name && <input name={name} type="hidden" value={JSON.stringify(rows)} />}
      {rows.map((row, index) => (
        <div className="space-y-3 rounded-lg bg-background-secondary p-3" key={index}>
          <div className="flex items-center justify-between gap-3"><span className="text-xs text-text-secondary">Mục {index + 1}</span><button aria-label={`Xóa mục ${index + 1} trong ${label}`} className="min-h-11 px-3 text-xs font-semibold text-error" onClick={() => change(rows.filter((_, i) => i !== index))} type="button">Xóa mục</button></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {columns.map((column) => {
              const props = { value: row[column.key] ?? "", maxLength: 2000, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(rows.map((item, i) => i === index ? { ...item, [column.key]: event.target.value } : { ...item })), className: "mt-1 min-h-11 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-text-primary" };
              return <label className="block text-xs font-semibold text-text-secondary" key={column.key}>{column.label}{column.multiline ? <textarea {...props} rows={3} /> : <input {...props} />}</label>;
            })}
          </div>
        </div>
      ))}
      {!rows.length && <p className="text-xs text-text-secondary">Chưa có mục nào.</p>}
      <button className="min-h-11 rounded-lg border border-border-subtle px-4 text-sm font-semibold text-brand-blue-dark disabled:opacity-50" disabled={rows.length >= 50} onClick={() => change([...rows, Object.fromEntries(columns.map((column) => [column.key, ""]))])} type="button">+ Thêm mục</button>
    </fieldset>
  );
}
