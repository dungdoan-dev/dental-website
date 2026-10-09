import type { Metadata } from "next";
import { ClinicFacilitiesSection } from "@/features/home/components/ClinicFacilitiesSection";
import { CoreValuesSection } from "@/features/home/components/CoreValuesSection";
import { DoctorTeamSection } from "@/features/home/components/DoctorTeamSection";
import { FAQSection } from "@/features/home/components/FAQSection";
import { FeaturedServicesSection } from "@/features/home/components/FeaturedServicesSection";
import { HeroCarousel } from "@/features/home/components/HeroCarousel";
import { HomePageSectionReveal } from "@/features/home/components/HomePageSectionReveal";
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
      <HomePageSectionReveal><HeroCarousel /></HomePageSectionReveal>
      <HomePageSectionReveal><VisionMissionSection /></HomePageSectionReveal>
      <HomePageSectionReveal><CoreValuesSection /></HomePageSectionReveal>
      <HomePageSectionReveal><FeaturedServicesSection /></HomePageSectionReveal>
      <HomePageSectionReveal><DoctorTeamSection /></HomePageSectionReveal>
      <HomePageSectionReveal><WhyChooseSection /></HomePageSectionReveal>
      <HomePageSectionReveal><ClinicFacilitiesSection /></HomePageSectionReveal>
      <HomePageSectionReveal><InsurancePartnersSection /></HomePageSectionReveal>
      <HomePageSectionReveal><FAQSection /></HomePageSectionReveal>
      <HomePageSectionReveal><TestimonialsSection /></HomePageSectionReveal>
    </>
  );
}
