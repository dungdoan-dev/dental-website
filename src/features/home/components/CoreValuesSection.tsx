import { getCoreValues, getHomeSectionCopy } from "../services/home.service";
import { CoreValueIcon } from "./CoreValueIcon";
import { CoreValuesReveal } from "./CoreValuesReveal";

export async function CoreValuesSection() {
  const [coreValues, copy] = await Promise.all([getCoreValues(), getHomeSectionCopy()]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-margin-mobile pb-5 pt-4 md:px-margin lg:pb-6 lg:pt-5">
        <div className="mb-4 text-center"><h2 className="whitespace-nowrap text-[clamp(0.8rem,3.8vw,1.875rem)] font-extrabold tracking-tight text-text-primary">{copy.values.title}</h2><p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">{copy.values.note}</p></div>
        <CoreValuesReveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <article
                className="core-value-card group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-surface p-5 text-center shadow-sm transition-[background-color,box-shadow] duration-300 hover:bg-surface-container-low hover:shadow-md sm:p-6"
                key={value.title}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                  <CoreValueIcon iconKey={value.iconKey} />
                </div>
                <h3 className="mb-3 text-2xl font-extrabold uppercase tracking-wide text-brand-blue-dark">
                  {value.title}
                </h3>
                <p className="mb-3 text-[15px] font-bold leading-snug text-text-primary">
                  {value.slogan}
                </p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </CoreValuesReveal>
      </div>
    </div>
  );
}
