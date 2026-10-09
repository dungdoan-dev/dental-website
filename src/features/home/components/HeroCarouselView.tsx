"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { HeroSlide } from "../types/home.type";

const AUTOPLAY_DELAY = 4000;

export function HeroCarouselView({ slides }: { slides: readonly HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const showNext = useCallback(() => {
    if (slides.length > 1) setActiveIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);
  const showPrevious = useCallback(() => {
    if (slides.length > 1) setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);
  const currentIndex = slides.length ? activeIndex % slides.length : 0;

  useEffect(() => {
    if (isHovered || hasFocus || slides.length <= 1) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    function updateAutoplay(): void {
      window.clearInterval(timer);
      if (!reducedMotion.matches && !document.hidden) {
        timer = window.setInterval(showNext, AUTOPLAY_DELAY);
      }
    }
    updateAutoplay();
    reducedMotion.addEventListener("change", updateAutoplay);
    document.addEventListener("visibilitychange", updateAutoplay);
    return () => {
      window.clearInterval(timer);
      reducedMotion.removeEventListener("change", updateAutoplay);
      document.removeEventListener("visibilitychange", updateAutoplay);
    };
  }, [isHovered, hasFocus, showNext, slides.length]);

  if (!slides.length) return null;

  return (
    <section aria-roledescription="carousel" aria-label="Giới thiệu Nha Khoa 2000" className="relative mx-auto w-full max-w-[1920px] select-none overflow-hidden bg-slate-950" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocusCapture={() => setHasFocus(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false); }}>
      <div className="relative h-[380px] w-full overflow-hidden sm:h-[460px] md:h-[520px] lg:h-[580px]">
        {slides.map((slide, index) => {
          const isActive = currentIndex === index;
          return (
            <div aria-hidden={!isActive} className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out motion-reduce:transition-none ${isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`} key={slide.id}>
              <Image alt={slide.imageAlt} className={`object-cover ${slide.objectPosition === "top" ? "object-top" : "object-center"}`} fill priority={index === 0} sizes="(max-width: 1920px) 100vw, 1920px" src={slide.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 pb-16 pl-6 pr-16 text-white sm:pb-20 sm:pl-12 lg:pl-20">
                <div className="max-w-7xl">
                  <p className={`mb-3 text-xs font-medium tracking-[0.16em] sm:text-sm ${slide.badgeVariant === "green" ? "text-emerald-200" : "text-white/85"}`}>{slide.badge || "NHA KHOA 2000 / TP. HỒ CHÍ MINH"}</p>
                  {index === 0 ? <h1 className="max-w-3xl text-[clamp(1.7rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight">{slide.title}</h1> : <h2 className="max-w-3xl text-[clamp(1.7rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight">{slide.title}</h2>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {slides.length > 1 ? (
        <>
          <button aria-label="Slide trước" className="absolute left-1 top-1/2 z-20 flex h-12 w-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/15 text-white transition-colors hover:bg-black/35 focus-visible:outline-white sm:left-5" onClick={showPrevious} type="button"><Icon className="h-7 w-7" name="chevron-left" /></button>
          <button aria-label="Slide kế tiếp" className="absolute right-1 top-1/2 z-20 flex h-12 w-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/15 text-white transition-colors hover:bg-black/35 focus-visible:outline-white sm:right-5" onClick={showNext} type="button"><Icon className="h-7 w-7" name="chevron-right" /></button>
          <div aria-label="Chọn ảnh giới thiệu" className="absolute bottom-3 left-1/2 z-20 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center sm:bottom-5">
            {slides.map((slide, index) => (
              <button aria-label={`Xem ảnh ${index + 1}: ${slide.title}`} aria-current={currentIndex === index ? "true" : undefined} className="flex h-11 w-8 shrink-0 items-center justify-center rounded-sm focus-visible:outline-white" key={slide.id} onClick={() => setActiveIndex(index)} type="button">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full border border-white transition-colors duration-300 motion-reduce:transition-none ${currentIndex === index ? "bg-white" : "bg-transparent"}`} />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
