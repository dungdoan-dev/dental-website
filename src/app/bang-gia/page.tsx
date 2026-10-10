import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { defaultServicePriceCategories } from "@/features/services/data/service-price-categories";
import { servicePriceCategoriesSchema } from "@/features/services/schemas/service-price-categories.schema";
import { getSiteContent } from "@/features/content/services/site-content.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Bảng giá" });

export default async function PricingPage() {
  const content = await getSiteContent("service_price_categories", servicePriceCategoriesSchema);
  const pricing = content ?? defaultServicePriceCategories;
  return <Container className="py-12"><Breadcrumb items={[{ label: "Bảng giá" }]} /><SectionTitle title={pricing.title} description={pricing.description} /><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">{pricing.rows.map((row, index) => <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5 last:border-b-0" key={`${row.category}-${index}`}><span className="font-medium">{row.label}</span><span className="text-right text-slate-600">{row.price}</span></div>)}</div></Container>;
}
