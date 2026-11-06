import { updateStructuredSiteContent } from "../content-actions";
import type { AboutPageData } from "@/features/about/schemas/about.schema";
import type { ImplantDetailData } from "@/features/services/schemas/implant-detail.schema";
import { EditableRows } from "./EditableRows";
import { PageHeader } from "./PageHeader";
import { AdminActionForm } from "./AdminActionForm";
import { ImageUploadField } from "./ImageUploadField";

export type SiteContentRecord =
  | { key: "about_page"; content: AboutPageData }
  | { key: "implant_detail"; content: ImplantDetailData };

const inputClass = "mt-1 min-h-11 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15";

function TextField({ label, name, value, required = false }: { label: string; name: string; value: string; required?: boolean }) {
  return <label className="block text-sm font-semibold text-text-primary">{label}<input className={inputClass} defaultValue={value} name={name} required={required} /></label>;
}

function TextAreaField({ label, name, value, hint }: { label: string; name: string; value: string; hint?: string }) {
  return <label className="block text-sm font-semibold text-text-primary">{label}{hint ? <span className="ml-1 text-xs font-normal text-text-secondary">({hint})</span> : null}<textarea className={`${inputClass} min-h-28 resize-y leading-relaxed`} defaultValue={value} name={name} /></label>;
}

function EditorSection({ title, children, columns = "" }: { title: string; children: React.ReactNode; columns?: string }) {
  return <fieldset className="min-w-0 rounded-xl border border-border-subtle bg-white p-4 sm:p-5"><legend className="px-2 text-base font-bold text-text-primary">{title}</legend><div className={`grid min-w-0 gap-4 ${columns}`}>{children}</div></fieldset>;
}

function ContentEditor({ record }: { record: SiteContentRecord }) {
  if (record.key === "about_page") {
    const { hero, highlights, founder, history, facilities, license, insurance, activities } = record.content;
    const photoColumns = (count: number) => Array.from({ length: count }, (_, i) => [{ key: `photo${i + 1}`, label: `Ảnh ${i + 1}`, image: true }, { key: `caption${i + 1}`, label: `Chú thích ảnh ${i + 1}` }]).flat();
    const photoCells = (photos: readonly { src: string; caption: string }[]) => Object.fromEntries(photos.flatMap((p, i) => [[`photo${i + 1}`, p.src], [`caption${i + 1}`, p.caption]]));
    const textRows = (values: readonly string[]) => values.map((value) => ({ value }));
    const photoRow = [{ key: "photo", label: "Ảnh", image: true }, { key: "caption", label: "Chú thích (cũng dùng làm mô tả ảnh)" }] as const;
    return <AdminActionForm action={updateStructuredSiteContent} className="space-y-5 rounded-2xl border border-border-subtle bg-background-secondary p-4 sm:p-6" submitLabel="Lưu trang giới thiệu">
      <input name="key" type="hidden" value={record.key} />
      <div><h3 className="text-lg font-bold text-text-primary">Nội dung các trang Giới thiệu</h3><p className="mt-1 text-sm text-text-secondary">Dùng cho 5 trang dưới /gioi-thieu. Chú thích ảnh cũng là mô tả ảnh cho người dùng trình đọc màn hình. Giá trị cốt lõi, tầm nhìn và sứ mệnh dùng chung với trang chủ (sửa ở Nội dung trang chủ); logo bảo hiểm, câu hỏi thường gặp và thông tin cơ sở quản lý ở các mục riêng.</p></div>
      <EditorSection columns="sm:grid-cols-2" title="Về chúng tôi · Banner">
        <TextField label="Tiêu đề" name="heroTitle" value={hero.title} required />
        <TextField label="Chú thích ảnh banner" name="heroCaption" value={hero.photo.caption} />
        <div className="sm:col-span-2"><TextAreaField label="Mô tả" name="heroDescription" value={hero.description} /></div>
        <div className="sm:col-span-2"><ImageUploadField aspect={4 / 3} defaultValue={hero.photo.src} label="Ảnh banner" name="heroImage" required /></div>
        <div className="sm:col-span-2"><EditableRows label="Số liệu nổi bật dưới banner" name="highlights" columns={[{ key: "value", label: "Con số" }, { key: "label", label: "Nhãn" }]} initialRows={highlights} /></div>
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Về chúng tôi · Người sáng lập">
        <TextField label="Họ tên" name="founderName" value={founder.name} required />
        <TextField label="Chức danh" name="founderRole" value={founder.role} />
        <div className="sm:col-span-2"><ImageUploadField aspect={4 / 5} defaultValue={founder.photo.src} label="Ảnh chân dung" name="founderImage" required /></div>
        <TextField label="Chú thích ảnh chân dung" name="founderCaption" value={founder.photo.caption} />
        <div className="sm:col-span-2"><EditableRows label="Các đoạn giới thiệu" name="founderParagraphs" columns={[{ key: "value", label: "Đoạn văn", multiline: true }]} initialRows={textRows(founder.paragraphs)} /></div>
        <div className="sm:col-span-2"><EditableRows label="Chức vụ, thành tích" name="founderCredentials" columns={[{ key: "value", label: "Nội dung" }]} initialRows={textRows(founder.credentials)} /></div>
        <div className="sm:col-span-2"><EditableRows label="Phẩm chất (thẻ)" name="founderTraits" columns={[{ key: "value", label: "Phẩm chất" }]} initialRows={textRows(founder.traits)} /></div>
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Về chúng tôi · Lịch sử hình thành">
        <TextField label="Tiêu đề" name="historyTitle" value={history.title} />
        <div className="sm:col-span-2"><TextAreaField label="Mở đầu" name="historyIntro" value={history.intro} /></div>
        <div className="sm:col-span-2"><EditableRows label="Các cột mốc (tối đa 4 ảnh mỗi mốc; ảnh 1 là ảnh lớn)" name="milestones" columns={[{ key: "date", label: "Thời gian" }, { key: "tag", label: "Nhãn" }, { key: "title", label: "Tiêu đề" }, { key: "stat", label: "Điểm nhấn (để trống nếu không có)" }, { key: "text", label: "Nội dung", multiline: true }, ...photoColumns(4)]} initialRows={history.milestones.map(({ photos, ...rest }) => ({ ...rest, ...photoCells(photos) }))} /></div>
        <div className="sm:col-span-2"><EditableRows label="Tư liệu những năm đầu" name="archive" columns={photoRow} initialRows={history.archive.map((p) => ({ photo: p.src, caption: p.caption }))} /></div>
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Về chúng tôi · Cơ sở vật chất và trang thiết bị">
        <TextField label="Tiêu đề" name="facilitiesTitle" value={facilities.title} />
        <div className="sm:col-span-2"><EditableRows label="Phòng chức năng" name="rooms" columns={[{ key: "title", label: "Tên phòng" }, { key: "text", label: "Mô tả", multiline: true }, ...photoRow]} initialRows={facilities.rooms.map((r) => ({ title: r.title, text: r.text, photo: r.photo.src, caption: r.photo.caption }))} /></div>
        <div className="sm:col-span-2"><EditableRows label="Trang thiết bị" name="equipment" columns={[{ key: "title", label: "Tên thiết bị" }, { key: "text", label: "Mô tả", multiline: true }, ...photoRow]} initialRows={facilities.equipment.map((r) => ({ title: r.title, text: r.text, photo: r.photo.src, caption: r.photo.caption }))} /></div>
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Giấy phép hoạt động">
        <div className="sm:col-span-2"><ImageUploadField aspect={845 / 1200} defaultValue={license.photo.src} fit="contain" label="Ảnh giấy phép Cơ sở 1" name="licenseImage" required /></div>
        <div className="sm:col-span-2"><TextAreaField label="Chú thích giấy phép" name="licenseCaption" value={license.photo.caption} /></div>
        <div className="sm:col-span-2"><EditableRows label="Thông tin doanh nghiệp" name="companyInfo" columns={[{ key: "label", label: "Mục" }, { key: "value", label: "Nội dung" }]} initialRows={license.companyInfo} /></div>
      </EditorSection>
      <EditorSection title="Bảo hiểm">
        <EditableRows label="Quy trình bảo lãnh viện phí" name="insuranceSteps" columns={[{ key: "title", label: "Bước" }, { key: "text", label: "Mô tả", multiline: true }]} initialRows={insurance.steps} />
        <EditableRows label="Vì sao nên khám bảo hiểm tại Nha Khoa 2000" name="insuranceBenefits" columns={[{ key: "title", label: "Ý" }, { key: "text", label: "Mô tả", multiline: true }]} initialRows={insurance.benefits} />
      </EditorSection>
      <EditorSection columns="sm:grid-cols-2" title="Hoạt động nội bộ">
        <TextField label="Tiêu đề ảnh nổi bật" name="featuredTitle" value={activities.featured.title} />
        <div className="sm:col-span-2"><TextAreaField label="Mô tả ảnh nổi bật" name="featuredDescription" value={activities.featured.description} /></div>
        <div className="sm:col-span-2"><EditableRows label="Ảnh nổi bật" name="featuredPhotos" columns={photoRow} initialRows={activities.featured.photos.map((p) => ({ photo: p.src, caption: p.caption }))} /></div>
        <div className="sm:col-span-2"><EditableRows label="Các hoạt động (nhóm dùng làm bộ lọc; tối đa 5 ảnh)" name="activities" columns={[{ key: "category", label: "Nhóm" }, { key: "title", label: "Tên hoạt động" }, { key: "description", label: "Mô tả", multiline: true }, ...photoColumns(5)]} initialRows={activities.items.map(({ photos, ...rest }) => ({ ...rest, ...photoCells(photos) }))} /></div>
      </EditorSection>
    </AdminActionForm>;
  }

  const data = record.content;
  return <AdminActionForm action={updateStructuredSiteContent} className="space-y-4 rounded-[7px] bg-card shadow-card p-5" submitLabel="Lưu nội dung Implant">
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
  contentWarning,
  section,
}: {
  contentRecords: readonly SiteContentRecord[];
  contentWarning?: string;
  section: string;
}) {
  const visibleContent = contentRecords.filter((record) => section === "all" || (section === "about" && record.key === "about_page"));
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader description="Chỉnh nội dung trang giới thiệu bằng các trường nhập liệu." title="Trang giới thiệu" />

      <section aria-labelledby="site-content-heading" className="space-y-4">
        <div><h2 className="text-xl font-bold text-text-primary" id="site-content-heading">Nội dung website</h2><p className="mt-1 text-sm text-text-secondary">Chỉnh nội dung theo từng trang bằng form; các danh sách được nhập mỗi mục trên một dòng theo hướng dẫn.</p></div>
        {section === "about" && contentWarning ? <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="alert">{contentWarning}</p> : null}
        {visibleContent.length ? visibleContent.map((record) => <ContentEditor key={record.key} record={record} />) : <p className="rounded-[7px] bg-card shadow-card p-5 text-sm text-text-secondary">Chưa có nội dung cấu hình cho mục này.</p>}
      </section>

    </div>
  );
}
