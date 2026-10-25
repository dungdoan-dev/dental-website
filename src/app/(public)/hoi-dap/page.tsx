import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { FAQSection } from "@/features/home/components/FAQSection";
import { getFaqItems } from "@/features/home/services/home.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Câu hỏi thường gặp",
  description: "Giải đáp các câu hỏi thường gặp về dịch vụ, chi phí và quy trình thăm khám tại Nha Khoa 2000.",
  url: "/hoi-dap",
});

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      }} />
      <Container className="pt-6 sm:pt-8">
        <Breadcrumb items={[{ label: "Hỏi đáp" }]} />
      </Container>
      <h1 className="sr-only">Câu hỏi thường gặp</h1>
      <FAQSection />
    </>
  );
}
