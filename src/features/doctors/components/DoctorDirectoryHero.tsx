import { Breadcrumb } from "@/components/common/Breadcrumb";
import { getDirectoryHero } from "@/features/content/services/directory-hero.service";

export async function DoctorDirectoryHero() {
  const { title, description } = await getDirectoryHero("doctors");
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light/50 via-surface to-surface pb-8 pt-6 md:pb-10 md:pt-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-3xl" /><div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-brand-green/10 blur-2xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <Breadcrumb items={[{ label: "Đội ngũ bác sĩ" }]} />
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold tracking-tight text-brand-blue-dark">{title}</h1>
          {description ? <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">{description}</p> : null}
        </div>
      </div>
    </section>
  );
}
