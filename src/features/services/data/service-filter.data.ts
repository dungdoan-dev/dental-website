import type { ServiceCategory } from "../types/service.type";

export type ServiceFilter = "all" | ServiceCategory;

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
];

export const servicePriceLink = {
  label: "Bảng giá theo danh mục kĩ thuật",
  href: "/bang-gia",
} as const;

export function resolveServiceFilter(value: string | undefined): ServiceFilter {
  return serviceFilters.find((filter) => filter.value === value)?.value ?? "all";
}
