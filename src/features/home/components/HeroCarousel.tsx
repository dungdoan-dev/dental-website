"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { heroSlides } from "../data/hero.data";

const AUTOPLAY_DELAY = 4500;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const showNext = useCallback(() => setActiveIndex((current) => (current + 1) % heroSlides.length), []);
  const showPrevious = useCallback(() => setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(showNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [isPaused, showNext]);

  return (
    <section aria-roledescription="carousel" aria-label="Giới thiệu Nha Khoa 2000" className="relative w-full select-none overflow-hidden bg-slate-950" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="relative h-[380px] w-full overflow-hidden sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px]">
        {heroSlides.map((slide, index) => {
          const isActive = activeIndex === index;
          return (
            <div aria-hidden={!isActive} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`} key={slide.id}>
              <Image alt={slide.imageAlt} className={`object-cover transition-transform duration-[6000ms] ease-out ${slide.objectPosition === "top" ? "object-top" : "object-center"} ${isActive ? "scale-105" : "scale-100"}`} fill priority={index === 0} sizes="100vw" src={slide.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-6 max-w-xl text-white sm:left-12 lg:left-20">
                <span className={`mb-2.5 inline-block rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wider backdrop-blur-md ${slide.badgeVariant === "green" ? "bg-brand-green/80" : "bg-brand-blue/80"}`}>{slide.badge}</span>
                {index === 0 ? <h1 className="text-2xl font-extrabold tracking-tight drop-shadow-md sm:text-3xl lg:text-4xl">{slide.title}</h1> : <h2 className="text-2xl font-extrabold tracking-tight drop-shadow-md sm:text-3xl lg:text-4xl">{slide.title}</h2>}
              </div>
            </div>
          );
        })}
      </div>
      <button aria-label="Slide trước" className="group absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/65 active:scale-95 sm:left-6 sm:h-13 sm:w-13" onClick={showPrevious} type="button"><Icon className="h-7 w-7 transition-transform group-hover:-translate-x-0.5" name="chevron-left" /></button>
      <button aria-label="Slide kế tiếp" className="group absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/65 active:scale-95 sm:right-6 sm:h-13 sm:w-13" onClick={showNext} type="button"><Icon className="h-7 w-7 transition-transform group-hover:translate-x-0.5" name="chevron-right" /></button>
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-2 backdrop-blur-md sm:right-12">{heroSlides.map((slide, index) => <button aria-label={`Hình ${index + 1}`} aria-current={activeIndex === index} className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-brand-blue" : "w-2 bg-white/40 hover:bg-white/80"}`} key={slide.id} onClick={() => setActiveIndex(index)} type="button" />)}</div>
    </section>
  );
}
