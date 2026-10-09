import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ServiceCarousel } from "@/features/services/components/ServiceCarousel";
import { getFeaturedServices } from "@/features/services/services/service.service";
import { getHomeSectionCopy } from "../services/home.service";

export async function FeaturedServicesSection() {
  const [services, copy] = await Promise.all([getFeaturedServices(), getHomeSectionCopy()]);
  return <section className="bg-surface py-8 lg:py-10" id="dich-vu-toan-dien"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><ServiceCarousel title={copy.services.title} note={copy.services.note} footerAction={<Link className="inline-flex items-center gap-2 text-[15px] font-bold text-brand-blue hover:text-brand-blue-dark" href="/dich-vu">Xem toàn bộ bảng giá &amp; danh mục dịch vụ<Icon className="h-5 w-5" name="arrow-right" /></Link>} services={services} /></div></section>;
}
