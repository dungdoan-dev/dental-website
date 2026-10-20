"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, FileText, HeartPulse, House, Info, LayoutDashboard, Phone, Users, type LucideIcon } from "lucide-react";
import { PendingCount } from "./PendingCount";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/admin-ui/sidebar";

type NavItem = { href: string; label: string; icon: LucideIcon; pending?: boolean };

export function AdminSidebar({ pendingAppointments }: { pendingAppointments: Promise<number> }) {
  const pathname = usePathname();
  const section = useSearchParams().get("section");
  const { setOpenMobile } = useSidebar();

  // Website content follows the public site menu order; one click reaches each page's editor.
  const groups: readonly { title: string; items: readonly NavItem[] }[] = [
    { title: "Tổng quan", items: [{ href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard }] },
    { title: "Lịch hẹn", items: [{ href: "/admin/appointments", label: "Đặt lịch hẹn", icon: CalendarDays, pending: true }] },
    { title: "Nội dung website", items: [
      { href: "/admin/home", label: "Trang chủ", icon: House },
      { href: "/admin/content?section=about", label: "Giới thiệu", icon: Info },
      { href: "/admin/services", label: "Dịch vụ", icon: HeartPulse },
      { href: "/admin/doctors", label: "Bác sĩ", icon: Users },
      { href: "/admin/articles", label: "Kiến thức", icon: FileText },
      { href: "/admin/clinics", label: "Liên hệ & Cơ sở", icon: Phone },
    ] },
  ];

  function isItemActive(href: string): boolean {
    const [path, query] = href.split("?");
    if (path === "/admin") return pathname === "/admin";
    if (query) return pathname === path && section === query.split("=")[1];
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Link className="flex items-center gap-2" href="/admin" onClick={() => setOpenMobile(false)}>
          <Image alt="Nha Khoa 2000" className="h-9 w-auto object-contain group-data-[collapsible=icon]:hidden" height={42} priority src="/images/logo/nha-khoa-2000.png" width={126} />
          <span className="hidden text-sm font-extrabold text-primary group-data-[collapsible=icon]:block">NK</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-6 group-data-[collapsible=icon]:px-0">
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isItemActive(item.href)} tooltip={item.label}>
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.pending ? <PendingCount promise={pendingAppointments}>{(count) => count > 0 ? <SidebarMenuBadge className="rounded-full bg-destructive px-1.5 text-[10px] text-white peer-data-[active=true]/menu-button:text-white">{count > 99 ? "99+" : count}</SidebarMenuBadge> : null}</PendingCount> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
