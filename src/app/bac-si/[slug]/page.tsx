import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorDetailView } from "@/features/doctors/components/DoctorDetailView";
import { getDoctorBySlug } from "@/features/doctors/services/doctor.service";
import { generateSeoMetadata } from "@/lib/seo";

type DoctorDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: DoctorDetailPageProps): Promise<Metadata> {
  const doctor = await getDoctorBySlug((await params).slug);
  return doctor ? generateSeoMetadata({ title: doctor.name, description: doctor.description, image: doctor.avatar, url: `/bac-si/${doctor.slug}` }) : generateSeoMetadata({ title: "Không tìm thấy bác sĩ" });
}

export default async function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const doctor = await getDoctorBySlug((await params).slug);
  if (!doctor) notFound();
  return <DoctorDetailView doctor={doctor} />;
}
