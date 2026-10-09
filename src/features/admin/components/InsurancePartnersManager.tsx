import { updateInsurancePartner } from "../content-actions";
import { AdminActionForm } from "./AdminActionForm";
import { ImageUploadField } from "./ImageUploadField";

export type InsurancePartnerRecord = {
  code: string;
  name: string;
  description: string;
  accent: string;
  logoSrc: string | null;
  sortOrder: number;
};

export function InsurancePartnersManager({ partners }: { partners: readonly InsurancePartnerRecord[] }) {
  return <section className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
    <div className="border-b border-border-subtle bg-surface-container-low/50 px-6 py-4">
      <h2 className="text-base font-bold text-text-primary">Đối tác bảo hiểm &amp; bảo lãnh viện phí</h2>
      <p className="mt-1 text-xs text-text-secondary">Cấu hình logo, tên hiển thị và thứ tự ở khu vực bảo hiểm trang chủ.</p>
    </div>
    <div className="divide-y divide-slate-100">
      {partners.map((partner) => <AdminActionForm action={updateInsurancePartner} className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-6 xl:items-end" key={partner.code} submitClassName="min-h-11 rounded-lg bg-brand-blue-dark px-4 text-sm font-bold text-white disabled:opacity-50" submitLabel="Lưu">
        <input name="code" type="hidden" value={partner.code} />
        <div className="text-xs"><p className="font-bold text-text-primary">{partner.name}</p><p className="mt-1 font-mono text-text-secondary">{partner.code}</p></div>
        <label className="text-xs font-semibold text-text-secondary">Tên hiển thị<input className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-normal text-text-primary" defaultValue={partner.name} name="name" required /></label>
        <label className="text-xs font-semibold text-text-secondary">Mô tả<input className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-normal text-text-primary" defaultValue={partner.description} name="description" required /></label>
        <div><ImageUploadField aspect={2 / 1} label="Logo đối tác" name="logoSrc" defaultValue={partner.logoSrc ?? ""} /></div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-text-secondary">Màu nhấn<select className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-2 py-2 text-sm font-normal text-text-primary" defaultValue={partner.accent} name="accent"><option value="blue">Xanh dương</option><option value="green">Xanh lá</option></select></label>
          <label className="text-xs font-semibold text-text-secondary">Thứ tự<input className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-normal text-text-primary" defaultValue={partner.sortOrder} min={0} name="sortOrder" required type="number" /></label>
        </div>
      </AdminActionForm>)}
      {partners.length === 0 ? <p className="p-5 text-sm text-text-secondary">Chưa có đối tác bảo hiểm trong database.</p> : null}
    </div>
  </section>;
}
