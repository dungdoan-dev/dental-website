import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function ArticleDirectoryHero() {
  return (
    <section className="bg-gradient-to-b from-brand-blue-light/60 via-surface to-surface pb-12 pt-10 text-center md:pt-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-margin-mobile md:px-margin">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-secondary"><Link className="hover:text-brand-blue-dark" href="/">Trang Chủ</Link><Icon className="h-4 w-4 text-outline-variant" name="chevron-right" /><span aria-current="page" className="text-brand-blue-dark">Kiến Thức Nha Khoa</span></nav>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-4 py-1.5 text-sm font-semibold text-brand-blue-dark shadow-sm"><Icon className="h-4 w-4" name="shield-check" />Y Khoa Chính Thống &amp; Cẩm Nang Chăm Sóc</span>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-text-primary md:text-[2.5rem]">CẨM NANG &amp; KIẾN THỨC NHA KHOA</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">Chia sẻ thông tin chăm sóc răng miệng, giải thích các phương pháp điều trị và giải đáp những câu hỏi thường gặp.</p>
      </div>
    </section>
  );
}
