import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { serviceGroups } from "@/features/services/data/service-filter.data";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Bảng giá" });

export default function PricingPage() {
  return <Container className="py-12"><Breadcrumb items={[{ label: "Bảng giá" }]} /><SectionTitle title="Bảng giá theo danh mục kĩ thuật" description="Chi phí chính xác sẽ được bác sĩ tư vấn sau khi thăm khám." /><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">{serviceGroups.map((group) => <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5 last:border-b-0" key={group.value}><span className="font-medium">{group.label}</span><span className="text-slate-600">Liên hệ tư vấn</span></div>)}</div></Container>;
}
