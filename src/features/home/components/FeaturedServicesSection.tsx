import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ServiceCarousel } from "@/features/services/components/ServiceCarousel";
import { getServices } from "@/features/services/services/service.service";

export async function FeaturedServicesSection() {
  const services = await getServices();
  return <section className="bg-surface py-12 lg:py-16" id="dich-vu-toan-dien"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><ServiceCarousel services={services} /><div className="mt-8 text-center"><Link className="inline-flex items-center gap-2 rounded-full bg-brand-blue-dark px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-blue-dark" href="/dich-vu">Xem Toàn Bộ Bảng Giá &amp; Danh Mục Dịch Vụ<Icon className="h-4 w-4" name="arrow-right" /></Link></div></div></section>;
}
