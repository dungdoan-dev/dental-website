import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: readonly BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link className="hover:text-teal-700" href="/">Trang chủ</Link></li>
        {items.map((item) => (
          <li className="flex items-center gap-2" key={`${item.label}-${item.href ?? "current"}`}>
            <span aria-hidden="true">/</span>
            {item.href ? <Link className="hover:text-teal-700" href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
