import type { Doctor } from "../types/doctor.type";

/** "ThS.BS.CKII Thân Trọng Nguyên": degree + name, for titles, SEO, search and alt text. */
export function getDoctorFullName(doctor: Pick<Doctor, "degree" | "name">): string {
  return [doctor.degree.trim(), doctor.name.trim()].filter(Boolean).join(" ");
}
