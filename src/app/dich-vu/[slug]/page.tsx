import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Container } from "@/components/common/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ImplantServiceDetail } from "@/features/services/components/ImplantServiceDetail";
import { ServiceDetailPageContent } from "@/features/services/components/ServiceDetailPageContent";
import { getImplantDetailData, getServiceBySlug, getServiceDetailData } from "@/features/services/services/service.service";
import { generateSeoMetadata } from "@/lib/seo";

type ServiceDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const service = await getServiceBySlug((await params).slug);
  if (!service) return generateSeoMetadata({ title: "Không tìm thấy dịch vụ" });
  const content = await getServiceDetailData(service.id);
  return generateSeoMetadata({
    title: content?.title ?? service.name,
    description: content?.introduction ?? service.description,
    image: service.image,
    url: `/dich-vu/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = await getServiceBySlug((await params).slug);
  if (!service) notFound();
  const serviceContent = await getServiceDetailData(service.id);
  if (serviceContent) return <ServiceDetailPageContent content={serviceContent} service={service} />;
  if (service.slug === "trong-rang-implant") {
    const content = await getImplantDetailData();
    if (content) return <ImplantServiceDetail content={content} service={service} />;
  }

  return (
    <Container className="py-12">
      <Breadcrumb items={[{ label: "Dịch vụ", href: "/dich-vu" }, { label: service.name }]} />
      <article className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">{service.name}</h1>
        <p className="mt-5 max-w-3xl leading-8 text-slate-600">{service.description}</p>
        <ButtonLink className="mt-8" href="/lien-he">Đặt lịch tư vấn</ButtonLink>
      </article>
    </Container>
  );
}
