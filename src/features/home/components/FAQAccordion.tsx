"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { FAQItem } from "../types/home.type";

export function FAQAccordion({ items, title, note, TitleTag = "h2" }: { items: readonly FAQItem[]; title: string; note: string; TitleTag?: "h1" | "h2" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-5 lg:py-6">
      <div className="mx-auto max-w-4xl px-margin-mobile md:px-margin">
        <div className="mx-auto mb-4 max-w-2xl space-y-1 text-center">
          <TitleTag className="whitespace-nowrap text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold tracking-tight text-text-primary">
            {title}
          </TitleTag>
          <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
            {note}
          </p>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <article className="overflow-hidden rounded-2xl bg-surface transition-all duration-200" key={item.question}>
                <h3>
                  <button
                    aria-controls={answerId}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-base font-bold sm:text-lg text-text-primary transition hover:text-brand-blue"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} name="chevron-down" />
                  </button>
                </h3>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  id={answerId}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary sm:text-base">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
