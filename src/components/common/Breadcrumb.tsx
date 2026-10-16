import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

// Shared style for every public page: small uppercase trail, left-aligned even inside centered heroes (w-full).
export function Breadcrumb({ items, className = "mb-6" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`w-full text-left text-xs font-bold uppercase tracking-wider text-text-secondary ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link className="transition-colors hover:text-brand-blue-dark" href="/">Trang chủ</Link></li>
        {items.map((item) => (
          <li className="flex items-center gap-2" key={`${item.label}-${item.href ?? "current"}`}>
            <Icon className="h-3.5 w-3.5" name="chevron-right" />
            {item.href
              ? <Link className="transition-colors hover:text-brand-blue-dark" href={item.href}>{item.label}</Link>
              : <span aria-current="page" className="text-brand-blue-dark">{item.label}</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </nav>
  );
}
