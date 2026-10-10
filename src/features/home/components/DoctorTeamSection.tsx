import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CardCarousel } from "@/components/common/CardCarousel";
import { DoctorCard } from "@/features/doctors/components/DoctorCard";
import { getDoctors } from "@/features/doctors/services/doctor.service";
import { getHomeSectionCopy } from "../services/home.service";

export async function DoctorTeamSection() {
  const [doctors, copy] = await Promise.all([getDoctors(), getHomeSectionCopy()]);

  return (
    <section className="bg-background-secondary py-5 lg:py-6" id="doi-ngu-chuyen-gia">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="mx-auto mb-4 flex max-w-2xl flex-col items-center text-center">
          <h2 className="whitespace-nowrap text-[clamp(1.25rem,3.2vw,2.5rem)] font-extrabold tracking-tight text-text-primary">
            {copy.doctors.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">{copy.doctors.note}</p>
        </div>
        <CardCarousel
          footerAction={
            <Link
              className="inline-flex items-center gap-2 text-[15px] font-bold text-brand-blue hover:text-brand-blue-dark"
              href="/bac-si"
            >
              Xem toàn bộ đội ngũ bác sĩ
              <Icon className="h-5 w-5" name="arrow-right" />
            </Link>
          }
          label="Đội ngũ bác sĩ"
          nextLabel="Bác sĩ kế tiếp"
          pageLabel="Trang bác sĩ"
          previousLabel="Bác sĩ trước"
        >
          {doctors.map((doctor) => (
            <div className="h-full [&>a]:h-full" key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
