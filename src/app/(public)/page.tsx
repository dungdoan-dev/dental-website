import type { Metadata } from "next";
import { ClinicFacilitiesSection } from "@/features/home/components/ClinicFacilitiesSection";
import { CoreValuesSection } from "@/features/home/components/CoreValuesSection";
import { DoctorTeamSection } from "@/features/home/components/DoctorTeamSection";
import { FAQSection } from "@/features/home/components/FAQSection";
import { FeaturedServicesSection } from "@/features/home/components/FeaturedServicesSection";
import { HeroCarousel } from "@/features/home/components/HeroCarousel";
import { InsurancePartnersSection } from "@/features/home/components/InsurancePartnersSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { VisionMissionSection } from "@/features/home/components/VisionMissionSection";
import { WhyChooseSection } from "@/features/home/components/WhyChooseSection";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Nha khoa chuyên sâu chuẩn quốc tế",
  description: "Nha Khoa 2000 tiên phong cấy ghép kỹ thuật số và nha khoa chuyên sâu chuẩn quốc tế tại TP.HCM.",
  url: "/",
});

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Nha Khoa 2000 – Nha khoa chuyên sâu, cấy ghép Implant tại TP. Hồ Chí Minh</h1>
      <HeroCarousel />
      <VisionMissionSection />
      <CoreValuesSection />
      <div className="home-section-reveal"><FeaturedServicesSection /></div>
      <div className="home-section-reveal"><DoctorTeamSection /></div>
      <div className="home-section-reveal"><WhyChooseSection /></div>
      <div className="home-section-reveal"><ClinicFacilitiesSection /></div>
      <div className="home-section-reveal"><InsurancePartnersSection /></div>
      <div className="home-section-reveal"><FAQSection /></div>
      <div className="home-section-reveal"><TestimonialsSection /></div>
    </>
  );
}
