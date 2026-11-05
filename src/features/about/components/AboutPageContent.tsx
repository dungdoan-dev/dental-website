import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import { FAQSection } from "@/features/home/components/FAQSection";
import { ClinicFacilitiesSection } from "@/features/home/components/ClinicFacilitiesSection";
import { CoreValuesSection } from "@/features/home/components/CoreValuesSection";
import { VisionMissionSection } from "@/features/home/components/VisionMissionSection";
import { InsurancePartnersSection } from "@/features/home/components/InsurancePartnersSection";
import type { AboutPageData } from "../schemas/about.schema";

type AboutPageContentProps = { content: AboutPageData; clinics: readonly Clinic[] };

const licenseCaption = "Giấy phép hoạt động khám bệnh, chữa bệnh của phòng khám tại 99 Hồ Hảo Hớn, do Sở Y tế TP.HCM cấp ngày 08/07/2016";

const insuranceSteps = [
  { title: "Cung cấp giấy tờ", description: "Mang theo thẻ bảo hiểm (thẻ giấy hoặc thẻ điện tử đã kích hoạt), căn cước công dân và bản sao giấy khai sinh nếu dưới 18 tuổi." },
  { title: "Kiểm tra tại quầy tiếp đón", description: "Nhân viên đối chiếu thẻ với thông tin cá nhân và chụp hai mặt giấy tờ." },
  { title: "Thăm khám và lập kế hoạch", description: "Bác sĩ thăm khám và lập kế hoạch điều trị. Nhân viên xác nhận khoản được chi trả với công ty bảo hiểm, bạn trao đổi phương án với bác sĩ." },
  { title: "Thanh toán và hoàn tất hồ sơ", description: "Bạn thanh toán phần bảo hiểm không chi trả và ký các biểu mẫu cần thiết. Phòng khám gửi hồ sơ cho công ty bảo hiểm." },
];

type Photo = { src: string; alt: string; caption: string };

// shortcut: photos come from the 25-year catalogue and are fixed in code, move to site_content when editors need to change them.
const historyPhotos: Photo[] = [
  { src: "/images/about/history-cong-quynh.jpg", alt: "Đội ngũ trước phòng khám Nha Khoa 2000 trên đường Cống Quỳnh", caption: "Phòng khám Nha Khoa 2000 trên đường Cống Quỳnh" },
  { src: "/images/about/history-4-nam.jpg", alt: "Mặt tiền phòng khám trong lễ kỷ niệm 4 năm thành lập", caption: "Kỷ niệm 4 năm thành lập phòng khám, 1999 – 2003" },
  { src: "/images/about/history-hop-dau-nam.jpg", alt: "Buổi họp đầu năm của Nha Khoa 2000", caption: "Buổi họp đầu năm Nha Khoa 2000" },
  { src: "/images/about/history-le-cam-ta.jpg", alt: "Lễ cảm tạ 2 năm thành lập Nha Khoa 2000", caption: "Lễ cảm tạ 2 năm thành lập" },
  { src: "/images/about/history-dieu-tri.jpg", alt: "Ê-kíp bác sĩ đang điều trị cho bệnh nhân", caption: "Ê-kíp điều trị tại phòng khám" },
];

const facilityPhotos: Photo[] = [
  { src: "/images/about/facility-tiep-don.jpg", alt: "Sảnh tiếp đón của Nha Khoa 2000", caption: "Sảnh tiếp đón" },
  { src: "/images/about/facility-phong-dieu-tri.jpg", alt: "Phòng điều trị với ghế nha khoa", caption: "Phòng điều trị" },
  { src: "/images/about/facility-tiet-trung.jpg", alt: "Khu tiệt trùng dụng cụ", caption: "Khu tiệt trùng dụng cụ" },
];

const activityPhotos: Photo[] = [
  { src: "/images/about/activity-tiec.jpg", alt: "Tiệc tập thể của nhân viên Nha Khoa 2000 trên sân thượng", caption: "Tiệc tập thể" },
  { src: "/images/about/activity-pattaya.jpg", alt: "Đội ngũ chụp ảnh tại Pattaya", caption: "Chuyến đi Pattaya" },
  { src: "/images/about/activity-bien.jpg", alt: "Đội ngũ chụp ảnh trên bãi biển", caption: "Hoạt động ngoài trời" },
  { src: "/images/about/activity-su-kien.jpg", alt: "Sự kiện nội bộ của Nha Khoa 2000", caption: "Sự kiện nội bộ" },
  { src: "/images/about/activity-tiec-ban.jpg", alt: "Nhân viên cùng nhau trong bữa tiệc", caption: "Bữa tiệc cuối năm" },
  { src: "/images/about/activity-van-phong.jpg", alt: "Nhân viên quây quần trong buổi gặp mặt", caption: "Buổi gặp mặt" },
];

function PhotoGrid({ photos, wideFirst = false }: { photos: readonly Photo[]; wideFirst?: boolean }) {
  return (
    <ul className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <li className={wideFirst && index === 0 ? "sm:col-span-2" : ""} key={photo.src}>
          <figure>
            <div className="relative h-60 overflow-hidden rounded bg-background-secondary sm:h-64">
              <Image alt={photo.alt} className="object-cover" fill sizes={wideFirst && index === 0 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"} src={photo.src} />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-text-secondary">{photo.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

const eyebrowClassName = "text-sm font-semibold text-brand-blue-dark";
const headingClassName = "text-3xl font-bold leading-[1.2] tracking-tight text-text-primary sm:text-4xl";
// Same scale and alignment as the section titles on the home page.
const sectionTitleClassName = "text-center text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold uppercase tracking-tight text-text-primary";
const sectionNoteClassName = "mx-auto mt-2 max-w-3xl text-center text-sm leading-relaxed text-text-secondary sm:text-base";
const linkClassName = "inline-flex min-h-11 items-center text-sm font-semibold text-brand-blue-dark underline underline-offset-4 transition-colors duration-300 hover:text-brand-blue-hover motion-reduce:transition-none";

export function AboutPageContent({ content, clinics }: AboutPageContentProps) {
  return (
    <div className="bg-white">
      <section aria-labelledby="about-title" className="pt-6 sm:pt-8">
        <Container>
          <Breadcrumb items={[{ label: "Giới thiệu" }]} />
          <div className="grid items-center gap-8 pb-8 pt-3 sm:pb-8 lg:grid-cols-12 lg:gap-12 lg:pt-6">
            <div className="lg:col-span-6">
              <p className={eyebrowClassName}>{content.hero.eyebrow}</p>
              <h1 className="mt-5 text-[clamp(1.5rem,5vw,2.25rem)] max-w-xl font-extrabold leading-[1.12] tracking-tight text-text-primary" id="about-title">{content.hero.title}</h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-text-secondary">{content.hero.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link className="inline-flex min-h-12 items-center justify-center rounded bg-brand-blue-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-blue-hover motion-reduce:transition-none" href="/bac-si">
                  Gặp đội ngũ bác sĩ
                </Link>
                <a className={linkClassName} href="#ve-chung-toi">Câu chuyện của chúng tôi</a>
              </div>
            </div>
            <figure className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded lg:aspect-[5/6]">
                <Image alt="Không gian thăm khám tại Nha Khoa 2000" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src={content.hero.image} />
              </div>
              <figcaption className="mt-4 text-xs text-text-secondary">Nha Khoa 2000 · TP. Hồ Chí Minh</figcaption>
            </figure>
          </div>

          {content.highlights.length > 0 && (
            <dl className="grid gap-6 border-y border-border-subtle py-7 sm:grid-cols-3 sm:gap-8 sm:py-9">
              {content.highlights.map((item) => (
                <div className="flex items-center gap-5 sm:block sm:border-l sm:border-border-subtle sm:pl-7 sm:first:border-0 sm:first:pl-0" key={item.label}>
                  <dt className="order-2 text-sm leading-6 text-text-secondary sm:mt-2">{item.label}</dt>
                  <dd className="min-w-24 text-4xl font-bold tracking-tight text-brand-blue-dark sm:text-5xl">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>

      <section aria-labelledby="story-title" className="scroll-mt-40 py-8 md:py-10" id="ve-chung-toi">
        <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <figure className="mx-auto w-full max-w-md lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded bg-background-secondary">
              <Image alt={content.story.founderName} className="object-cover object-top" fill sizes="(max-width: 1024px) 448px, 40vw" src={content.story.image} />
            </div>
            <figcaption className="mt-5">
              <p className="font-semibold text-text-primary">{content.story.founderName}</p>
              <p className="mt-1 text-sm text-text-secondary">{content.story.founderRole}</p>
            </figcaption>
          </figure>
          <div className="lg:col-span-7">
            <p className={eyebrowClassName}>{content.story.eyebrow}</p>
            <h2 className={`mt-4 ${headingClassName}`} id="story-title">{content.story.title}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-text-secondary">
              {content.story.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <Link className={`mt-5 ${linkClassName}`} href="/bac-si">Tìm hiểu đội ngũ bác sĩ</Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="history-title" className="scroll-mt-40 border-t border-border-subtle py-8 md:py-10" id="lich-su">
        <Container>
          <h2 className={sectionTitleClassName} id="history-title">Lịch sử hình thành</h2>
          <p className={sectionNoteClassName}>Những hình ảnh lưu lại chặng đường của Nha Khoa 2000 từ ngày đầu thành lập.</p>
          <PhotoGrid photos={historyPhotos} wideFirst />
        </Container>
      </section>

      <div className="border-t border-border-subtle"><VisionMissionSection /></div>

      <CoreValuesSection />

      <section aria-labelledby="facilities-title" className="scroll-mt-40 border-t border-border-subtle py-8 md:py-10" id="co-so-vat-chat">
        <Container>
          <h2 className={sectionTitleClassName} id="facilities-title">Cơ sở vật chất và trang thiết bị</h2>
          <p className={sectionNoteClassName}>Không gian tiếp đón, phòng điều trị và khu tiệt trùng tại phòng khám.</p>
          <PhotoGrid photos={facilityPhotos} />
        </Container>
      </section>

      <section aria-labelledby="expertise-title" className="bg-background-secondary py-12 sm:py-16">
        <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded bg-brand-blue-light lg:col-span-6 lg:aspect-[4/5]">
            <Image alt="Đội ngũ nha khoa tại Nha Khoa 2000" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 50vw" src={content.expertise.image} />
          </div>
          <div className="lg:col-span-6">
            <p className={eyebrowClassName}>{content.expertise.eyebrow}</p>
            <h2 className={`mt-4 ${headingClassName}`} id="expertise-title">{content.expertise.title}</h2>
            <p className="mt-5 leading-8 text-text-secondary">{content.expertise.description}</p>
            <ul className="mt-6 divide-y divide-border-subtle border-t border-border-subtle">
              {content.expertise.commitments.map((commitment, index) => (
                <li className="flex items-start gap-3 py-4 text-sm leading-7 text-text-primary" key={index}>
                  <span>{commitment}</span>
                </li>
              ))}
            </ul>
            <Link className={`mt-2 ${linkClassName}`} href="/dich-vu">Khám phá dịch vụ</Link>
          </div>
        </Container>
      </section>

      <div className="scroll-mt-40" id="he-thong-phong-kham"><ClinicFacilitiesSection /></div>

      <section aria-labelledby="license-title" className="scroll-mt-40 border-t border-border-subtle py-8 md:py-10" id="giay-phep">
        <Container>
          <h2 className={sectionTitleClassName} id="license-title">Giấy phép hoạt động</h2>
          <p className={sectionNoteClassName}>Các giấy phép do cơ quan quản lý cấp cho Nha Khoa 2000, để bạn có thể đối chiếu khi cần.</p>
          <figure className="mx-auto mt-8 max-w-sm">
            <ImageLightbox alt={licenseCaption} caption={licenseCaption} className="relative block aspect-[845/1200] overflow-hidden rounded border border-border-subtle bg-background-secondary" src="/images/about/license-cs1.jpg">
              <Image alt={licenseCaption} className="object-contain" fill sizes="(max-width: 640px) 90vw, 384px" src="/images/about/license-cs1.jpg" />
            </ImageLightbox>
            <figcaption className="mt-3 text-center text-sm leading-6 text-text-secondary">{licenseCaption}</figcaption>
          </figure>
          {content.licenses.length > 0 && (
            <dl className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
              {content.licenses.map((license, index) => (
                <div className="grid gap-1 py-4 sm:grid-cols-12 sm:gap-6" key={index}>
                  <dt className="font-semibold text-text-primary sm:col-span-5">{license.name}</dt>
                  <dd className="text-sm text-text-secondary sm:col-span-3">Số {license.number}</dd>
                  <dd className="text-sm text-text-secondary sm:col-span-4">{license.issuer}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>

      <div className="scroll-mt-40 border-t border-border-subtle" id="bao-hiem">
        <InsurancePartnersSection />
        <section aria-labelledby="insurance-process-title" className="pb-8 md:pb-10">
          <Container>
            <h3 className="text-center text-xl font-bold text-text-primary" id="insurance-process-title">Quy trình bảo lãnh viện phí</h3>
            <ol className="mt-6 grid gap-8 md:grid-cols-4 md:gap-6">
              {insuranceSteps.map((step, index) => (
                <li className="border-t-2 border-brand-blue-dark pt-4" key={step.title}>
                  <span className="text-sm font-semibold tabular-nums text-brand-blue-dark">Bước {index + 1}</span>
                  <h4 className="mt-2 font-bold text-text-primary">{step.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{step.description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-7 text-text-secondary">
              Danh sách công ty bảo hiểm liên kết được cập nhật thường xuyên. Hãy gọi hotline hoặc hỏi tại quầy tiếp đón:{" "}
              {clinics.map((clinic, index) => (
                <span key={clinic.id}>{index > 0 ? "; " : ""}{clinic.name}{" "}<a className="font-semibold text-brand-blue-dark" href={`tel:${clinic.phone.replace(/\s/g, "")}`}>{clinic.phone}</a></span>
              ))}.
            </p>
          </Container>
        </section>
      </div>

      <section aria-labelledby="activities-title" className="scroll-mt-40 border-t border-border-subtle py-8 md:py-10" id="hoat-dong">
        <Container>
          <h2 className={sectionTitleClassName} id="activities-title">Hoạt động nội bộ</h2>
          <p className={sectionNoteClassName}>Những hoạt động của đội ngũ Nha Khoa 2000 ngoài giờ khám.</p>
          <PhotoGrid photos={activityPhotos} />
          {content.activities.length > 0 && (
            <ol className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
              {content.activities.map((activity, index) => (
                <li className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-6" key={index}>
                  <time className="text-sm font-semibold text-brand-blue-dark sm:col-span-3">{activity.date}</time>
                  <div className="sm:col-span-9">
                    <h3 className="font-bold text-text-primary">{activity.title}</h3>
                    {activity.description && <p className="mt-2 text-sm leading-7 text-text-secondary">{activity.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>

      <div className="scroll-mt-40 border-t border-border-subtle" id="hoi-dap"><FAQSection filterable placement="about" /></div>
    </div>
  );
}
