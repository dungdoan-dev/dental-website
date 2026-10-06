import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Bảng giá" });

const priceGroups = [
  { name: "Khám và tư vấn", price: "Liên hệ" },
  { name: "Nha khoa tổng quát", price: "Theo tình trạng" },
  { name: "Nha khoa thẩm mỹ", price: "Theo kế hoạch điều trị" },
] as const;

export default function PricingPage() {
  return <Container className="py-12"><Breadcrumb items={[{ label: "Bảng giá" }]} /><SectionTitle title="Bảng giá tham khảo" description="Chi phí chính xác sẽ được bác sĩ tư vấn sau khi thăm khám." /><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">{priceGroups.map((item) => <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5 last:border-b-0" key={item.name}><span className="font-medium">{item.name}</span><span className="text-slate-600">{item.price}</span></div>)}</div></Container>;
}
