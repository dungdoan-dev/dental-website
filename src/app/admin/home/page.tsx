import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { FaqFormDialog } from "@/features/admin/components/FaqFormDialog";
import { TestimonialFormDialog } from "@/features/admin/components/TestimonialFormDialog";
import { DeleteFaqButton, DeleteHeroSlideButton, DeleteTestimonialButton } from "@/features/admin/components/DeleteButtons";
import { HeroSlideFormDialog } from "@/features/admin/components/HeroSlideFormDialog";
import { InsurancePartnersManager, type InsurancePartnerRecord } from "@/features/admin/components/InsurancePartnersManager";
import { updateHomeSectionCopy, updateStructuredSiteContent } from "@/features/admin/content-actions";
import { updateCoreValue } from "@/features/admin/actions";
import { AdminActionForm } from "@/features/admin/components/AdminActionForm";
import { ImageUploadField } from "@/features/admin/components/ImageUploadField";
import { HOME_SECTION_COPY, type HomeSectionCopyMap } from "@/features/home/home-section-copy";

export const metadata = {
  title: "Cấu Hình Trang Chủ | Admin Nha Khoa 2000",
};

export default async function AdminHomePage() {
  await requireAdmin();
  const [faqs, testimonials, coreValues, heroSlides, insurancePartners, whyChooseContent, faqHeadingContent, sectionCopyContent] = await Promise.all([
    db.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    db.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    db.coreValue.findMany({ orderBy: { sortOrder: "asc" } }),
    db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    db.$queryRaw<InsurancePartnerRecord[]>`
      SELECT code, name, description, accent, logo_src AS "logoSrc", sort_order AS "sortOrder"
      FROM insurance_partners ORDER BY sort_order ASC
    `,
    db.siteContent.findUnique({ where: { key: "home_why_choose" }, select: { content: true } }),
    db.siteContent.findUnique({ where: { key: "home_faq_heading" }, select: { content: true } }),
    db.siteContent.findUnique({ where: { key: "home_section_copy" }, select: { content: true } }),
  ]);
  const whyChooseImage = whyChooseContent?.content && typeof whyChooseContent.content === "object" && !Array.isArray(whyChooseContent.content) && "image" in whyChooseContent.content && typeof whyChooseContent.content.image === "string" ? whyChooseContent.content.image : "";
  const faqHeading = faqHeadingContent?.content && typeof faqHeadingContent.content === "object" && !Array.isArray(faqHeadingContent.content) ? faqHeadingContent.content : {};
  const sectionCopy = { ...HOME_SECTION_COPY } as unknown as HomeSectionCopyMap;
  const savedCopy = sectionCopyContent?.content && typeof sectionCopyContent.content === "object" && !Array.isArray(sectionCopyContent.content) ? sectionCopyContent.content : {};
  for (const key of Object.keys(HOME_SECTION_COPY) as Array<keyof typeof HOME_SECTION_COPY>) {
    const value = key === "faq" && !(key in savedCopy) ? faqHeading : (key in savedCopy ? (savedCopy as Record<string, unknown>)[key] : null);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const fields = value as Record<string, unknown>;
      sectionCopy[key] = {
        title: typeof fields.title === "string" ? fields.title : HOME_SECTION_COPY[key].title,
        note: typeof fields.note === "string" ? fields.note : HOME_SECTION_COPY[key].note,
      };
    }
  }

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Cấu Hình Nội Dung Trang Chủ
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Cấu hình các khối theo thứ tự hiển thị từ đầu đến cuối trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-text-primary hover:bg-surface-container-low text-xs font-semibold shadow-sm border border-border-subtle/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-brand-blue-dark">open_in_new</span>
            <span>Xem Trang Chủ Thực Tế</span>
          </Link>
        </div>
      </div>

      <section className="order-10 overflow-hidden rounded-2xl border border-border-subtle/50 bg-white shadow-sm">
        <div className="border-b border-border-subtle/60 bg-surface-container-low/50 px-6 py-4"><h2 className="text-base font-bold text-text-primary">Tiêu đề và ghi chú trang chủ</h2><p className="text-xs text-text-secondary">Quản lý tiêu đề cùng dòng mô tả nhỏ bên dưới từng tiêu đề section.</p></div>
        <AdminActionForm action={updateHomeSectionCopy} submitLabel="Lưu tất cả tiêu đề" className="grid gap-4 p-6 md:grid-cols-2">
          {(Object.keys(HOME_SECTION_COPY) as Array<keyof typeof HOME_SECTION_COPY>).map((key) => {
            const labels: Record<keyof typeof HOME_SECTION_COPY, string> = { services: "Dịch vụ", doctors: "Đội ngũ bác sĩ", whyChoose: "Lý do lựa chọn", clinics: "Cơ sở", insurance: "Bảo hiểm", faq: "Câu hỏi thường gặp", testimonials: "Đánh giá khách hàng", vision: "Tầm nhìn & sứ mệnh", values: "Giá trị cốt lõi" };
            return <fieldset className="space-y-3 rounded-xl border border-border-subtle p-4" key={key}><legend className="px-1 text-xs font-bold text-brand-blue-dark">{labels[key]}</legend><label className="block text-xs font-semibold text-text-secondary">Tiêu đề<input className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={sectionCopy[key].title} maxLength={160} name={`${key}Title`} required /></label><label className="block text-xs font-semibold text-text-secondary">Ghi chú nhỏ<textarea className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={sectionCopy[key].note} maxLength={400} name={`${key}Note`} rows={2} /></label></fieldset>;
          })}
        </AdminActionForm>
      </section>

      {/* SECTION 1: FAQ */}
      <section className="order-8 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="flex items-center justify-between border-b border-border-subtle/60 px-6 py-4 bg-surface-container-low/50">
          <div>
            <h2 className="text-base font-bold text-text-primary">Câu hỏi thường gặp (FAQ)</h2>
            <p className="text-xs text-text-secondary">Câu hỏi và câu trả lời hiển thị trong mục FAQ trên trang chủ; thứ tự theo số thứ tự.</p>
          </div>
          <FaqFormDialog
            buttonLabel="+ Thêm Câu Hỏi"
            buttonClassName="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-blue-dark hover:bg-brand-blue text-white text-xs font-bold shadow-sm transition-all"
          />
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq) => (
            <div key={faq.id} className="flex items-start justify-between gap-4 p-5 hover:bg-background-secondary transition">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-light text-[11px] font-bold text-brand-blue-dark">
                    ?
                  </span>
                  {faq.question}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed pl-7">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <FaqFormDialog
                  faq={{ ...faq, id: faq.id.toString() }}
                  buttonLabel="Sửa"
                  buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                />
                <DeleteFaqButton id={faq.id.toString()} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: TESTIMONIALS */}
      <section className="order-9 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="flex items-center justify-between border-b border-border-subtle/60 px-6 py-4 bg-surface-container-low/50">
          <div>
            <h2 className="text-base font-bold text-text-primary">Đánh giá của Khách hàng</h2>
            <p className="text-xs text-text-secondary">Các lời chia sẻ từ bệnh nhân sau khi điều trị thành công</p>
          </div>
          <TestimonialFormDialog
            buttonLabel="+ Thêm Đánh Giá"
            buttonClassName="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-blue-dark hover:bg-brand-blue text-white text-xs font-bold shadow-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {testimonials.map((item) => (
            <div key={item.id} className="p-5 flex flex-col justify-between space-y-4 hover:bg-background-secondary transition">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue-dark font-bold text-xs shadow-sm">
                      {item.initials}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{item.customerName}</h3>
                      <p className="text-[10px] text-text-secondary">{item.source}</p>
                    </div>
                  </div>
                  <span className="text-amber-400 text-xs font-bold tracking-wider">{"★".repeat(item.rating)}</span>
                </div>
                <p className="text-xs text-text-secondary italic leading-relaxed line-clamp-4">
                  “{item.content}”
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <TestimonialFormDialog
                  testimonial={{ ...item, source: item.source ?? undefined, avatar: item.avatar }}
                  buttonLabel="Sửa"
                  buttonClassName="rounded-xl border border-border-subtle bg-white px-3 py-1 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
                />
                <DeleteTestimonialButton id={item.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE VALUES */}
      <section className="order-2 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="border-b border-border-subtle/60 px-6 py-4 bg-surface-container-low/50">
          <h2 className="text-base font-bold text-text-primary">4 Giá Trị Tạo Dựng Niềm Tin Bền Vững</h2>
          <p className="text-xs text-text-secondary">Chỉnh sửa tiêu đề, thông điệp, mô tả, biểu tượng và thứ tự hiển thị trên trang chủ.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {coreValues.map((cv) => (
            <div key={cv.id} className="p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-dark">{cv.title}</span>
              <h3 className="mt-2 text-xs font-bold text-text-primary">{cv.slogan}</h3>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">{cv.description}</p>
              <details className="mt-4 rounded-xl border border-border-subtle p-3">
                <summary className="cursor-pointer text-xs font-semibold text-brand-blue-dark">Chỉnh sửa nội dung</summary>
                <AdminActionForm action={updateCoreValue} submitLabel="Lưu giá trị" className="mt-3 space-y-3">
                  <input name="id" type="hidden" value={cv.id.toString()} />
                  <label className="block text-xs font-semibold text-text-secondary">Tiêu đề<input className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={cv.title} name="title" maxLength={80} required /></label>
                  <label className="block text-xs font-semibold text-text-secondary">Thông điệp<input className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={cv.slogan} name="slogan" maxLength={200} required /></label>
                  <label className="block text-xs font-semibold text-text-secondary">Mô tả<textarea className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={cv.description} name="description" maxLength={1200} rows={4} required /></label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-semibold text-text-secondary">Biểu tượng<select className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={cv.iconKey} name="iconKey"><option value="heart">Tận thương</option><option value="care">Tận tâm</option><option value="honesty">Trung thực</option><option value="innovation">Tân tiến</option></select></label>
                    <label className="block text-xs font-semibold text-text-secondary">Thứ tự<input className="mt-1 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm font-normal text-text-primary" defaultValue={cv.sortOrder} min={0} max={999} name="sortOrder" type="number" required /></label>
                  </div>
                </AdminActionForm>
              </details>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: HERO SLIDES */}
      <section className="order-1 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(20,70,85,0.06)] border border-border-subtle/50">
        <div className="flex flex-col gap-3 border-b border-border-subtle/60 bg-surface-container-low/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">Slider trang chủ</h2>
            <p className="text-xs text-text-secondary">Quản lý hình ảnh, nội dung, vị trí ảnh và thứ tự trình chiếu.</p>
          </div>
          <HeroSlideFormDialog />
        </div>

        <div className="divide-y divide-slate-100">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="flex flex-col gap-4 p-4 transition hover:bg-background-secondary sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-low sm:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={slide.imageAlt} className="h-full w-full object-cover" src={slide.image} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-bold text-text-primary">{slide.title}</div>
                <div className="text-xs text-text-secondary">{slide.badge || "Không có nhãn"} · Mã: <span className="font-mono">{slide.id}</span></div>
                <div className="truncate text-[11px] text-text-secondary" title={slide.image}>{slide.image}</div>
                <span className="inline-flex rounded-full bg-brand-blue-light px-2 py-0.5 text-[11px] font-semibold text-brand-blue-dark">Thứ tự: {slide.sortOrder}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <HeroSlideFormDialog slide={{ ...slide, badgeVariant: slide.badgeVariant === "green" ? "green" : "blue", objectPosition: slide.objectPosition === "top" ? "top" : "center" }} buttonLabel="Sửa" />
                <DeleteHeroSlideButton id={slide.id} />
              </div>
            </div>
          ))}
          {heroSlides.length === 0 ? <p className="p-6 text-sm text-text-secondary">Chưa có slide nào. Thêm slide để hiển thị slider ở đầu trang chủ.</p> : null}
        </div>
      </section>

      <section className="order-5 rounded-2xl border border-border-subtle/50 bg-white p-6 shadow-sm">
        <div className="mb-4"><h2 className="text-base font-bold text-text-primary">Lý do lựa chọn</h2><p className="text-xs text-text-secondary">Cập nhật hình ảnh hiển thị trong section này trên trang chủ.</p></div>
        <AdminActionForm action={updateStructuredSiteContent} submitLabel="Lưu hình ảnh" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input name="key" type="hidden" value="home_why_choose" />
          <div className="flex-1"><ImageUploadField aspect={16 / 9} name="image" label="Hình ảnh section" defaultValue={whyChooseImage} required /></div>
        </AdminActionForm>
      </section>

      <section className="order-3 flex flex-col gap-3 rounded-2xl border border-border-subtle/50 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Dịch vụ</h2><p className="text-xs text-text-secondary">Các dịch vụ đang hoạt động được hiển thị trong danh sách dịch vụ trang chủ.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/services">Quản lý dịch vụ →</Link>
      </section>

      <section className="order-4 flex flex-col gap-3 rounded-2xl border border-border-subtle/50 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Đội ngũ bác sĩ</h2><p className="text-xs text-text-secondary">Các hồ sơ bác sĩ đang hoạt động được hiển thị trong danh sách trang chủ.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/doctors">Quản lý bác sĩ →</Link>
      </section>

      <section className="order-6 flex flex-col gap-3 rounded-2xl border border-border-subtle/50 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Cơ sở vật chất</h2><p className="text-xs text-text-secondary">Thông tin và hình ảnh cơ sở được quản lý cùng hồ sơ từng phòng khám.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/clinics">Quản lý cơ sở →</Link>
      </section>

      <div className="order-7"><InsurancePartnersManager partners={insurancePartners} /></div>
    </div>
  );
}
