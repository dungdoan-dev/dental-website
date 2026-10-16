import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DoctorDetailView } from "@/features/doctors/components/DoctorDetailView";
import { getDoctorBySlug, getDoctors } from "@/features/doctors/services/doctor.service";
import { generateSeoMetadata } from "@/lib/seo";
import { getDoctorFullName } from "@/features/doctors/utils/doctor-card-name";
import { JsonLd } from "@/components/common/JsonLd";
import { physicianJsonLd } from "@/lib/structured-data";

type DoctorDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: DoctorDetailPageProps): Promise<Metadata> {
  const doctor = await getDoctorBySlug((await params).slug);
  return doctor ? generateSeoMetadata({ title: getDoctorFullName(doctor), description: doctor.description, image: doctor.avatar, url: `/bac-si/${doctor.slug}` }) : generateSeoMetadata({ title: "Không tìm thấy bác sĩ" });
}

export default async function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const doctor = await getDoctorBySlug((await params).slug);
  if (!doctor) notFound();
  return <><JsonLd data={physicianJsonLd({ ...doctor, fullName: getDoctorFullName(doctor), specialties: doctor.profile?.specialties ?? [] })} /><DoctorDetailView doctor={doctor} /></>;
}
