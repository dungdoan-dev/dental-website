import type { ServiceCategory } from "../types/service.type";

export type ServiceFilter = "all" | ServiceCategory;

export const serviceFilters: readonly { label: string; value: ServiceFilter }[] = [
  { label: "Tất cả dịch vụ", value: "all" },
  { label: "Cấy ghép Implant", value: "implant" },
  { label: "Răng sứ thẩm mỹ", value: "aesthetic" },
  { label: "Chỉnh nha - Niềng răng", value: "orthodontics" },
  { label: "Nha khoa tổng quát & Trẻ em", value: "general" },
  { label: "Phẫu thuật trong miệng", value: "surgery" },
];
