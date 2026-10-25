import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/admin-ui/button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { buttonVariants } from "@/components/admin-ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { TestimonialFormDialog } from "@/features/admin/components/TestimonialFormDialog";
import { DeleteHeroSlideButton, DeleteTestimonialButton } from "@/features/admin/components/DeleteButtons";
import { HeroSlideFormDialog } from "@/features/admin/components/HeroSlideFormDialog";
import { InsurancePartnersManager, type InsurancePartnerRecord } from "@/features/admin/components/InsurancePartnersManager";
import { updateHomeSectionCopy, updateStructuredSiteContent } from "@/features/admin/content-actions";
import { updateCoreValue } from "@/features/admin/actions";
import { AdminActionForm } from "@/features/admin/components/AdminActionForm";
import { HomeSectionCopyEditor } from "@/features/admin/components/HomeSectionCopyEditor";
import { ImageUploadField } from "@/features/admin/components/ImageUploadField";
import { CoreValueIcon } from "@/features/home/components/CoreValueIcon";
import { HOME_SECTION_COPY, type HomeSectionCopyMap } from "@/features/home/home-section-copy";

export const metadata = {
  title: "Cấu Hình Trang Chủ | Admin Nha Khoa 2000",
};

export default async function AdminHomePage() {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  const [testimonials, coreValues, heroSlides, insurancePartners, whyChooseContent, faqHeadingContent, sectionCopyContent] = await Promise.all([
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("core_values").select("*").order("sort_order"),
    supabase.from("hero_slides").select("*").order("sort_order"),
    supabase.from("insurance_partners").select("code,name,description,accent,logo_src,sort_order").order("sort_order"),
    supabase.from("site_content").select("content").eq("key", "home_why_choose").maybeSingle(),
    supabase.from("site_content").select("content").eq("key", "home_faq_heading").maybeSingle(),
    supabase.from("site_content").select("content").eq("key", "home_section_copy").maybeSingle(),
  ]);
  for (const result of [testimonials, coreValues, heroSlides, insurancePartners, whyChooseContent, faqHeadingContent, sectionCopyContent]) {
    if (result.error) throw result.error;
  }
  const testimonialRows = testimonials.data ?? [];
  const coreValueRows = coreValues.data ?? [];
  // New testimonials go last instead of jumping to the top at sort_order 0.
  const nextTestimonialSort = Math.max(-1, ...testimonialRows.map((row) => row.sort_order)) + 1;
  const heroSlideRows = (heroSlides.data ?? []).map((row) => ({
    ...row, imageAlt: row.image_alt,
    objectPosition: row.object_position, sortOrder: row.sort_order,
  }));
  const insurancePartnerRows: InsurancePartnerRecord[] = (insurancePartners.data ?? []).map((row) => ({
    code: row.code, name: row.name, description: row.description, accent: row.accent,
    logoSrc: row.logo_src, sortOrder: row.sort_order,
  }));
  const whyChooseRecord = whyChooseContent.data;
  const faqHeadingRecord = faqHeadingContent.data;
  const sectionCopyRecord = sectionCopyContent.data;
  const whyChooseImage = whyChooseRecord?.content && typeof whyChooseRecord.content === "object" && !Array.isArray(whyChooseRecord.content) && "image" in whyChooseRecord.content && typeof whyChooseRecord.content.image === "string" ? whyChooseRecord.content.image : "";
  const faqHeading = faqHeadingRecord?.content && typeof faqHeadingRecord.content === "object" && !Array.isArray(faqHeadingRecord.content) ? faqHeadingRecord.content : {};
  const sectionCopy = { ...HOME_SECTION_COPY } as unknown as HomeSectionCopyMap;
  const savedCopy = sectionCopyRecord?.content && typeof sectionCopyRecord.content === "object" && !Array.isArray(sectionCopyRecord.content) ? sectionCopyRecord.content : {};
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
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<Button asChild size="sm" variant="soft"><Link prefetch={false} href="/" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang chủ thực tế</Link></Button>}
        description="Cấu hình các khối theo thứ tự hiển thị từ đầu đến cuối trang chủ."
        title="Nội dung trang chủ"
      />

      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="border-b px-6 py-5"><h2 className="text-base font-bold text-text-primary">Tiêu đề và ghi chú trang chủ</h2><p className="text-xs text-text-secondary">Quản lý tiêu đề cùng dòng mô tả nhỏ bên dưới từng tiêu đề section.</p></div>
        <AdminActionForm action={updateHomeSectionCopy} submitLabel="Lưu tất cả tiêu đề" className="space-y-6 p-5 sm:p-6">
          <HomeSectionCopyEditor initialCopy={sectionCopy} />
        </AdminActionForm>
      </section>

      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">Slider trang chủ</h2>
            <p className="text-xs text-text-secondary">Quản lý hình ảnh, nội dung, vị trí ảnh và thứ tự trình chiếu.</p>
          </div>
          <HeroSlideFormDialog />
        </div>

        <div className="divide-y divide-slate-100">
          {heroSlideRows.map((slide) => (
            <div key={slide.id} className="flex flex-col gap-4 p-4 transition hover:bg-background-secondary sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-container-low sm:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={slide.imageAlt} className="h-full w-full object-cover" src={slide.image} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-bold text-text-primary">{slide.title}</div>
                <div className="text-xs text-text-secondary">Mã: <span className="font-mono">{slide.id}</span></div>
                <div className="truncate text-[11px] text-text-secondary" title={slide.image}>{slide.image}</div>
                <span className="inline-flex rounded-full bg-brand-blue-light px-2 py-0.5 text-[11px] font-semibold text-brand-blue-dark">Thứ tự: {slide.sortOrder}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <HeroSlideFormDialog slide={{ ...slide, objectPosition: slide.objectPosition === "top" ? "top" : "center" }} buttonLabel="Sửa" />
                <DeleteHeroSlideButton id={slide.id} name={slide.title} />
              </div>
            </div>
          ))}
          {heroSlideRows.length === 0 ? <p className="p-6 text-sm text-text-secondary">Chưa có slide nào. Thêm slide để hiển thị slider ở đầu trang chủ.</p> : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="border-b px-6 py-5">
          <h2 className="text-base font-bold text-text-primary">{sectionCopy.values.title}</h2>
          <p className="text-xs text-text-secondary">Chỉnh sửa tiêu đề, thông điệp, mô tả, biểu tượng và thứ tự hiển thị trên trang chủ.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {coreValueRows.map((row) => {
            const cv = { ...row, iconKey: row.icon_key, sortOrder: row.sort_order };
            return (
            <div key={cv.id} className="p-5 text-center">
              {/* Preview mirrors the public card: icon, title, slogan, description with its line breaks. */}
              <div className="mx-auto mb-3 h-12 w-12"><CoreValueIcon iconKey={cv.iconKey as "heart" | "care" | "honesty" | "innovation"} /></div>
              <span className="text-lg font-extrabold uppercase tracking-wide text-brand-blue-dark">{cv.title}</span>
              <h3 className="mt-2 text-sm font-bold text-text-primary">{cv.slogan}</h3>
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-text-secondary">{cv.description}</p>
              <details className="mt-4 rounded-xl border border-border-subtle p-3 text-left">
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
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[7px] bg-card shadow-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Dịch vụ</h2><p className="text-xs text-text-secondary">Các dịch vụ đang hoạt động được hiển thị trong danh sách dịch vụ trang chủ.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/services">Quản lý dịch vụ →</Link>
      </section>

      <section className="flex flex-col gap-3 rounded-[7px] bg-card shadow-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Đội ngũ bác sĩ</h2><p className="text-xs text-text-secondary">Các hồ sơ bác sĩ đang hoạt động được hiển thị trong danh sách trang chủ.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/doctors">Quản lý bác sĩ →</Link>
      </section>

      <section className="rounded-[7px] bg-card shadow-card p-6">
        <div className="mb-4"><h2 className="text-base font-bold text-text-primary">Lý do lựa chọn</h2><p className="text-xs text-text-secondary">Cập nhật hình ảnh hiển thị trong section này trên trang chủ.</p></div>
        <AdminActionForm action={updateStructuredSiteContent} submitLabel="Lưu hình ảnh" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input name="key" type="hidden" value="home_why_choose" />
          <div className="flex-1"><ImageUploadField aspect={16 / 9} name="image" label="Hình ảnh section" defaultValue={whyChooseImage} required /></div>
        </AdminActionForm>
      </section>

      <section className="flex flex-col gap-3 rounded-[7px] bg-card shadow-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Cơ sở vật chất</h2><p className="text-xs text-text-secondary">Thông tin và hình ảnh cơ sở được quản lý cùng hồ sơ từng phòng khám.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/clinics">Quản lý cơ sở →</Link>
      </section>

      <div><InsurancePartnersManager partners={insurancePartnerRows} /></div>

      <section className="flex flex-col gap-3 rounded-[7px] bg-card shadow-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold text-text-primary">Câu hỏi thường gặp (FAQ)</h2><p className="text-xs text-text-secondary">Câu hỏi và câu trả lời của mục FAQ trang chủ và trang Hỏi đáp được quản lý chung.</p></div>
        <Link className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-bold text-brand-blue-dark hover:bg-brand-blue-light" href="/admin/faq">Quản lý câu hỏi →</Link>
      </section>

      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-text-primary">Đánh giá của Khách hàng</h2>
            <p className="text-xs text-text-secondary">Các lời chia sẻ từ bệnh nhân sau khi điều trị thành công</p>
          </div>
          <TestimonialFormDialog
            nextSortOrder={nextTestimonialSort}
            buttonLabel="+ Thêm Đánh Giá"
            buttonClassName={buttonVariants({ size: "sm" })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {testimonialRows.map((row) => {
            const item = { ...row, customerName: row.customer_name };
            return (
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
                  buttonClassName={buttonVariants({ variant: "soft", size: "sm" })}
                />
                <DeleteTestimonialButton id={item.id} name={`Đánh giá của ${item.customerName}`} />
              </div>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
