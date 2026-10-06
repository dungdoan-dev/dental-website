import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function ServiceDirectoryHero() {
  return (
    <section className="border-b border-border-subtle/60 bg-gradient-to-b from-brand-blue-light/60 via-surface to-surface py-14 text-center md:py-20">
      <div className="mx-auto max-w-4xl space-y-4 px-margin-mobile md:px-margin">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary">
          <Link className="flex items-center gap-1 transition-colors hover:text-brand-blue" href="/"><Icon className="h-4 w-4" name="map" />Trang chủ</Link>
          <Icon className="h-4 w-4 text-slate-300" name="chevron-right" />
          <span aria-current="page" className="font-bold text-brand-blue-dark">Dịch vụ</span>
        </nav>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-brand-blue-dark sm:text-4xl md:text-[2.75rem]">Dịch Vụ Nha Khoa Chuyên Sâu</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">Hơn 25 năm đồng hành kiến tạo nụ cười khỏe đẹp với công nghệ tân tiến và đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm.</p>
      </div>
    </section>
  );
}
