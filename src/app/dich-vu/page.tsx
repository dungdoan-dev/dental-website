import type { Metadata } from "next";
import { ServiceConsultationSection } from "@/features/services/components/ServiceConsultationSection";
import { ServiceDirectoryHero } from "@/features/services/components/ServiceDirectoryHero";
import { ServiceFilterGrid } from "@/features/services/components/ServiceFilterGrid";
import { ServiceProcessSection } from "@/features/services/components/ServiceProcessSection";
import { getServices } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Dịch vụ nha khoa chuyên sâu",
  description: "Khám phá các dịch vụ Implant, răng sứ, chỉnh nha, nha khoa tổng quát và tiểu phẫu tại Nha Khoa 2000.",
  url: "/dich-vu",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <ServiceDirectoryHero />
      <ServiceFilterGrid services={services} />
      <ServiceProcessSection />
      <ServiceConsultationSection services={services} />
    </>
  );
}
