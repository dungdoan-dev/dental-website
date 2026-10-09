"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function HomePageSectionReveal({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !window.IntersectionObserver) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const revealState = isVisible ? "home-section-reveal--visible" : "home-section-reveal--pending";
  return <div className={`home-section-reveal ${revealState}`} ref={sectionRef}>{children}</div>;
}
