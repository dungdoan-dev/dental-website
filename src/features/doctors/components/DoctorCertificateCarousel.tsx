"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { DoctorCertificate } from "../types/doctor.type";

type DoctorCertificateCarouselProps = { certificates: readonly DoctorCertificate[] };

const cardsPerPage = 2;

export function DoctorCertificateCarousel({ certificates }: DoctorCertificateCarouselProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(certificates.length / cardsPerPage);
  const visibleCertificates = certificates.slice(page * cardsPerPage, (page + 1) * cardsPerPage);

  if (certificates.length === 0) return null;

  return (
    <section aria-label="Hình ảnh chứng chỉ và bằng cấp" className="space-y-4 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-2"><h2 className="text-lg font-bold uppercase tracking-tight text-text-primary">Hình Ảnh Chứng Chỉ &amp; Bằng Cấp</h2><div className="flex items-center gap-2"><button aria-label="Xem chứng chỉ trước" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white text-text-primary shadow-sm transition hover:border-brand-blue hover:bg-brand-blue-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-40" disabled={page === 0} onClick={() => setPage((current) => current - 1)} type="button"><Icon className="h-4 w-4" name="arrow-left" /></button><button aria-label="Xem chứng chỉ tiếp theo" className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white text-text-primary shadow-sm transition hover:border-brand-blue hover:bg-brand-blue-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-40" disabled={page === pageCount - 1} onClick={() => setPage((current) => current + 1)} type="button"><Icon className="h-4 w-4" name="arrow-right" /></button></div></div>
      <p className="text-sm leading-relaxed text-text-secondary">Ảnh tài liệu được đăng trên website chính thức của Nha Khoa 2000.</p>
      <div aria-live="polite" className="grid gap-4 md:grid-cols-2">{visibleCertificates.map((certificate) => <article className="group flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm transition hover:shadow-md" key={certificate.image}><a aria-label={`Xem ảnh: ${certificate.title}`} className="relative block aspect-[4/3] overflow-hidden border-b border-border-subtle bg-[#f8fafc] p-3" href={certificate.image} rel="noopener noreferrer" target="_blank"><Image alt={certificate.title} className="object-contain p-3 transition-transform duration-300 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 350px" src={certificate.image} /></a><div className="flex flex-1 flex-col justify-between gap-3 p-4"><div><h3 className="text-sm font-bold leading-snug text-text-primary">{certificate.title}</h3><p className="mt-1 text-xs leading-relaxed text-text-secondary">{certificate.issuer}</p></div><p className="border-t border-border-subtle pt-2.5 text-xs font-semibold text-brand-blue-dark">{certificate.detail}</p></div></article>)}</div>
      {pageCount > 1 ? <div aria-label="Chọn trang chứng chỉ" className="flex items-center justify-center gap-2">{Array.from({ length: pageCount }, (_, index) => <button aria-current={index === page ? "page" : undefined} aria-label={`Đến trang chứng chỉ ${index + 1}`} className={`h-2 rounded-full transition-all ${index === page ? "w-7 bg-brand-blue" : "w-2 bg-border-subtle hover:bg-brand-blue/50"}`} key={index} onClick={() => setPage(index)} type="button" />)}</div> : null}
    </section>
  );
}
