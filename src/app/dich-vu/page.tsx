import type { Metadata } from "next";
import { ServiceConsultationSection } from "@/features/services/components/ServiceConsultationSection";
import { ServiceDirectoryHero } from "@/features/services/components/ServiceDirectoryHero";
import { ServiceFilterGrid } from "@/features/services/components/ServiceFilterGrid";
import { ServiceProcessSection } from "@/features/services/components/ServiceProcessSection";
import { resolveServiceFilter } from "@/features/services/data/service-filter.data";
import { getServices } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

type ServicesPageProps = { searchParams: Promise<{ nhom?: string | string[] }> };

export const metadata: Metadata = generateSeoMetadata({
  title: "Dịch vụ nha khoa chuyên sâu",
  description: "Khám phá dịch vụ nha khoa trẻ em, tổng quát, thẩm mỹ, chỉnh nha, Implant, nha chu và các kỹ thuật khác tại Nha Khoa 2000.",
  url: "/dich-vu",
});

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { nhom } = await searchParams;
  const activeFilter = resolveServiceFilter(Array.isArray(nhom) ? nhom[0] : nhom);
  const services = await getServices();
  return (
    <>
      <ServiceDirectoryHero />
      <ServiceFilterGrid activeFilter={activeFilter} services={services} />
      <ServiceProcessSection />
      <ServiceConsultationSection services={services} />
    </>
  );
}
