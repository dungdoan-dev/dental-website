import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { homeAssets } from "../data/home-assets.data";

export function WhyChooseSection() {
  return <section className="border-t border-border-subtle bg-white py-16 lg:py-24" id="vi-sao-chon-chung-toi"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-12 max-w-3xl space-y-3 text-center"><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-blue-light px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue-dark"><Icon className="h-4 w-4" name="shield-check" /><span>LÝ DO KHÁCH HÀNG TIN CHỌN</span></div><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Vì Sao Chọn Chúng Tôi ?</h2></div><Image alt="Vì sao chọn Nha Khoa 2000" className="block h-auto w-full rounded-3xl object-cover shadow-md" height={720} src={homeAssets.whyChooseImage} unoptimized width={1600} /></div></section>;
}
