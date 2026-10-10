"use client";

import { useState } from "react";

type PriceRow = { name: string; detail: string; price: string };

export function PriceTableEditor({ initialRows }: { initialRows: readonly PriceRow[] }) {
  const [rows, setRows] = useState<PriceRow[]>(() => initialRows.map((row) => ({ ...row })));

  function updateRow(index: number, field: keyof PriceRow, value: string) {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));
  }

  return (
    <div className="space-y-3">
      <input name="prices" type="hidden" value={JSON.stringify(rows)} />
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-surface-container-low text-xs font-semibold text-text-secondary">
            <tr><th className="px-3 py-3" scope="col">Tên hạng mục</th><th className="px-3 py-3" scope="col">Ghi chú</th><th className="w-48 px-3 py-3" scope="col">Giá tham khảo</th><th className="w-24 px-3 py-3 text-center" scope="col">Thao tác</th></tr>
          </thead>
          <tbody className="divide-y divide-border-subtle bg-white">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="p-2"><input aria-label={`Tên hạng mục ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary" maxLength={240} onChange={(event) => updateRow(index, "name", event.target.value)} required value={row.name} /></td>
                <td className="p-2"><input aria-label={`Ghi chú hạng mục ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary" maxLength={2000} onChange={(event) => updateRow(index, "detail", event.target.value)} value={row.detail} /></td>
                <td className="p-2"><input aria-label={`Giá tham khảo hạng mục ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary" maxLength={200} onChange={(event) => updateRow(index, "price", event.target.value)} value={row.price} /></td>
                <td className="p-2 text-center"><button aria-label={`Xóa hạng mục ${index + 1}`} className="min-h-10 rounded-lg px-3 text-xs font-semibold text-error hover:bg-red-50" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} type="button">Xóa</button></td>
              </tr>
            ))}
            {!rows.length ? <tr><td className="px-4 py-8 text-center text-sm text-text-secondary" colSpan={4}>Chưa có hạng mục giá. Nhấn “Thêm dòng giá” để bắt đầu.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-secondary">{rows.length}/100 hạng mục</p>
        <button className="min-h-10 rounded-lg border border-border-subtle px-4 text-sm font-semibold text-brand-blue-dark transition hover:bg-brand-blue-light disabled:cursor-not-allowed disabled:opacity-50" disabled={rows.length >= 100} onClick={() => setRows((current) => [...current, { name: "", detail: "", price: "" }])} type="button">+ Thêm dòng giá</button>
      </div>
    </div>
  );
}
