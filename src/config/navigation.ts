import { serviceGroups, servicePriceLink } from "@/features/services/data/service-filter.data";

type NavigationChild = {
  label: string;
  href: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  children?: readonly NavigationChild[];
};

export const navigation: readonly NavigationItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  {
    label: "Dịch vụ",
    href: "/dich-vu",
    children: [
      ...serviceGroups.map((group) => ({ label: group.label, href: `/dich-vu?nhom=${group.value}` })),
      servicePriceLink,
    ],
  },
  { label: "Đội ngũ bác sĩ", href: "/bac-si" },
  { label: "Kiến thức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function isNavigationItemActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false;
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
