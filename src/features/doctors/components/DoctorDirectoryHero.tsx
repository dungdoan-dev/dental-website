import { Breadcrumb } from "@/components/common/Breadcrumb";

export function DoctorDirectoryHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light/50 via-surface to-surface pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" /><div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-green/10 blur-2xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <Breadcrumb items={[{ label: "Đội ngũ bác sĩ" }]} />
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold tracking-tight text-text-primary">
            ĐỘI NGŨ <span className="text-brand-blue-dark">BÁC SĨ</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Đội ngũ y bác sĩ đầy kinh nghiệm và tận tâm, tay nghề cao, y đức tốt, luôn luôn được cập nhật kiến thức và công nghệ hiện đại của Nha Khoa 2000, luôn coi việc điều trị cho bệnh nhân như chính người thân trong gia đình mình, sử dụng vật liệu chất lượng cao cùng trang thiết bị và kỹ thuật tiên tiến sẽ đem đến cho bạn những tiêu chuẩn điều trị cao nhất.
          </p>
        </div>
      </div>
    </section>
  );
}
