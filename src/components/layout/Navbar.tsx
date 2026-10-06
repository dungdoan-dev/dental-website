"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationItemActive, navigation } from "@/config/navigation";

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="hidden shrink-0 xl:block">
      <ul className="flex items-center gap-3 whitespace-nowrap xl:gap-5">
        {navigation.map((item) => {
          const isActive = isNavigationItemActive(pathname, item.href);
          return <li key={item.href}><Link aria-current={isActive ? "page" : undefined} className={`py-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${isActive ? "border-b-2 border-brand-blue-dark text-brand-blue-dark" : "text-on-surface-variant hover:text-brand-blue-dark"}`} href={item.href}>{item.label}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
