import type { Doctor } from "../types/doctor.type";

export function getDoctorCardNameLines(doctor: Doctor): { firstLine: string; secondLine: string } {
  if (doctor.nameLines !== 2 || !doctor.nameLine2.trim()) {
    return { firstLine: doctor.name, secondLine: "" };
  }

  const secondLine = doctor.nameLine2.trim();
  const fullName = doctor.name.trim();
  const firstLine = fullName.toLocaleLowerCase().endsWith(secondLine.toLocaleLowerCase())
    ? fullName.slice(0, -secondLine.length).trim()
    : fullName;

  return { firstLine: firstLine || fullName, secondLine };
}
