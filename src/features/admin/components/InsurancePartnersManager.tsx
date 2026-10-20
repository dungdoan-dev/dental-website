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
  return <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
    <div className="border-b border-border-subtle bg-surface-container-low/50 px-6 py-4">
      <h2 className="text-base font-bold text-text-primary">Đối tác bảo hiểm &amp; bảo lãnh viện phí</h2>
      <p className="mt-1 text-xs text-text-secondary">Trang chủ hiển thị hai hàng logo chuyển động. Đối tác chưa có logo sẽ không xuất hiện.</p>
    </div>
    <div className="divide-y divide-slate-100">
      {partners.map((partner) => <AdminActionForm action={updateInsurancePartner} className="space-y-5 p-5 sm:p-6" key={partner.code} submitLabel="Lưu đối tác">
        <input name="code" type="hidden" value={partner.code} />
        <input name="description" type="hidden" value={partner.description} />
        <input name="accent" type="hidden" value={partner.accent} />
        <div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-text-primary">{partner.name}</h3><span className="rounded-md border border-border-subtle bg-background-secondary px-2 py-1 font-mono text-[11px] text-text-secondary">{partner.code}</span></div>
        <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="min-w-0"><ImageUploadField aspect={2 / 1} fit="contain" label="Logo đối tác" name="logoSrc" defaultValue={partner.logoSrc ?? ""} /></div>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2">
            <label>Tên đối tác *<input defaultValue={partner.name} maxLength={200} name="name" required /><span className="text-xs font-normal text-text-secondary">Dùng làm mô tả logo cho trình đọc màn hình, không hiện thành dòng chữ trên trang chủ.</span></label>
            <label>Thứ tự hiển thị *<input defaultValue={partner.sortOrder} max={9999} min={0} name="sortOrder" required type="number" /><span className="text-xs font-normal text-text-secondary">Số nhỏ hiển thị trước.</span></label>
          </div>
        </div>
      </AdminActionForm>)}
      {partners.length === 0 ? <p className="p-5 text-sm text-text-secondary">Chưa có đối tác bảo hiểm trong database.</p> : null}
    </div>
  </section>;
}
