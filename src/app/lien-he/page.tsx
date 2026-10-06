import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { siteConfig } from "@/config/site";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({ title: "Liên hệ" });

export default function ContactPage() {
  return <Container className="py-12"><Breadcrumb items={[{ label: "Liên hệ" }]} /><SectionTitle title="Liên hệ và đặt lịch" description="Đội ngũ nha khoa sẽ hỗ trợ sắp xếp lịch thăm khám phù hợp." /><div className="mt-8 grid gap-6 md:grid-cols-3">{[{ label: "Điện thoại", value: siteConfig.contact.phone }, { label: "Email", value: siteConfig.contact.email }, { label: "Địa chỉ", value: siteConfig.contact.address }].map((item) => <div className="rounded-2xl bg-white p-6 shadow-sm" key={item.label}><p className="text-sm text-slate-500">{item.label}</p><p className="mt-2 font-semibold">{item.value}</p></div>)}</div><div className="mt-8 rounded-2xl border border-dashed border-teal-300 bg-teal-50 p-8 text-slate-700"><h2 className="text-xl font-semibold text-slate-900">API đặt lịch đã sẵn sàng</h2><p className="mt-3 leading-7">Gửi yêu cầu POST đến <code className="rounded bg-white px-2 py-1 text-sm">/api/appointments</code>. Giao diện form sẽ được bổ sung ở giai đoạn UI tiếp theo.</p></div></Container>;
}
