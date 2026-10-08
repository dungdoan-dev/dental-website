"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Icon } from "@/components/ui/Icon";
import { isNavigationItemActive, navigation } from "@/config/navigation";

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }
    function handlePointerDown(event: PointerEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);
  return (
    <div className="xl:hidden" ref={containerRef}>
      <button aria-controls="mobile-navigation-panel" aria-expanded={isOpen} aria-label={isOpen ? "Đóng menu" : "Mở menu"} className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-brand-blue-dark" onClick={() => setIsOpen((current) => !current)} ref={toggleRef} type="button"><Icon name={isOpen ? "close" : "menu"} /></button>
      <div aria-hidden={!isOpen} inert={!isOpen} id="mobile-navigation-panel" className={`absolute inset-x-0 top-full max-h-[calc(100dvh-114px)] overflow-y-auto border-t border-border-subtle bg-white shadow-xl transition duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <nav aria-label="Điều hướng di động" className="mx-auto max-w-7xl px-margin-mobile py-5">
          <ul className="grid gap-1">{navigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href)
              || Boolean(item.children?.some((child) => isNavigationItemActive(pathname, child.href)));
            const isExpanded = expandedMenu === item.href;

            return (
              <li key={item.href}>
                <div className="flex items-center">
                  <Link aria-current={isActive ? "page" : undefined} className={`block flex-1 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-brand-blue-light hover:text-brand-blue-dark ${isActive ? "bg-brand-blue-light text-brand-blue-dark" : "text-text-primary"}`} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>
                  {item.children && <button aria-controls="mobile-service-groups" aria-expanded={isExpanded} aria-label={isExpanded ? "Đóng nhóm dịch vụ" : "Mở nhóm dịch vụ"} className="ml-1 rounded-xl p-3 text-text-secondary hover:bg-brand-blue-light" onClick={() => setExpandedMenu(isExpanded ? null : item.href)} type="button"><Icon className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} name="chevron-down" /></button>}
                </div>
                {item.children && isExpanded && (
                  <ul className="ml-4 border-l border-border-subtle pl-3" id="mobile-service-groups">
                    {item.children.map((child) => <li key={child.href}><Link className="block rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-brand-blue-light hover:text-brand-blue-dark" href={child.href} onClick={() => setIsOpen(false)}>{child.label}</Link></li>)}
                  </ul>
                )}
              </li>
            );
          })}</ul>
          <AppointmentButton className="mt-4 w-full" onOpen={() => setIsOpen(false)} />
        </nav>
      </div>
    </div>
  );
}
