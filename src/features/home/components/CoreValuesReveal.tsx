"use client";

import { useEffect, useRef, type ReactNode } from "react";

type CoreValuesRevealProps = { children: ReactNode };

export function CoreValuesReveal({ children }: CoreValuesRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.add("core-values--pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      element.classList.remove("core-values--pending");
      element.classList.add("core-values--visible");
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={elementRef}>{children}</div>;
}
