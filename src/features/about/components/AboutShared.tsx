import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { aboutLead, heroWash } from "./about-styles";

export { aboutEyebrow, aboutHeading, aboutLead, heroWash } from "./about-styles";

export function AboutPageHead({ crumb, title, lead }: { crumb: string; title: string; lead: string }) {
  return (
    <section className={`${heroWash} pb-9 pt-7`}>
      <Container>
        <Breadcrumb className="mb-5" items={[{ label: "Giới thiệu", href: "/gioi-thieu" }, { label: crumb }]} />
        <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.025em] text-brand-blue-dark">{title}</h1>
        <p className={`${aboutLead} max-w-[720px] text-[17px]`}>{lead}</p>
      </Container>
    </section>
  );
}
