type SectionTitleProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Use "h1" when the title is the page heading. */
  as?: "h1" | "h2";
};

export function SectionTitle({ title, description, align = "left", as: Heading = "h2" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Heading className="text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold tracking-tight text-slate-900">{title}</Heading>
      {description ? <p className="mt-3 leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
