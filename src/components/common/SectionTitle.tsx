type SectionTitleProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionTitle({ title, description, align = "left" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
