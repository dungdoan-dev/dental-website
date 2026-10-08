import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CardCarousel } from "@/components/common/CardCarousel";
import { DoctorCard } from "@/features/doctors/components/DoctorCard";
import { getDoctors } from "@/features/doctors/services/doctor.service";

export async function DoctorTeamSection() {
  const doctors = await getDoctors();
  return <section className="bg-background-secondary py-12 lg:py-16" id="doi-ngu-chuyen-gia"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-[2.5rem]">Đội ngũ bác sĩ</h2><Link className="inline-flex items-center gap-2 text-[15px] font-bold text-brand-blue hover:text-brand-blue-dark" href="/bac-si">Xem toàn bộ đội ngũ bác sĩ<Icon className="h-5 w-5" name="arrow-right" /></Link></div><CardCarousel label="Đội ngũ bác sĩ" nextLabel="Bác sĩ kế tiếp" pageLabel="Trang bác sĩ" previousLabel="Bác sĩ trước">{doctors.map((doctor) => <div className="h-full [&>a]:h-full" key={doctor.id}><DoctorCard doctor={doctor} /></div>)}</CardCarousel></div></section>;
}
