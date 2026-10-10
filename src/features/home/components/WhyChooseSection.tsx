import Image from "next/image";
import { getHomeSectionCopy, getWhyChooseImage } from "../services/home.service";

export async function WhyChooseSection() {
  const [image, copy] = await Promise.all([getWhyChooseImage(), getHomeSectionCopy()]);
  if (!image) return null;

  return <section className="border-t border-border-subtle bg-white py-5 lg:py-6" id="vi-sao-chon-chung-toi"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-4 max-w-3xl space-y-1 text-center"><h2 className="whitespace-nowrap text-[clamp(1.25rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">{copy.whyChoose.title}</h2><p className="text-sm leading-relaxed text-text-secondary sm:text-base">{copy.whyChoose.note}</p></div><Image alt="Vì sao chọn Nha Khoa 2000" className="block h-auto w-full rounded-3xl object-cover shadow-md" height={720} src={image} unoptimized width={1600} /></div></section>;
}
