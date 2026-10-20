"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ExternalLink, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/admin-ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/admin-ui/breadcrumb";
import { Button } from "@/components/admin-ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/admin-ui/dropdown-menu";
import { SidebarTrigger } from "@/components/admin-ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/admin-ui/tooltip";
import { logoutAdmin } from "../auth/actions";
import { PendingCount } from "./PendingCount";

const SECTION_LABELS: Record<string, string> = {
  "/admin": "Tổng quan",
  "/admin/home": "Trang chủ",
  "/admin/content": "Nội dung website",
  "/admin/services": "Dịch vụ",
  "/admin/doctors": "Đội ngũ bác sĩ",
  "/admin/articles": "Bài viết",
  "/admin/appointments": "Lịch hẹn",
  "/admin/clinics": "Liên hệ & Cơ sở",
};

export function AdminHeader({ email, pendingAppointments }: { email: string; pendingAppointments: Promise<number> }) {
  const pathname = usePathname();
  const section = SECTION_LABELS[pathname] ?? "Quản trị nội dung";

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 bg-white/90 px-4 shadow-card backdrop-blur">
      <SidebarTrigger className="size-10 rounded-full text-muted-foreground hover:text-primary" />
      <Breadcrumb className="ml-1 min-w-0 flex-1">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block">
            <BreadcrumbLink asChild><Link href="/admin">Quản trị</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate font-semibold">{section}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button asChild className="hidden sm:inline-flex" size="sm" variant="soft">
          <Link prefetch={false} href="/" rel="noreferrer" target="_blank"><ExternalLink /> Xem website</Link>
        </Button>

        <PendingCount promise={pendingAppointments}>{(count) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label={`Lịch hẹn cần xử lý: ${count}`} asChild className="relative size-10 rounded-full text-muted-foreground hover:text-primary" size="icon" variant="ghost">
                <Link href="/admin/appointments?status=pending" prefetch={false}>
                  <Bell className="size-5" />
                  {count > 0 ? <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-white">{count > 99 ? "99+" : count}</span> : null}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{count > 0 ? `${count} lịch hẹn chờ duyệt` : "Không có lịch hẹn chờ duyệt"}</TooltipContent>
          </Tooltip>
        )}</PendingCount>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Tài khoản" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" type="button">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">{(email[0] ?? "A").toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">Quản trị viên</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{email || "Đã đăng nhập"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link prefetch={false} href="/" rel="noreferrer" target="_blank"><ExternalLink /> Xem website</Link>
            </DropdownMenuItem>
            <form action={logoutAdmin}>
              <DropdownMenuItem asChild variant="destructive">
                <button className="w-full" type="submit"><LogOut /> Đăng xuất</button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
