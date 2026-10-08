import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { siteConfig } from "@/config/site";
import type { ServiceDetailData } from "../schemas/service-detail.schema";
import type { DentalService } from "../types/service.type";

export function ServiceDetailPageContent({ service, content }: { service: DentalService; content: ServiceDetailData }) {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-7 md:px-8 md:pb-24">
          <Breadcrumb items={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: service.name }]} />
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              {content.eyebrow ? <span className="inline-flex rounded-full bg-brand-blue-light px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue-dark">{content.eyebrow}</span> : null}
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-text-primary md:text-5xl">{content.title}</h1>
              <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-text-secondary md:text-lg">{content.introduction}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="rounded-full bg-brand-blue-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition hover:bg-brand-blue-hover" href="/lien-he">Đặt lịch tư vấn</Link>
                <a className="rounded-full border border-brand-blue-dark px-6 py-3.5 text-sm font-bold text-brand-blue-dark transition hover:bg-brand-blue-light" href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>Gọi {siteConfig.contact.phone}</a>
              </div>
              {content.highlights.length ? <ul className="mt-10 grid gap-3 border-t border-border-subtle pt-6 text-sm text-text-secondary sm:grid-cols-2">{content.highlights.map((highlight) => <li className="flex items-start gap-2" key={highlight}><span aria-hidden="true" className="mt-0.5 text-brand-blue-dark">✓</span><span>{highlight}</span></li>)}</ul> : null}
            </div>
            <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-brand-blue-light shadow-2xl shadow-brand-blue/10 sm:min-h-[430px]">
              <Image alt={service.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 45vw" src={service.image} />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:inset-x-auto sm:bottom-7 sm:left-7 sm:max-w-sm"><p className="text-sm font-semibold leading-6 text-text-primary">Bác sĩ sẽ thăm khám và tư vấn kế hoạch phù hợp với tình trạng của từng khách hàng.</p></div>
            </div>
          </div>
        </div>
      </section>

      {content.prices.length ? <section className="bg-background-secondary py-16 md:py-20" id="bang-gia-dich-vu"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="max-w-3xl"><span className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue-dark">Chi phí tham khảo</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Bảng giá {service.name}</h2></div><div className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-border-subtle"><table className="min-w-[600px] w-full text-left text-sm"><thead className="bg-brand-blue-dark text-white"><tr><th className="px-6 py-4 font-semibold">Hạng mục</th><th className="px-6 py-4 font-semibold">Ghi chú</th><th className="px-6 py-4 text-right font-semibold">Giá tham khảo</th></tr></thead><tbody className="divide-y divide-border-subtle">{content.prices.map((item, index) => <tr className="align-top" key={`${item.name}-${index}`}><th className="px-6 py-5 font-bold text-text-primary">{item.name}</th><td className="px-6 py-5 text-text-secondary">{item.detail}</td><td className="whitespace-nowrap px-6 py-5 text-right font-extrabold text-brand-blue-dark">{item.price}</td></tr>)}</tbody></table></div>{content.priceSourceUrl ? <p className="mt-4 text-sm text-text-secondary">Tham khảo <a className="font-semibold text-brand-blue-dark underline underline-offset-2" href={content.priceSourceUrl} rel="noreferrer" target="_blank">bảng giá gốc</a>. Chi phí cụ thể cần được xác nhận sau khi thăm khám.</p> : <p className="mt-4 text-sm text-text-secondary">Chi phí thực tế được xác nhận sau khi bác sĩ thăm khám và tư vấn.</p>}</div></section> : null}

      {content.steps.length ? <section className="bg-white py-16 md:py-20"><div className="mx-auto max-w-7xl px-5 md:px-8"><span className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue-dark">Lộ trình điều trị</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Quy trình thực hiện</h2><ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{content.steps.map((step, index) => <li className="rounded-3xl border border-border-subtle bg-background-secondary p-6" key={`${step.number}-${index}`}><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-light text-lg font-extrabold text-brand-blue-dark">{step.number || String(index + 1).padStart(2, "0")}</span><h3 className="mt-6 text-lg font-bold text-text-primary">{step.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-7 text-text-secondary">{step.description}</p></li>)}</ol></div></section> : null}

      {content.faqs.length ? <section className="bg-brand-blue-light/60 py-16 md:py-20"><div className="mx-auto max-w-4xl px-5 md:px-8"><div className="text-center"><span className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue-dark">Giải đáp trước điều trị</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Câu hỏi thường gặp</h2></div><div className="mt-8 space-y-3">{content.faqs.map((item, index) => <details className="group rounded-2xl bg-white px-6 py-5 shadow-sm" key={`${item.question}-${index}`}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-text-primary [&::-webkit-details-marker]:hidden">{item.question}<span aria-hidden="true" className="text-2xl font-normal text-brand-blue-dark transition group-open:rotate-45">+</span></summary><p className="mt-4 whitespace-pre-line border-t border-border-subtle pt-4 text-sm leading-7 text-text-secondary">{item.answer}</p></details>)}</div><p className="mt-6 text-center text-sm text-text-secondary">Thông tin chỉ mang tính tham khảo và không thay thế việc thăm khám với bác sĩ.</p></div></section> : null}
    </>
  );
}
