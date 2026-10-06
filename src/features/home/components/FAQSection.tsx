"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { faqItems } from "../data/faq.data";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-margin-mobile md:px-margin">
        <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center"><span className="block text-[13px] font-bold uppercase tracking-widest text-brand-blue">GIẢI ĐÁP THẮC MẮC</span><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-[2.5rem]">Câu hỏi thường gặp khi đến với Nha Khoa 2000</h2><p className="text-text-secondary">Mọi thắc mắc của bạn luôn được đội ngũ chuyên môn giải đáp chi tiết, minh bạch và khoa học nhất.</p></div>
        <div className="space-y-4">{faqItems.map((item, index) => { const isOpen = openIndex === index; const answerId = `faq-answer-${index}`; return <article className="overflow-hidden rounded-2xl bg-surface transition-all duration-200" key={item.question}><h3><button aria-controls={answerId} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-6 text-left text-xl font-bold text-text-primary transition hover:text-brand-blue" onClick={() => setOpenIndex(isOpen ? null : index)} type="button"><span>{item.question}</span><Icon className={`h-6 w-6 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} name="chevron-down" /></button></h3><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} id={answerId}><div className="overflow-hidden"><p className="px-6 pb-6 leading-relaxed text-text-secondary">{item.answer}</p></div></div></article>; })}</div>
      </div>
    </section>
  );
}
