import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { ActivitiesGallery } from "@/features/about/components/ActivitiesGallery";
import { AboutPageHead } from "@/features/about/components/AboutShared";
import { getAboutContent } from "@/features/about/services/about.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Hoạt động nội bộ",
  description: "Những chuyến đi, buổi tiệc và sự kiện gắn kết đội ngũ Nha Khoa 2000.",
  url: "/gioi-thieu/hoat-dong-noi-bo",
});

export default async function ActivitiesPage() {
  const { activities } = await getAboutContent();
  return (
    <>
      <AboutPageHead crumb="Hoạt động nội bộ" lead="Ngoài giờ làm việc, đội ngũ Nha Khoa 2000 gắn kết qua những chuyến đi, buổi tiệc và sự kiện nội bộ." title="Hoạt động nội bộ" />
      <section className="pb-16 pt-8">
        <Container><ActivitiesGallery activities={activities} /></Container>
      </section>
    </>
  );
}
