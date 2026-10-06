import Image from "next/image";
import { homeAssets } from "../data/home-assets.data";

export function WhyChooseSection() {
  return <section className="border-t border-border-subtle bg-white py-12 lg:py-16" id="vi-sao-chon-chung-toi"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-8 max-w-3xl space-y-3 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Vì Sao Chọn Chúng Tôi ?</h2></div><Image alt="Vì sao chọn Nha Khoa 2000" className="block h-auto w-full rounded-3xl object-cover shadow-md" height={720} src={homeAssets.whyChooseImage} unoptimized width={1600} /></div></section>;
}
