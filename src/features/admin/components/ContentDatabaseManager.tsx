import { updateContactCta, updateStructuredSiteContent } from "../content-actions";
import type { ContactCtaSettings } from "@/features/content/schemas/contact-cta.schema";
import type { AboutPageData } from "@/features/about/schemas/about.schema";
import type { ImplantDetailData } from "@/features/services/schemas/implant-detail.schema";
import { EditableRows } from "./EditableRows";
import { AdminActionForm } from "./AdminActionForm";

export type SiteContentRecord =
  | { key: "about_page"; content: AboutPageData }
  | { key: "implant_detail"; content: ImplantDetailData };

const inputClass = "mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm font-normal text-text-primary outline-none focus:border-brand-blue";

function TextField({ label, name, value, required = false }: { label: string; name: string; value: string; required?: boolean }) {
  return <label className="block text-xs font-semibold text-text-secondary">{label}<input className={inputClass} defaultValue={value} name={name} required={required} /></label>;
}

function TextAreaField({ label, name, value, hint }: { label: string; name: string; value: string; hint?: string }) {
  return <label className="block text-xs font-semibold text-text-secondary">{label}{hint ? <span className="ml-1 font-normal">({hint})</span> : null}<textarea className={`${inputClass} min-h-20 leading-relaxed`} defaultValue={value} name={name} /></label>;
}

function EditorSection({ title, children, columns = "" }: { title: string; children: React.ReactNode; columns?: string }) {
  return <fieldset className="rounded-xl border border-border-subtle p-4"><legend className="px-1 text-sm font-bold text-text-primary">{title}</legend><div className={`grid gap-3 ${columns}`}>{children}</div></fieldset>;
}

function ContentEditor({ record }: { record: SiteContentRecord }) {
  if (record.key === "about_page") {
    const { hero, highlights, story, visionMission, principles, expertise, clinics } = record.content;
    return <AdminActionForm action={updateStructuredSiteContent} className="space-y-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm" submitLabel="Lưu trang giới thiệu">
      <input name="key" type="hidden" value={record.key} />
      <h3 className="font-bold text-text-primary">Nội dung trang Giới thiệu</h3>
      <EditorSection columns="sm:grid-cols-2" title="Banner giới thiệu">
        <TextField label="Dòng giới thiệu" name="heroEyebrow" value={hero.eyebrow} />
        <TextField label="Tiêu đề" name="heroTitle" value={hero.title} />
        <TextAreaField label="Mô tả" name="heroDescription" value={hero.description} />
        <TextField label="Đường dẫn ảnh" name="heroImage" value={hero.image} />
      </EditorSection>
      <EditorSection title="Thông tin nổi bật">
        <EditableRows label="Các mục nổi bật" name="highlights" columns={[{ key: "value", label: "Giá trị" }, { key: "label", label: "Nhãn" }]} initialRows={highlights.map((item) => ({ value: item.value, label: item.label }))} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Câu chuyện phòng khám">
        <TextField label="Dòng giới thiệu" name="storyEyebrow" value={story.eyebrow} />
        <TextField label="Tiêu đề" name="storyTitle" value={story.title} />
        <EditableRows label="Các đoạn nội dung" name="storyParagraphs" columns={[{ key: "value", label: "Nội dung", multiline: true }]} initialRows={story.paragraphs.map((value) => ({ value }))} />
        <TextField label="Người sáng lập" name="founderName" value={story.founderName} />
        <TextField label="Chức danh" name="founderRole" value={story.founderRole} />
        <TextField label="Đường dẫn ảnh" name="storyImage" value={story.image} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Tầm nhìn và sứ mệnh">
        <TextField label="Dòng giới thiệu" name="visionEyebrow" value={visionMission.eyebrow} />
        <TextField label="Tiêu đề" name="visionTitle" value={visionMission.title} />
        <TextAreaField label="Mở đầu" name="visionIntroduction" value={visionMission.introduction} />
        <TextAreaField label="Tầm nhìn" name="vision" value={visionMission.vision} />
        <TextAreaField label="Sứ mệnh" name="mission" value={visionMission.mission} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Nguyên tắc hoạt động">
        <TextField label="Dòng giới thiệu" name="principlesEyebrow" value={principles.eyebrow} />
        <TextField label="Tiêu đề" name="principlesTitle" value={principles.title} />
        <TextAreaField label="Mô tả" name="principlesIntroduction" value={principles.introduction} />
        <EditableRows label="Các nguyên tắc" name="principles" columns={[{ key: "number", label: "Số thứ tự" }, { key: "title", label: "Tiêu đề" }, { key: "description", label: "Mô tả", multiline: true }]} initialRows={principles.items.map((item) => ({ number: item.number, title: item.title, description: item.description }))} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Chuyên môn và cam kết">
        <TextField label="Dòng giới thiệu" name="expertiseEyebrow" value={expertise.eyebrow} />
        <TextField label="Tiêu đề" name="expertiseTitle" value={expertise.title} />
        <TextAreaField label="Mô tả" name="expertiseDescription" value={expertise.description} />
        <EditableRows label="Cam kết" name="commitments" columns={[{ key: "value", label: "Nội dung", multiline: true }]} initialRows={expertise.commitments.map((value) => ({ value }))} />
        <TextField label="Đường dẫn ảnh" name="expertiseImage" value={expertise.image} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Thông tin hệ thống phòng khám">
        <TextField label="Dòng giới thiệu" name="clinicsEyebrow" value={clinics.eyebrow} />
        <TextField label="Tiêu đề" name="clinicsTitle" value={clinics.title} />
        <TextAreaField label="Mô tả" name="clinicsDescription" value={clinics.description} />
      </EditorSection>
    </AdminActionForm>;
  }

  const data = record.content;
  return <AdminActionForm action={updateStructuredSiteContent} className="space-y-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm" submitLabel="Lưu nội dung Implant">
    <input name="key" type="hidden" value={record.key} />
    <h3 className="font-bold text-text-primary">Chi tiết dịch vụ Implant</h3>
    <TextField label="Liên kết nguồn bảng giá" name="priceSourceUrl" value={data.priceSourceUrl} required />
    <EditableRows label="Bảng giá" name="prices" columns={[{ key: "name", label: "Tên dịch vụ" }, { key: "detail", label: "Chi tiết" }, { key: "price", label: "Giá" }]} initialRows={data.prices.map((item) => ({ name: item.name, detail: item.detail, price: item.price }))} />
    <EditableRows label="Quy trình điều trị" name="steps" columns={[{ key: "number", label: "Số thứ tự" }, { key: "title", label: "Tiêu đề" }, { key: "description", label: "Mô tả", multiline: true }]} initialRows={data.steps.map((item) => ({ number: item.number, title: item.title, description: item.description }))} />
    <EditableRows label="Câu hỏi thường gặp" name="faqs" columns={[{ key: "question", label: "Câu hỏi", multiline: true }, { key: "answer", label: "Câu trả lời", multiline: true }]} initialRows={data.faqs.map((item) => ({ question: item.question, answer: item.answer }))} />
  </AdminActionForm>;
}

export function ContentDatabaseManager({
  contentRecords,
  contactCtaSettings,
  clinics,
  section,
}: {
  contentRecords: readonly SiteContentRecord[];
  contactCtaSettings: ContactCtaSettings;
  clinics: readonly { id: string; label: string }[];
  section: string;
}) {
  const visibleContent = contentRecords.filter((record) => section === "all" || (section === "about" && record.key === "about_page"));
  const showContact = section === "all" || section === "contact";
  const showContent = section !== "contact";
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-blue">Quản trị dữ liệu</p>
        <h1 className="mt-2 text-3xl font-extrabold text-text-primary">Nội dung website &amp; bảo hiểm</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">Quản lý nội dung trang, liên kết liên hệ và logo bảo hiểm bằng các trường nhập liệu.</p>
      </header>

      {showContact ? <section aria-labelledby="contact-cta-heading" className="space-y-4">
        <div><h2 className="text-xl font-bold text-text-primary" id="contact-cta-heading">CTA liên hệ nhanh</h2><p className="mt-1 text-sm text-text-secondary">Hotline lấy từ thông tin từng cơ sở ở mục Quản lý cơ sở. Tại đây quản lý nút gọi và liên kết mạng xã hội.</p></div>
        <AdminActionForm action={updateContactCta} className="grid gap-5 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm" submitLabel="Lưu CTA liên hệ">
          <label className="flex items-center gap-3 text-sm font-semibold text-text-primary"><input className="h-4 w-4 accent-brand-blue" defaultChecked={contactCtaSettings.showPhone} name="showPhone" type="checkbox" />Hiển thị nút gọi điện nhanh</label>
          <label className="block text-sm font-semibold text-text-primary">Liên kết Facebook<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.facebookUrl} name="facebookUrl" placeholder="https://facebook.com/..." type="url" /></label>
          {clinics.map((clinic) => <label className="block text-sm font-semibold text-text-primary" key={clinic.id}>Liên kết Zalo — {clinic.label}<input className="mt-1 w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 font-normal outline-none focus:border-brand-blue" defaultValue={contactCtaSettings.zaloLinks[clinic.id] ?? ""} name={`zaloUrl-${clinic.id}`} placeholder="https://zalo.me/..." type="url" /></label>)}
          <p className="text-xs text-text-secondary">Để trống liên kết nếu chưa muốn hiển thị nút tương ứng. Chỉ chấp nhận URL HTTPS.</p>
        </AdminActionForm>
      </section> : null}

      {showContent ? <section aria-labelledby="site-content-heading" className="space-y-4">
        <div><h2 className="text-xl font-bold text-text-primary" id="site-content-heading">Nội dung website</h2><p className="mt-1 text-sm text-text-secondary">Chỉnh nội dung theo từng trang bằng form; các danh sách được nhập mỗi mục trên một dòng theo hướng dẫn.</p></div>
        {visibleContent.length ? visibleContent.map((record) => <ContentEditor key={record.key} record={record} />) : <p className="rounded-2xl border border-border-subtle bg-white p-5 text-sm text-text-secondary">Chưa có nội dung cấu hình cho mục này.</p>}
      </section> : null}

    </div>
  );
}
