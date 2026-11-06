"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { aboutSubnav } from "../data/about-content";

export function AboutSubnav() {
  const pathname = usePathname()?.replace(/\/$/, "") || "/gioi-thieu";
  const bar = useRef<HTMLDivElement>(null);

  // On phones the bar scrolls sideways; bring the current page's tab into view.
  useEffect(() => {
    const active = bar.current?.querySelector<HTMLElement>("[aria-current=page]");
    if (bar.current && active) bar.current.scrollLeft = active.offsetLeft - (bar.current.clientWidth - active.clientWidth) / 2;
  }, [pathname]);

  return (
    <nav aria-label="Mục Giới thiệu" className="sticky top-[98px] z-30 border-b border-border-subtle bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl gap-1 overflow-x-auto px-margin-mobile [justify-content:safe_center] [scrollbar-width:none] md:px-margin [&::-webkit-scrollbar]:hidden" ref={bar}>
        {aboutSubnav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`-mb-px flex min-h-[52px] shrink-0 items-center whitespace-nowrap border-b-[3px] px-3.5 text-sm transition-colors ${active ? "border-brand-blue-dark font-bold text-brand-blue-dark" : "border-transparent font-semibold text-text-secondary hover:text-brand-blue-dark"}`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
