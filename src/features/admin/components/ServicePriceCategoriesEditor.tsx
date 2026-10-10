"use client";

import { useState } from "react";
import { serviceGroups } from "@/features/services/data/service-filter.data";

type Row = { category: string; label: string; price: string };

export function ServicePriceCategoriesEditor({ initialRows }: { initialRows: readonly Row[] }) {
  const [rows, setRows] = useState<Row[]>(() => initialRows.map((row) => ({ ...row })));
  function update(index: number, key: keyof Row, value: string) {
    setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row));
  }
  return <div className="space-y-3">
    <input name="rows" type="hidden" value={JSON.stringify(rows)} />
    <div className="overflow-x-auto rounded-xl border border-border-subtle"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-surface-container-low text-xs text-text-secondary"><tr><th className="px-3 py-3">Danh mục dịch vụ</th><th className="px-3 py-3">Tên hiển thị</th><th className="px-3 py-3">Mức giá / nội dung</th><th className="px-3 py-3">Thao tác</th></tr></thead><tbody className="divide-y divide-border-subtle">
      {rows.map((row, index) => <tr key={index}>
        <td className="p-2"><select aria-label={`Danh mục dòng ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle bg-white px-2 text-sm" onChange={(event) => update(index, "category", event.target.value)} value={row.category}>{serviceGroups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}</select></td>
        <td className="p-2"><input aria-label={`Tên hiển thị dòng ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle px-3 py-2" maxLength={160} onChange={(event) => update(index, "label", event.target.value)} required value={row.label} /></td>
        <td className="p-2"><input aria-label={`Mức giá dòng ${index + 1}`} className="min-h-10 w-full rounded-lg border border-border-subtle px-3 py-2" maxLength={200} onChange={(event) => update(index, "price", event.target.value)} value={row.price} /></td>
        <td className="p-2"><button aria-label={`Xóa dòng ${index + 1}`} className="min-h-10 rounded-lg px-3 text-xs font-semibold text-error hover:bg-red-50" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} type="button">Xóa</button></td>
      </tr>)}
      {!rows.length ? <tr><td className="p-6 text-center text-text-secondary" colSpan={4}>Chưa có danh mục giá.</td></tr> : null}
    </tbody></table></div>
    <div className="flex items-center justify-between"><span className="text-xs text-text-secondary">{rows.length}/20 danh mục</span><button className="min-h-10 rounded-lg border border-border-subtle px-4 text-sm font-semibold text-brand-blue-dark hover:bg-brand-blue-light disabled:opacity-50" disabled={rows.length >= 20} onClick={() => setRows((current) => [...current, { category: serviceGroups[0].value, label: serviceGroups[0].label, price: "Liên hệ tư vấn" }])} type="button">+ Thêm danh mục</button></div>
  </div>;
}
