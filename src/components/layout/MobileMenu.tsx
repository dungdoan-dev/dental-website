"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { Icon } from "@/components/ui/Icon";
import { isNavigationItemActive, navigation } from "@/config/navigation";

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="xl:hidden">
      <button aria-expanded={isOpen} aria-label={isOpen ? "Đóng menu" : "Mở menu"} className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-brand-blue-dark" onClick={() => setIsOpen((current) => !current)} type="button"><Icon name={isOpen ? "close" : "menu"} /></button>
      <div className={`absolute inset-x-0 top-full border-t border-border-subtle bg-white shadow-xl transition duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <nav aria-label="Điều hướng di động" className="mx-auto max-w-7xl px-margin-mobile py-5">
          <ul className="grid gap-1">{navigation.map((item) => {
            const isActive = isNavigationItemActive(pathname, item.href);
            return <li key={item.href}><Link aria-current={isActive ? "page" : undefined} className={`block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-brand-blue-light hover:text-brand-blue-dark ${isActive ? "bg-brand-blue-light text-brand-blue-dark" : "text-text-primary"}`} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link></li>;
          })}</ul>
          <AppointmentButton className="mt-4 w-full" />
        </nav>
      </div>
    </div>
  );
}
