import Image from "next/image";
import { getWhyChooseImage } from "../services/home.service";

export async function WhyChooseSection() {
  const image = await getWhyChooseImage();
  if (!image) return null;

  return <section className="border-t border-border-subtle bg-white py-8 lg:py-10" id="vi-sao-chon-chung-toi"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-6 max-w-3xl space-y-3 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-[2.5rem]">Vì Sao Chọn Chúng Tôi ?</h2></div><Image alt="Vì sao chọn Nha Khoa 2000" className="block h-auto w-full rounded-3xl object-cover shadow-md" height={720} src={image} unoptimized width={1600} /></div></section>;
}
