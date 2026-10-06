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
          const isActive = isNavigationItemActive(pathname, item.href)
            || Boolean(item.children?.some((child) => isNavigationItemActive(pathname, child.href)));

          return (
            <li className={item.children ? "group relative" : ""} key={item.href}>
              <Link aria-current={isActive ? "page" : undefined} className={`py-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${isActive ? "border-b-2 border-brand-blue-dark text-brand-blue-dark" : "text-on-surface-variant hover:text-brand-blue-dark"}`} href={item.href}>{item.label}</Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full z-50 w-80 pt-4 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="rounded-2xl border border-border-subtle bg-white p-2 shadow-xl">
                    {item.children.map((child) => (
                      <li key={child.href}><Link className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-brand-blue-light hover:text-brand-blue-dark focus:bg-brand-blue-light focus:text-brand-blue-dark" href={child.href}>{child.label}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
