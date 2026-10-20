"use client";

import { useEffect, useRef, useState } from "react";

// Sticky jump bar for long forms. Put it first inside the <form>; it lists the form's direct
// <fieldset>/<details> children (label from data-nav, else legend/summary) and hides itself under 3 sections.
export function FormSectionNav() {
  const ref = useRef<HTMLElement>(null);
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const form = ref.current?.parentElement;
    if (!form) return;
    const sections = Array.from(form.querySelectorAll<HTMLElement>(":scope > fieldset, :scope > details"));
    setItems(sections.map((section, index) => {
      section.id ||= `form-section-${index}`;
      section.style.scrollMarginTop = "3.5rem";
      return { id: section.id, label: section.dataset.nav ?? section.querySelector(":scope > legend, :scope > summary")?.textContent?.trim() ?? `Mục ${index + 1}` };
    }));
    const observer = new IntersectionObserver((entries) => {
      const first = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (first) setActive(first.target.id);
    }, { root: form, rootMargin: "0px 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Các mục của biểu mẫu" className="sticky top-0 z-10 -mx-1 flex gap-2 overflow-x-auto bg-white/95 px-1 py-2 backdrop-blur" hidden={items.length < 3} ref={ref}>
      {items.map((item) => (
        <button aria-current={active === item.id ? "true" : undefined} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${active === item.id ? "bg-brand-blue-dark text-white" : "bg-surface-container-low text-text-secondary hover:bg-brand-blue-light hover:text-brand-blue-dark"}`} key={item.id} onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })} type="button">{item.label}</button>
      ))}
    </nav>
  );
}
