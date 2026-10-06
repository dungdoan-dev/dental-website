import type { Doctor } from "../types/doctor.type";
import { DoctorCard } from "./DoctorCard";

type DoctorListProps = { doctors: readonly Doctor[] };

export function DoctorList({ doctors }: DoctorListProps) {
  return <div className="grid gap-6 md:grid-cols-3">{doctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor.id} />)}</div>;
}
