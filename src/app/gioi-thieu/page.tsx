import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { getClinicSummary } from "@/features/clinics/services/clinic.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Giới thiệu" });

export default function AboutPage() {
  const clinic = getClinicSummary();
  return <Container className="py-12"><Breadcrumb items={[{ label: "Giới thiệu" }]} /><SectionTitle title={`Giới thiệu ${clinic.name}`} description={clinic.description} /><div className="mt-8 space-y-4 rounded-2xl bg-white p-8 leading-7 text-slate-600 shadow-sm"><p>Chúng tôi hướng đến trải nghiệm nha khoa rõ ràng, thân thiện và phù hợp với nhu cầu của từng khách hàng.</p><p>Thông tin chi tiết về cơ sở vật chất, chứng nhận và hành trình phát triển sẽ được cập nhật trong giai đoạn nội dung tiếp theo.</p></div></Container>;
}
