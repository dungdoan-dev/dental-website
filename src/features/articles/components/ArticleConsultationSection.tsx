"use client";

import { useRef, type FormEvent, type MouseEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

export function ArticleConsultationSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const question = String(data.get("question") ?? "").trim();
    const subject = encodeURIComponent(`Câu hỏi nha khoa từ ${name}`);
    const body = encodeURIComponent(`Họ tên: ${name}\nĐiện thoại: ${phone}\n\nCâu hỏi:\n${question}`);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }

  return (
    <section className="bg-surface pb-20">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue-light via-white to-brand-green-light p-8 text-center shadow-[0_12px_40px_rgba(20,70,85,0.06)] lg:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-green/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl"><h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl">Bạn Cần Tư Vấn Trực Tiếp Từ Bác Sĩ Chuyên Khoa?</h2><p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">Gửi câu hỏi về tình trạng răng miệng hoặc đặt lịch thăm khám tại hai cơ sở của Nha Khoa 2000.</p><div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"><Link className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-blue-dark px-8 py-3.5 font-semibold text-white shadow-md transition hover:bg-brand-blue sm:w-auto" href="/bac-si#booking-section"><Icon name="calendar" />Đặt Lịch Thăm Khám</Link><button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-text-primary shadow-sm transition hover:bg-surface-container-low sm:w-auto" onClick={() => dialogRef.current?.showModal()} type="button"><Icon className="text-brand-green" name="chat" />Gửi Câu Hỏi Cho Bác Sĩ</button></div><div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">{siteConfig.clinics.map((clinic) => <span className="inline-flex items-center gap-1.5" key={clinic.id}><Icon className="h-4 w-4 text-brand-blue-dark" name="location" />{clinic.label}: {clinic.address}</span>)}</div></div>
        </div>
      </div>
      <dialog aria-labelledby="question-dialog-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-6 text-text-primary shadow-[0_24px_64px_rgba(20,70,85,0.2)] backdrop:bg-black/40 backdrop:backdrop-blur-sm lg:p-8" onClick={handleBackdropClick} ref={dialogRef}>
        <button aria-label="Đóng" className="absolute right-5 top-5 rounded-full p-1 text-outline transition hover:bg-surface-container-low hover:text-text-primary" onClick={() => dialogRef.current?.close()} type="button"><Icon name="close" /></button>
        <div className="mb-3 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue-dark"><Icon className="h-4 w-4" name="chat" /></span><h3 className="pr-5 text-xl font-bold" id="question-dialog-title">Gửi Thắc Mắc Đến Bác Sĩ</h3></div>
        <p className="mb-5 text-sm leading-relaxed text-text-secondary">Điền câu hỏi, sau đó ứng dụng email của bạn sẽ mở thư gửi đến {siteConfig.contact.email}.</p>
        <form className="space-y-3" onSubmit={handleSubmit}><label className="block text-sm font-semibold">Họ và tên<input className="mt-1 w-full rounded-xl bg-surface-container-low px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-blue/30" maxLength={100} name="name" placeholder="Nguyễn Văn A" required type="text" /></label><label className="block text-sm font-semibold">Số điện thoại / Zalo<input className="mt-1 w-full rounded-xl bg-surface-container-low px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-blue/30" maxLength={20} name="phone" placeholder="0901 234 567" required type="tel" /></label><label className="block text-sm font-semibold">Nội dung thắc mắc<textarea className="mt-1 w-full resize-y rounded-xl bg-surface-container-low px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-blue/30" maxLength={1000} name="question" placeholder="Mô tả tình trạng hoặc câu hỏi của bạn..." required rows={4} /></label><div className="flex justify-end gap-2 pt-2"><button className="rounded-full px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-container-low" onClick={() => dialogRef.current?.close()} type="button">Hủy</button><button className="rounded-full bg-brand-blue-dark px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue" type="submit">Mở email để gửi</button></div></form>
      </dialog>
    </section>
  );
}
