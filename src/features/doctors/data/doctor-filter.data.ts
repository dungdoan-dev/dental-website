import type { DoctorCategory } from "../types/doctor.type";

export type DoctorFilter = { label: string; value: "all" | DoctorCategory };

export const doctorFilters: readonly DoctorFilter[] = [
  { label: "Tất Cả Bác Sĩ", value: "all" },
  { label: "Cấy Ghép Implant", value: "implant" },
  { label: "Chỉnh Nha - Niềng Răng", value: "ortho" },
  { label: "Răng Sứ & Thẩm Mỹ", value: "aesthetic" },
  { label: "Phẫu Thuật Hàm Mặt & Nha Chu", value: "surgery" },
  { label: "Nha Khoa Trẻ Em & Tổng Quát", value: "pediatric" },
];
