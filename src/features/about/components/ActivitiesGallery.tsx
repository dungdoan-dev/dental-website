"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { toAboutImage } from "../data/about-content";
import type { AboutPageData } from "../schemas/about.schema";
import { ZoomImage } from "./AboutLightbox";
import { aboutEyebrow, aboutHeading, aboutLead } from "./about-styles";

export function ActivitiesGallery({ activities }: { activities: AboutPageData["activities"] }) {
  const [category, setCategory] = useState<string | null>(null);
  // Filters come from the groups admins type, in the order they first appear.
  const categories = [...new Set(activities.items.map((item) => item.category).filter(Boolean))];
  const list = category ? activities.items.filter((item) => item.category === category) : activities.items;
  const featured = activities.featured.photos.map(toAboutImage);

  return (
    <>
      {categories.length > 1 ? (
        <div aria-label="Lọc theo nhóm hoạt động" className="flex flex-wrap gap-2" role="group">
          {[null, ...categories].map((name) => (
            <button
              aria-pressed={category === name}
              className={`min-h-10 rounded-md border px-4 text-sm font-semibold transition ${category === name ? "border-brand-blue-dark bg-brand-blue-dark text-white" : "border-border-subtle bg-white text-text-secondary hover:text-brand-blue-dark"}`}
              key={name ?? "all"}
              onClick={() => setCategory(name)}
              type="button"
            >
              {name ?? "Tất cả"}
            </button>
          ))}
        </div>
      ) : null}

      {!category && featured.length ? (
        <article className="mt-7 grid items-center gap-x-10 gap-y-5 lg:grid-cols-2">
          <ZoomImage className="aspect-video" gallery={featured} img={featured[0]} position="50% 100%" />
          <div>
            <p className={aboutEyebrow}>Đội ngũ</p>
            <h2 className={`${aboutHeading} text-[26px]`}>{activities.featured.title}</h2>
            <p className={aboutLead}>{activities.featured.description}</p>
          </div>
        </article>
      ) : null}

      <ul className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((activity, index) => {
          const images = activity.photos.map(toAboutImage);
          if (!images.length) return null;
          return (
            <li key={`${activity.title}-${index}`}>
              <article>
                <div className="relative">
                  <ZoomImage className="aspect-[3/2]" gallery={images} img={images[0]} sizes="(max-width: 640px) 100vw, 400px" />
                  {images.length > 1 ? <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-bold text-white"><Icon className="h-3.5 w-3.5" name="search" />{images.length} ảnh</span> : null}
                </div>
                <p className="mt-3.5 text-xs font-bold uppercase tracking-[0.05em] text-brand-green-dark">{activity.category}</p>
                <h3 className="mt-1 text-[19px] font-bold leading-snug text-text-primary">{activity.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{activity.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
