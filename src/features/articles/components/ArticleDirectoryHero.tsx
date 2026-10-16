import { Breadcrumb } from "@/components/common/Breadcrumb";

export function ArticleDirectoryHero() {
  return (
    <section className="bg-gradient-to-b from-brand-blue-light/60 via-surface to-surface pb-8 pt-6 text-center md:pt-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-margin-mobile md:px-margin">
        <Breadcrumb items={[{ label: "Kiến thức nha khoa" }]} />
        <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] max-w-3xl font-extrabold leading-tight tracking-tight text-text-primary">CẨM NANG &amp; KIẾN THỨC NHA KHOA</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">Chia sẻ thông tin chăm sóc răng miệng, giải thích các phương pháp điều trị và giải đáp những câu hỏi thường gặp.</p>
      </div>
    </section>
  );
}
