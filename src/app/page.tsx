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
});

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <VisionMissionSection />
      <CoreValuesSection />
      <FeaturedServicesSection />
      <DoctorTeamSection />
      <WhyChooseSection />
      <ClinicFacilitiesSection />
      <InsurancePartnersSection />
      <FAQSection />
      <TestimonialsSection />
    </>
  );
}
