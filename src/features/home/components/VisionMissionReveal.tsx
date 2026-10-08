"use client";

import { useEffect, useRef, type ReactNode } from "react";

type VisionMissionRevealProps = {
  children: ReactNode;
  direction: "left" | "right";
};

export function VisionMissionReveal({ children, direction }: VisionMissionRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.classList.contains("vision-mission-reveal--visible")) return;
    element.classList.add("vision-mission-reveal--pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      element.classList.remove("vision-mission-reveal--pending");
      element.classList.add("vision-mission-reveal--visible");
      observer.disconnect();
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className={`vision-mission-reveal vision-mission-reveal--${direction}`} ref={elementRef}>{children}</div>;
}
