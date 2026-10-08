"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import type { ContactCtaSettings } from "@/features/content/schemas/contact-cta.schema";

export function FloatingContactActions({ clinics, settings }: { clinics: readonly Clinic[]; settings: ContactCtaSettings }) {
  const [activePanel, setActivePanel] = useState<"phone" | "zalo" | null>(null);
  const [pinnedPanel, setPinnedPanel] = useState<"phone" | "zalo" | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const phoneButtonRef = useRef<HTMLButtonElement>(null);
  const zaloButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = activePanel === "phone";
  const isZaloOpen = activePanel === "zalo";

  useEffect(() => {
    if (!activePanel) return;
    function close(): void {
      setActivePanel(null);
      setPinnedPanel(null);
    }
    function handlePointerDown(event: PointerEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) close();
    }
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Escape") return;
      if (containerRef.current?.contains(document.activeElement)) {
        (activePanel === "phone" ? phoneButtonRef.current : zaloButtonRef.current)?.focus();
      }
      close();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePanel]);

  function togglePanel(panel: "phone" | "zalo"): void {
    const nextPanel = pinnedPanel === panel ? null : panel;
    setPinnedPanel(nextPanel);
    setActivePanel(nextPanel);
  }

  function panelEvents(panel: "phone" | "zalo") {
    return {
      onPointerEnter: (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && !pinnedPanel) setActivePanel(panel);
      },
      onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
        if (!pinnedPanel && !event.currentTarget.contains(document.activeElement)) setActivePanel(null);
      },
      onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setActivePanel((current) => current === panel ? null : current);
          setPinnedPanel((current) => current === panel ? null : current);
        }
      },
    };
  }
  const showPhone = settings.showPhone && clinics.length > 0;
  const zaloClinics = clinics.filter((clinic) => Boolean(settings.zaloLinks[clinic.id]));
  if (!showPhone && !settings.facebookUrl && zaloClinics.length === 0) return null;

  return (
    <aside ref={containerRef} aria-label="Liên hệ nhanh" className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex w-full flex-col items-end gap-3 pr-[max(1rem,env(safe-area-inset-right))] sm:bottom-6 sm:pr-5">
      {showPhone ? <div className="pointer-events-auto relative flex items-center justify-end after:absolute after:inset-y-0 after:right-full after:w-3 after:content-['']" {...panelEvents("phone")}>
        <button aria-controls="floating-contact-phones" aria-expanded={isOpen} aria-label="Chọn cơ sở để gọi điện" className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-brand-green-dark text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-brand-green-hover active:scale-95 sm:h-12 sm:w-12" onClick={() => togglePanel("phone")} ref={phoneButtonRef} type="button">
          <span aria-hidden="true" className="motion-safe:absolute motion-safe:inset-0 motion-safe:animate-ping rounded-full bg-brand-green opacity-30" />
          <Icon className="relative z-10 h-6 w-6" name="phone" />
        </button>
        <div aria-hidden={!isOpen} inert={!isOpen} className={`absolute bottom-0 right-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain w-[min(17rem,calc(100vw-6rem))] rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xl transition-[transform,opacity,visibility] duration-300 ${isOpen ? "visible pointer-events-auto translate-x-0 opacity-100" : "invisible pointer-events-none translate-x-2 opacity-0"}`} id="floating-contact-phones">
          <div className="space-y-1.5">
            {clinics.map((clinic, index) => <a className="group/item flex min-h-11 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50" href={`tel:${clinic.phone.replace(/\s+/g, "")}`} key={clinic.id}><span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-text-primary group-hover/item:bg-brand-green-hover group-hover/item:text-white">CS{index + 1}</span><span className="min-w-0 text-left"><span className="block text-sm font-bold text-text-primary">{clinic.phone}</span><span className="block text-xs leading-relaxed text-text-secondary">{clinic.address}</span></span></a>)}
          </div>
        </div>
      </div> : null}
      {settings.facebookUrl ? <a aria-label="Liên hệ qua Facebook" className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-xl transition hover:scale-105 hover:bg-[#1264d3] sm:h-12 sm:w-12" href={settings.facebookUrl} rel="noopener noreferrer" target="_blank"><svg aria-hidden="true" className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" /></svg></a> : null}
      {zaloClinics.length > 0 ? <div className="pointer-events-auto relative flex items-center justify-end after:absolute after:inset-y-0 after:right-full after:w-3 after:content-['']" {...panelEvents("zalo")}>
        <button aria-controls="floating-contact-zalo" aria-expanded={isZaloOpen} aria-label="Chọn Zalo của cơ sở" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0068ff] text-sm font-extrabold tracking-tight text-white shadow-xl transition hover:scale-105 hover:bg-[#0058d8] sm:h-12 sm:w-12" onClick={() => togglePanel("zalo")} ref={zaloButtonRef} type="button">Zalo</button>
        <div aria-hidden={!isZaloOpen} inert={!isZaloOpen} className={`absolute bottom-0 right-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain w-[min(17rem,calc(100vw-6rem))] rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xl transition-[transform,opacity,visibility] duration-300 ${isZaloOpen ? "visible pointer-events-auto translate-x-0 opacity-100" : "invisible pointer-events-none translate-x-2 opacity-0"}`} id="floating-contact-zalo">
          <div className="space-y-1.5">
            {zaloClinics.map((clinic) => {
              const clinicIndex = clinics.findIndex(({ id }) => id === clinic.id);
              return <a className="flex min-h-11 items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50" href={settings.zaloLinks[clinic.id]} key={clinic.id} rel="noopener noreferrer" target="_blank"><span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0068ff] text-xs font-bold text-white">CS{clinicIndex + 1}</span><span className="min-w-0 text-left"><span className="block text-sm font-bold text-text-primary">Zalo · {clinic.phone}</span><span className="block text-xs leading-relaxed text-text-secondary">{clinic.address}</span></span></a>;
            })}
          </div>
        </div>
      </div> : null}
    </aside>
  );
}
