import type { Metadata } from "next";
import { AboutUsPage } from "@/features/about/components/AboutUsPage";
import { getAboutContent } from "@/features/about/services/about.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Về Nha Khoa 2000",
  description: "Thành lập ngày 01.11.1999 bởi Bác sĩ Võ Văn Tự Hiến: lịch sử hình thành, giá trị cốt lõi, tầm nhìn và cơ sở vật chất của Nha Khoa 2000.",
  image: "/images/about/catalogue/web/cs1-team-facade.jpg",
  url: "/gioi-thieu",
});

export default async function AboutPage() {
  return <AboutUsPage content={await getAboutContent()} />;
}
