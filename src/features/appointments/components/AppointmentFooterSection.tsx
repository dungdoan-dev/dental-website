import { Container } from "@/components/common/Container";
import type { AppointmentClinicOption } from "../types/appointment.type";
import { AppointmentForm } from "./AppointmentForm";

type ServiceOption = { id: string; name: string };
type AppointmentFooterSectionProps = { services: readonly ServiceOption[]; clinics: readonly AppointmentClinicOption[] };

export function AppointmentFooterSection({ services, clinics }: AppointmentFooterSectionProps) {
  return (
    <section aria-label="Đặt lịch thăm khám" className="border-t border-border-subtle bg-background-secondary py-8 sm:py-10" id="dat-lich">
      <Container>
        <div className="mx-auto max-w-[42rem]">
          <AppointmentForm clinics={clinics} services={services} />
        </div>
      </Container>
    </section>
  );
}
