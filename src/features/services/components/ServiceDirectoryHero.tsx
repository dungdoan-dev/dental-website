import { Breadcrumb } from "@/components/common/Breadcrumb";

export function ServiceDirectoryHero() {
  return (
    <section className="border-b border-border-subtle/60 bg-gradient-to-b from-brand-blue-light/60 via-surface to-surface py-6 text-center md:py-8">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><Breadcrumb items={[{ label: "Dịch vụ" }]} /></div>
      <div className="mx-auto max-w-4xl space-y-3 px-margin-mobile md:px-margin">
        <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-brand-blue-dark">Dịch Vụ Nha Khoa Chuyên Sâu</h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">Hơn 25 năm đồng hành kiến tạo nụ cười khỏe đẹp với công nghệ tân tiến và đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm.</p>
      </div>
    </section>
  );
}
