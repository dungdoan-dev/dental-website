import type { ServiceCategory } from "../types/service.type";

/** "pricing" shows the reference price lists instead of services. */
export type ServiceFilter = "all" | ServiceCategory | "pricing";

export const serviceIconByCategory: Record<ServiceCategory, string> = {
  pediatric: "/icons/dentia/tooth-3.png",
  general: "/icons/dentia/tooth-1.png",
  aesthetic: "/icons/dentia/tooth-2.png",
  orthodontics: "/icons/dentia/tooth-6.png",
  implant: "/icons/dentia/tooth-4.png",
  periodontics: "/icons/dentia/tooth-5.png",
  other: "/icons/dentia/tooth-4.png",
};

export const serviceGroups: readonly { label: string; value: ServiceCategory }[] = [
  { label: "Nha khoa trẻ em", value: "pediatric" },
  { label: "Nha khoa tổng quát", value: "general" },
  { label: "Nha khoa thẩm mỹ", value: "aesthetic" },
  { label: "Chỉnh nha", value: "orthodontics" },
  { label: "Implant", value: "implant" },
  { label: "Nha chu", value: "periodontics" },
  { label: "Khớp cắn (Khác)", value: "other" },
];

export const serviceFilters: readonly { label: string; value: ServiceFilter }[] = [
  { label: "Tất cả dịch vụ", value: "all" },
  ...serviceGroups,
  { label: "Bảng giá tham khảo", value: "pricing" },
];

export const priceLists = [
  { title: "Bảng giá Răng Tổng Quát", image: "/images/pricing/bang-gia-tong-quat.webp", alt: "Bảng giá Nha Khoa 2000: khám và chẩn đoán, nha khoa tổng quát, phục hình thẩm mỹ, implant, chỉnh nha, nha chu, khớp thái dương hàm" },
  { title: "Bảng giá Răng Trẻ Em", image: "/images/pricing/bang-gia-tre-em.webp", alt: "Bảng giá nha khoa trẻ em Nha Khoa 2000: trám răng, chữa tủy, nhổ răng, phục hình, phòng ngừa sâu răng, nha chu, chấn thương răng" },
] as const;

export const servicePriceLink = {
  label: "Bảng Giá Theo Danh Mục Kỹ Thuật",
  href: "/bang-gia",
} as const;

export function resolveServiceFilter(value: string | undefined): ServiceFilter {
  return serviceFilters.find((filter) => filter.value === value)?.value ?? "all";
}
