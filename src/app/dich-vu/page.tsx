import type { Metadata } from "next";
import { ServiceDirectoryHero } from "@/features/services/components/ServiceDirectoryHero";
import { ServiceFilterGrid } from "@/features/services/components/ServiceFilterGrid";
import { ServiceProcessSection } from "@/features/services/components/ServiceProcessSection";
import { getServices } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Dịch vụ nha khoa chuyên sâu",
  description: "Khám phá dịch vụ nha khoa trẻ em, tổng quát, thẩm mỹ, chỉnh nha, Implant, nha chu và các kỹ thuật khác tại Nha Khoa 2000.",
  url: "/dich-vu",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <ServiceDirectoryHero />
      <ServiceFilterGrid services={services} />
      <ServiceProcessSection />
    </>
  );
}
