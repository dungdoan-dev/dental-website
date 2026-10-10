import { StarRating } from "@/components/ui/StarRating";
import Image from "next/image";
import { getHomeSectionCopy, getTestimonials } from "../services/home.service";

const accentClass = { blue: "bg-brand-blue", green: "bg-brand-green", "blue-dark": "bg-brand-blue-dark" } as const;

export async function TestimonialsSection() {
  const [testimonials, copy] = await Promise.all([getTestimonials(), getHomeSectionCopy()]);
  const averageRating = testimonials.length > 0
    ? testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length
    : null;

  return (
    <section className="bg-brand-blue-light/50 py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <h2 className="whitespace-nowrap text-[clamp(1.25rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">{copy.testimonials.title}</h2>
            <p className="text-sm leading-relaxed text-text-secondary sm:text-base">{copy.testimonials.note}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white px-6 py-3.5 shadow-sm">
            <div className="text-3xl font-extrabold text-brand-blue-dark">{averageRating?.toFixed(1) ?? "—"}</div>
            <div>
              <StarRating rating={5} />
              <span className="text-xs font-medium text-text-secondary">{testimonials.length} đánh giá</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article className="flex flex-col justify-between rounded-2xl bg-white p-7 shadow-sm" key={testimonial.id}>
              <div className="space-y-4">
                <StarRating className="text-lg" rating={testimonial.rating} />
                <p className="leading-relaxed text-text-primary italic">{testimonial.content}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-surface-container-high pt-6">
                {testimonial.avatar ? <Image alt={`Ảnh ${testimonial.customerName}`} className="h-11 w-11 rounded-full object-cover" height={44} src={testimonial.avatar} unoptimized width={44} /> : <div className={`flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-bold text-white ${accentClass[testimonial.accent]}`}>{testimonial.initials}</div>}
                <div>
                  <h3 className="font-bold text-text-primary">{testimonial.customerName}</h3>
                  <p className="text-xs text-text-secondary">{testimonial.source}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
