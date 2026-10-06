export type NavigationItem = {
  label: string;
  href: string;
};

export const navigation: readonly NavigationItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Đội ngũ bác sĩ", href: "/bac-si" },
  { label: "Cơ sở vật chất", href: "/#co-so-vat-chat" },
  { label: "Kiến thức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function isNavigationItemActive(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
