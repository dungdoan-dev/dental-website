import type { Metadata } from "next";
import { DoctorBookingSection } from "@/features/doctors/components/DoctorBookingSection";
import { DoctorDirectoryHero } from "@/features/doctors/components/DoctorDirectoryHero";
import { DoctorFilterGrid } from "@/features/doctors/components/DoctorFilterGrid";
import { getDoctors } from "@/features/doctors/services/doctor.service";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Đội ngũ bác sĩ & chuyên gia",
  description: "Đội ngũ bác sĩ và chuyên gia Răng Hàm Mặt giàu kinh nghiệm tại Nha Khoa 2000.",
  url: "/bac-si",
});

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return (
    <>
      <DoctorDirectoryHero />
      <DoctorFilterGrid doctors={doctors} />
      <DoctorBookingSection doctors={doctors} />
    </>
  );
}
