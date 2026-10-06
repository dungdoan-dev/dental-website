import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const stats = [
  { value: "25+", label: "Năm Kinh Nghiệm", accent: "blue" },
  { value: "100%", label: "Bác Sĩ Chính Quy", accent: "green" },
  { value: "40.000+", label: "Ca Phục Hình Hoàn Mỹ", accent: "blue" },
  { value: "2 CS", label: "Quận 1 & Quận 5", accent: "green" },
] as const;

export function DoctorDirectoryHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light/50 via-surface to-surface pb-16 pt-8 md:pb-24 md:pt-14">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" /><div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-green/10 blur-2xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary"><Link className="transition-colors hover:text-brand-blue-dark" href="/">Trang Chủ</Link><Icon className="h-3.5 w-3.5" name="chevron-right" /><span className="text-brand-blue-dark">Đội Ngũ Bác Sĩ</span></nav>
        <div className="mx-auto max-w-3xl space-y-4 text-center"><h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-[3.5rem]">Đội Ngũ Bác Sĩ <span className="text-brand-blue-dark">&amp; Chuyên Gia</span></h1><p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">Hơn 25 năm kinh nghiệm điều trị tận tâm, quy tụ các chuyên gia đầu ngành Răng Hàm Mặt Việt Nam. Đem lại nụ cười khỏe khoắn, tự nhiên và trọn đời an tâm cho bạn.</p><div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 pt-6 sm:grid-cols-4">{stats.map((stat) => <div className="rounded-2xl bg-white p-3.5 text-center shadow-sm" key={stat.label}><div className={`text-2xl font-bold leading-none sm:text-[2.5rem] ${stat.accent === "green" ? "text-brand-green-dark" : "text-brand-blue-dark"}`}>{stat.value}</div><div className="mt-1 text-[11px] font-bold text-text-secondary">{stat.label}</div></div>)}</div></div>
      </div>
    </section>
  );
}
