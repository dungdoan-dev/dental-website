import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { DoctorList } from "@/features/doctors/components/DoctorList";
import { getFeaturedDoctors } from "@/features/doctors/services/doctor.service";

export async function DoctorTeamSection() {
  const doctors = await getFeaturedDoctors();
  return <section className="bg-background-secondary py-16 lg:py-24" id="doi-ngu-chuyen-gia"><div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-4 text-center"><h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-[2.5rem]">Đội ngũ bác sĩ</h2><Link className="inline-flex items-center gap-2 text-[15px] font-bold text-brand-blue hover:text-brand-blue-dark" href="/bac-si">Xem toàn bộ đội ngũ bác sĩ<Icon className="h-5 w-5" name="arrow-right" /></Link></div><DoctorList doctors={doctors} /></div></section>;
}
