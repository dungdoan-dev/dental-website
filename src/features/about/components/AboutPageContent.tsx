import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { Icon } from "@/components/ui/Icon";
import { ClinicCard } from "@/features/clinics/components/ClinicCard";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import type { AboutPageData } from "../schemas/about.schema";

type AboutPageContentProps = { content: AboutPageData; clinics: readonly Clinic[] };

const eyebrowClassName = "text-xs font-bold uppercase tracking-[0.16em] text-brand-blue-dark sm:text-sm";
const headingClassName = "text-3xl font-bold leading-[1.2] tracking-tight text-text-primary sm:text-4xl";
const linkClassName = "inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-blue-dark transition-colors duration-300 hover:text-brand-blue-hover motion-reduce:transition-none";

export function AboutPageContent({ content, clinics }: AboutPageContentProps) {
  return (
    <div className="bg-white">
      <section aria-labelledby="about-title" className="pt-6 sm:pt-8">
        <Container>
          <Breadcrumb items={[{ label: "Giới thiệu" }]} />
          <div className="grid items-center gap-8 pb-10 pt-3 sm:pb-12 lg:grid-cols-12 lg:gap-12 lg:pt-6">
            <div className="lg:col-span-6">
              <p className={eyebrowClassName}>{content.hero.eyebrow}</p>
              <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-text-primary sm:text-5xl lg:text-[3.4rem]" id="about-title">{content.hero.title}</h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-text-secondary">{content.hero.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-brand-blue-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-blue-hover motion-reduce:transition-none" href="/bac-si">
                  Gặp đội ngũ bác sĩ <Icon className="h-4 w-4" name="arrow-right" />
                </Link>
                <a className={linkClassName} href="#hanh-trinh">Câu chuyện của chúng tôi <Icon className="h-4 w-4" name="chevron-down" /></a>
              </div>
            </div>
            <figure className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] bg-background-secondary sm:rounded-tl-[5rem] sm:rounded-br-[5rem] lg:aspect-[5/6]">
                <Image alt="Không gian thăm khám tại Nha Khoa 2000" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src={content.hero.image} />
              </div>
              <figcaption className="mt-4 flex items-center gap-3 text-xs text-text-secondary">
                <span aria-hidden="true" className="h-px w-8 bg-brand-green" />Nha Khoa 2000 · TP. Hồ Chí Minh
              </figcaption>
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
          <nav aria-label="Các mục giới thiệu" className="flex flex-wrap gap-x-7 gap-y-1 border-b border-border-subtle py-3 text-sm font-medium text-text-secondary">
            <a className="inline-flex min-h-11 items-center transition-colors hover:text-brand-blue-dark" href="#hanh-trinh">Hành trình</a>
            <a className="inline-flex min-h-11 items-center transition-colors hover:text-brand-blue-dark" href="#dinh-huong">Tầm nhìn &amp; sứ mệnh</a>
            <a className="inline-flex min-h-11 items-center transition-colors hover:text-brand-blue-dark" href="#nguyen-tac">Nguyên tắc làm nghề</a>
            <a className="inline-flex min-h-11 items-center transition-colors hover:text-brand-blue-dark" href="#he-thong-phong-kham">Hệ thống phòng khám</a>
          </nav>
        </Container>
      </section>

      <section aria-labelledby="story-title" className="py-12 sm:py-16 lg:py-20" id="hanh-trinh">
        <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <figure className="mx-auto w-full max-w-md lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-background-secondary">
              <Image alt={content.story.founderName} className="object-cover object-top" fill sizes="(max-width: 1024px) 448px, 40vw" src={content.story.image} />
            </div>
            <figcaption className="border-l-2 border-brand-green py-1 pl-4 mt-5">
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
            <Link className={`mt-5 ${linkClassName}`} href="/bac-si">Tìm hiểu đội ngũ bác sĩ <Icon className="h-4 w-4" name="arrow-right" /></Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="direction-title" className="bg-brand-blue-dark py-12 text-white sm:py-16" id="dinh-huong">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90 sm:text-sm">{content.visionMission.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl" id="direction-title">{content.visionMission.title}</h2>
            </div>
            <p className="max-w-2xl leading-8 text-white/90 lg:col-span-7 lg:pt-1">{content.visionMission.introduction}</p>
          </div>
          <div className="mt-9 grid gap-8 border-t border-white/25 pt-8 md:grid-cols-2 md:gap-12">
            <article>
              <div className="flex items-center gap-4"><Icon className="h-6 w-6 shrink-0" name="map" /><h3 className="text-xl font-semibold">Tầm nhìn</h3></div>
              <p className="mt-4 leading-8 text-white/90">{content.visionMission.vision}</p>
            </article>
            <article className="border-t border-white/25 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <div className="flex items-center gap-4"><Icon className="h-6 w-6 shrink-0" name="shield-check" /><h3 className="text-xl font-semibold">Sứ mệnh</h3></div>
              <p className="mt-4 leading-8 text-white/90">{content.visionMission.mission}</p>
            </article>
          </div>
        </Container>
      </section>

      <section aria-labelledby="principles-title" className="py-12 sm:py-16 lg:py-20" id="nguyen-tac">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className={eyebrowClassName}>{content.principles.eyebrow}</p>
              <h2 className={`mt-4 ${headingClassName}`} id="principles-title">{content.principles.title}</h2>
            </div>
            <p className="max-w-xl leading-8 text-text-secondary lg:self-end">{content.principles.introduction}</p>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {content.principles.items.map((principle) => (
              <article className="border-t-2 border-border-subtle pt-6" key={principle.number}>
                <span className="text-sm font-semibold tabular-nums text-brand-blue-dark">{principle.number}</span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-text-primary">{principle.title}</h3>
                <p className="mt-3 text-base leading-7 text-text-secondary">{principle.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="expertise-title" className="bg-background-secondary py-12 sm:py-16">
        <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-blue-light lg:col-span-6 lg:aspect-[4/5]">
            <Image alt="Đội ngũ nha khoa tại Nha Khoa 2000" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 50vw" src={content.expertise.image} />
          </div>
          <div className="lg:col-span-6">
            <p className={eyebrowClassName}>{content.expertise.eyebrow}</p>
            <h2 className={`mt-4 ${headingClassName}`} id="expertise-title">{content.expertise.title}</h2>
            <p className="mt-5 leading-8 text-text-secondary">{content.expertise.description}</p>
            <ul className="mt-6 divide-y divide-border-subtle border-t border-border-subtle">
              {content.expertise.commitments.map((commitment, index) => (
                <li className="flex items-start gap-3 py-4 text-sm leading-7 text-text-primary" key={index}>
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-brand-green-hover" name="check" /><span>{commitment}</span>
                </li>
              ))}
            </ul>
            <Link className={`mt-2 ${linkClassName}`} href="/dich-vu">Khám phá dịch vụ <Icon className="h-4 w-4" name="arrow-right" /></Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="clinics-title" className="py-12 sm:py-16 lg:py-20" id="he-thong-phong-kham">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className={eyebrowClassName}>{content.clinics.eyebrow}</p>
              <h2 className={`mt-4 ${headingClassName}`} id="clinics-title">{content.clinics.title}</h2>
            </div>
            <p className="max-w-xl leading-8 text-text-secondary lg:self-end">{content.clinics.description}</p>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {clinics.map((clinic) => <ClinicCard clinic={clinic} key={clinic.id} />)}
          </div>
          <div className="mt-9 flex flex-col gap-4 border-t border-border-subtle pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-text-primary">Kết nối với Nha Khoa 2000</p>
            <Link className={linkClassName} href="/lien-he">Thông tin liên hệ <Icon className="h-4 w-4" name="arrow-right" /></Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
