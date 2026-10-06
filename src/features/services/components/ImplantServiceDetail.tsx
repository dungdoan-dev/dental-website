import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { siteConfig } from "@/config/site";
import { ImplantBookingForm } from "./ImplantBookingForm";
import { implantFaqs, implantPrices, implantPriceSource, implantSteps } from "../data/implant-detail.data";
import type { DentalService } from "../types/service.type";

type ImplantServiceDetailProps = { service: DentalService };

export function ImplantServiceDetail({ service }: ImplantServiceDetailProps) {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-7 md:px-8 md:pb-24">
          <Breadcrumb items={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: service.name }]} />
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="inline-flex rounded-full bg-brand-blue-light px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-blue-dark">Nha khoa chuyên sâu · Implant</span>
              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-text-primary md:text-5xl lg:text-[3.5rem]">Dịch vụ cấy ghép <span className="text-brand-blue-dark">Implant kỹ thuật số</span></h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-text-secondary md:text-lg">Phục hồi răng mất bằng kế hoạch điều trị cá nhân hóa. Bác sĩ thăm khám, đánh giá xương hàm và lựa chọn phương án cấy ghép phù hợp với tình trạng của bạn.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="rounded-full bg-brand-blue-dark px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-blue/20 transition hover:bg-[#056697]" href="#tu-van-implant">Đặt lịch tư vấn</a>
                <a className="rounded-full border border-brand-blue-dark px-6 py-3.5 text-sm font-bold text-brand-blue-dark transition hover:bg-brand-blue-light" href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>Gọi {siteConfig.contact.phone}</a>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 border-t border-border-subtle pt-6 text-sm text-text-secondary sm:grid-cols-3">
                <p><span className="block text-xl font-extrabold text-text-primary">2 cơ sở</span>Tại TP. Hồ Chí Minh</p>
                <p><span className="block text-xl font-extrabold text-text-primary">CT 3D</span>Đánh giá theo chỉ định</p>
                <p><span className="block text-xl font-extrabold text-text-primary">Cá nhân hóa</span>Kế hoạch theo từng ca</p>
              </div>
            </div>
            <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-brand-blue-light shadow-2xl shadow-brand-blue/10 sm:min-h-[430px]">
              <Image alt="Minh họa điều trị cấy ghép Implant" className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 45vw" src={service.image} />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-auto sm:max-w-xs"><p className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark">Tư vấn trước điều trị</p><p className="mt-1 text-sm font-semibold leading-6 text-text-primary">Kế hoạch và chi phí được xác định sau khi bác sĩ thăm khám.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background-secondary py-16 md:py-24" id="bang-gia-implant">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-blue-dark">Chi phí tham khảo</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Bảng giá cấy ghép Implant</h2><p className="mt-4 leading-7 text-text-secondary">Các mức dưới đây theo bảng giá chi tiết công khai ngày 19/04/2024 của Nha Khoa 2000. Giá thực tế cần được xác nhận tại cơ sở và có thể thay đổi theo chỉ định.</p></div>
          <div className="mt-9 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-border-subtle">
            <table className="min-w-[660px] w-full text-left text-sm"><caption className="sr-only">Giá tham khảo các kỹ thuật cấy ghép Implant</caption><thead className="bg-brand-blue-dark text-white"><tr><th className="px-6 py-4 font-semibold" scope="col">Danh mục kỹ thuật</th><th className="px-6 py-4 font-semibold" scope="col">Ghi chú</th><th className="px-6 py-4 text-right font-semibold" scope="col">Đơn giá tham khảo</th></tr></thead><tbody className="divide-y divide-border-subtle">{implantPrices.map((item) => <tr className="align-top" key={item.name}><th className="px-6 py-5 font-bold text-text-primary" scope="row">{item.name}</th><td className="px-6 py-5 text-text-secondary">{item.detail}</td><td className="whitespace-nowrap px-6 py-5 text-right font-extrabold text-brand-blue-dark">{item.price}</td></tr>)}</tbody></table>
          </div>
          <p className="mt-5 text-sm leading-6 text-text-secondary">Các kỹ thuật như ghép xương có thể được chỉ định riêng; không nên hiểu khoảng giá trên là giá trọn gói cho mọi trường hợp. Xem <a className="font-semibold text-brand-blue-dark underline underline-offset-2" href={implantPriceSource} rel="noreferrer" target="_blank">bảng giá gốc của Nha Khoa 2000</a> hoặc <Link className="font-semibold text-brand-blue-dark underline underline-offset-2" href="/bang-gia">trang bảng giá</Link>.</p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" id="quy-trinh-implant">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-blue-dark">Lộ trình điều trị</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Quy trình 4 bước</h2><p className="mt-4 leading-7 text-text-secondary">Thời gian và các bước chi tiết phụ thuộc vào đánh giá lâm sàng, khả năng lành thương và nhu cầu phục hình của từng người.</p></div>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{implantSteps.map((step) => <li className="rounded-3xl border border-border-subtle bg-background-secondary p-6" key={step.number}><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-light text-lg font-extrabold text-brand-blue-dark">{step.number}</span><h3 className="mt-7 text-lg font-bold text-text-primary">{step.title}</h3><p className="mt-3 text-sm leading-7 text-text-secondary">{step.description}</p></li>)}</ol>
        </div>
      </section>

      <section className="bg-brand-blue-light/60 py-16 md:py-24" id="faq-implant"><div className="mx-auto max-w-4xl px-5 md:px-8"><div className="text-center"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-blue-dark">Giải đáp trước điều trị</span><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">Câu hỏi thường gặp về Implant</h2></div><div className="mt-9 space-y-3">{implantFaqs.map((item) => <details className="group rounded-2xl bg-white px-6 py-5 shadow-sm" key={item.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-text-primary [&::-webkit-details-marker]:hidden">{item.question}<span aria-hidden="true" className="text-2xl font-normal text-brand-blue-dark transition group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-border-subtle pt-4 text-sm leading-7 text-text-secondary">{item.answer}</p></details>)}</div><p className="mt-6 text-center text-sm text-text-secondary">Thông tin chỉ mang tính tham khảo và không thay thế việc thăm khám với bác sĩ.</p></div></section>

      <section className="bg-gradient-to-br from-brand-blue-dark to-[#095574] py-16 md:py-24" id="tu-van-implant"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div className="text-white"><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">Tư vấn Implant</span><h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">Trao đổi cùng đội ngũ nha khoa</h2><p className="mt-5 leading-8 text-white/80">Để lại thông tin để kiểm tra biểu mẫu, hoặc gọi trực tiếp cho cơ sở gần bạn để đặt lịch thăm khám và nhận tư vấn thực tế.</p><div className="mt-8 space-y-3 text-sm">{siteConfig.clinics.map((clinic) => <a className="block rounded-xl border border-white/20 bg-white/10 px-5 py-4 transition hover:bg-white/20" href={`tel:${clinic.phone.replace(/\s/g, "")}`} key={clinic.id}>{clinic.label} · {clinic.address}<span className="block pt-1 font-bold">{clinic.phone}</span></a>)}</div></div><ImplantBookingForm serviceId={service.id} /></div></section>
    </>
  );
}
