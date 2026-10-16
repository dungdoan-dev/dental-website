import { Breadcrumb } from "@/components/common/Breadcrumb";
import { getDirectoryHero } from "@/features/content/services/directory-hero.service";

export async function ServiceDirectoryHero() {
  const { title, description } = await getDirectoryHero("services");
  return (
    <section className="border-b border-border-subtle/60 bg-gradient-to-b from-brand-blue-light/60 via-surface to-surface py-6 text-center md:py-8">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><Breadcrumb items={[{ label: "Dịch vụ" }]} /></div>
      <div className="mx-auto max-w-4xl space-y-3 px-margin-mobile md:px-margin">
        <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-brand-blue-dark">{title}</h1>
        {description ? <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">{description}</p> : null}
      </div>
    </section>
  );
}
