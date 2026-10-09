"use client";

import { Children, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";


type CardCarouselProps = {
  children: ReactNode;
  label: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  desktopColumns?: 2 | 3;
};

const arrowClassName = "flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-white text-brand-blue-dark transition-colors duration-300 enabled:hover:border-brand-blue-dark enabled:hover:bg-brand-blue-dark enabled:hover:text-white disabled:cursor-not-allowed disabled:text-slate-300 motion-reduce:transition-none";

export function CardCarousel({ children, label, previousLabel, nextLabel, pageLabel, desktopColumns = 3 }: CardCarouselProps) {
  const items = Children.toArray(children);
  const carouselId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef([0]);
  const [pagination, setPagination] = useState({ page: 0, count: 1 });

  function syncPagination() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const stops = stopsRef.current;
    const page = stops.reduce((closest, position, index) => (
      Math.abs(position - viewport.scrollLeft) < Math.abs(stops[closest] - viewport.scrollLeft) ? index : closest
    ), 0);
    setPagination((current) => current.page === page && current.count === stops.length
      ? current : { page, count: stops.length });
  }

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function measure() {
      if (!viewport) return;
      const cards = Array.from(viewport.children) as HTMLElement[];
      if (!cards.length) return;
      const gap = parseFloat(getComputedStyle(viewport).columnGap) || 0;
      const visibleCount = Math.max(1, Math.round((viewport.clientWidth + gap) / (cards[0].offsetWidth + gap)));
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const stops = [0];
      for (let index = visibleCount; index < cards.length; index += visibleCount) {
        const position = Math.min(cards[index].offsetLeft - cards[0].offsetLeft, maxScroll);
        if (position > stops[stops.length - 1] + 1) stops.push(position);
      }
      stopsRef.current = stops;
      syncPagination();
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    measure();
    return () => observer.disconnect();
  }, [items.length]);

  function goToPage(page: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextPage = Math.max(0, Math.min(page, stopsRef.current.length - 1));
    viewport.scrollTo({
      left: stopsRef.current[nextPage],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section aria-label={label} aria-roledescription="carousel">
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-x-3 gap-y-4 lg:gap-x-5">
        <button aria-controls={carouselId} aria-label={previousLabel} className={`${arrowClassName} col-start-1 row-start-2 lg:row-start-1`} disabled={pagination.page === 0} onClick={() => goToPage(pagination.page - 1)} type="button">
          <Icon name="arrow-left" />
        </button>
        <div className="relative col-span-3 col-start-1 row-start-1 min-w-0 lg:col-span-1 lg:col-start-2">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-1 pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" id={carouselId} onScroll={syncPagination} ref={viewportRef}>
            {items.map((item, index) => (
              <div aria-label={`${index + 1} / ${items.length}`} aria-roledescription="slide" className={`relative min-w-0 shrink-0 basis-full snap-start md:basis-[calc((100%-1.5rem)/2)] ${desktopColumns === 2 ? "lg:basis-[calc((100%-1.5rem)/2)]" : "lg:basis-[calc((100%-3rem)/3)]"}`} key={typeof item === "object" && item !== null && "key" in item ? item.key : index} role="group">
                {item}
              </div>
            ))}
          </div>
        </div>
        <button aria-controls={carouselId} aria-label={nextLabel} className={`${arrowClassName} col-start-3 row-start-2 lg:row-start-1`} disabled={pagination.page === pagination.count - 1} onClick={() => goToPage(pagination.page + 1)} type="button">
          <Icon name="arrow-right" />
        </button>
        <div aria-atomic="true" aria-live="polite" className="col-start-2 row-start-2 text-center text-sm tabular-nums text-text-secondary">
          <span className="sr-only">{pageLabel} </span>
          <span className="font-semibold text-brand-blue-dark">{String(pagination.page + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className="mx-3 text-slate-300">/</span>
          <span className="sr-only"> trên </span>
          {String(pagination.count).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
