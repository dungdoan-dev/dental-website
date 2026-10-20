import { updateContactCta } from "../content-actions";
import { AdminActionForm } from "./AdminActionForm";
import type { ContactCtaSettings } from "@/features/content/schemas/contact-cta.schema";

export function ContactCtaForm({ settings: contactCtaSettings, clinics }: { settings: ContactCtaSettings; clinics: readonly { id: string; name: string; phone: string }[] }) {
  return (
    <section aria-labelledby="contact-cta-heading" className="space-y-4">
        <div><h2 className="text-xl font-bold text-text-primary" id="contact-cta-heading">Liên hệ nhanh &amp; khách nước ngoài</h2><p className="mt-1 text-sm text-text-secondary">Cấu hình Zalo riêng cho từng cơ sở và một liên kết Viber, WhatsApp dùng chung cho khách nước ngoài.</p></div>
      <AdminActionForm action={updateContactCta} className="grid gap-5 rounded-[7px] bg-card shadow-card p-5" submitLabel="Lưu CTA liên hệ">
        <label className="flex items-center gap-3 text-sm font-semibold text-text-primary"><input className="h-4 w-4 accent-brand-blue" defaultChecked={contactCtaSettings.showPhone} name="showPhone" type="checkbox" />Hiển thị nút gọi điện nhanh</label>
        <label className="block text-sm font-semibold text-text-primary">Liên kết Facebook<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.facebookUrl} name="facebookUrl" placeholder="https://facebook.com/..." type="url" /></label>
        <fieldset className="grid gap-4 rounded-xl border border-border-subtle p-4 md:grid-cols-2"><legend className="px-1 text-sm font-bold text-text-primary">Số điện thoại gọi nhanh</legend>{clinics.map((clinic) => <label className="block text-sm font-semibold text-text-primary" key={clinic.id}>{clinic.name}<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={clinic.phone} maxLength={100} name={`phone-${clinic.id}`} placeholder="1900 966 960" required type="tel" /></label>)}</fieldset>
        {clinics.map((clinic) => <label className="block text-sm font-semibold text-text-primary" key={clinic.id}>Liên kết Zalo — {clinic.name}<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.zaloLinks[clinic.id] ?? ""} name={`zaloUrl-${clinic.id}`} placeholder="https://zalo.me/..." type="url" /></label>)}
        <fieldset className="grid gap-4 rounded-xl border border-border-subtle p-4 md:grid-cols-2"><legend className="px-1 text-sm font-bold text-text-primary">Liên hệ cho khách nước ngoài</legend><label className="block text-sm font-semibold text-text-primary">Viber<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.viberUrl} name="viberUrl" placeholder="https://..." type="url" /></label><label className="block text-sm font-semibold text-text-primary">WhatsApp<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.whatsappUrl} name="whatsappUrl" placeholder="https://wa.me/..." type="url" /></label></fieldset>
        <p className="text-xs text-text-secondary">Để trống kênh không muốn hiển thị. Liên kết phải bắt đầu bằng https:// (ví dụ WhatsApp: https://wa.me/...).</p>
      </AdminActionForm>
    </section>
  );
}
