import type { Metadata } from "next";
import { AboutPageContent } from "@/features/about/components/AboutPageContent";
import { getAboutPageData } from "@/features/about/services/about.service";
import { getClinics } from "@/features/clinics/services/clinic.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Giới thiệu Nha Khoa 2000",
  description: "Tìm hiểu hành trình từ năm 1999, đội ngũ, giá trị cốt lõi và hai cơ sở của Nha Khoa 2000 tại TP. Hồ Chí Minh.",
  image: "/images/hero/clinic-modern.jpg",
  url: "/gioi-thieu",
});

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [content, clinics] = await Promise.all([getAboutPageData(), getClinics()]);

  if (!content) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-text-secondary">Nội dung giới thiệu đang được cập nhật.</div>;
  }

  return <AboutPageContent clinics={clinics} content={content} />;
}
