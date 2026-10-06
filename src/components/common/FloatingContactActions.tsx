"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

type ActionType = "phone" | "facebook" | "zalo";

type ContactAction = {
  id: ActionType;
  ariaLabel: string;
  heading: string;
  status: string;
  buttonClassName: string;
  badgeClassName: string;
  linkLabel: (clinic: (typeof siteConfig.clinics)[number]) => string;
  href: (clinic: (typeof siteConfig.clinics)[number]) => string;
  icon: ReactNode;
};

const actions: readonly ContactAction[] = [
  {
    id: "phone",
    ariaLabel: "Gọi điện ngay",
    heading: "Tổng Đài Hotline",
    status: "Hỗ trợ nhanh",
    buttonClassName: "bg-brand-green hover:bg-brand-green-dark",
    badgeClassName: "bg-emerald-50 text-brand-green group-hover/item:bg-brand-green",
    linkLabel: (clinic) => `${clinic.district}: ${clinic.phone}`,
    href: (clinic) => `tel:${clinic.phone.replace(/\s+/g, "")}`,
    icon: <Icon className="h-6 w-6" name="phone" />,
  },
  {
    id: "facebook",
    ariaLabel: "Nhắn tin Facebook",
    heading: "Fanpage Facebook",
    status: "Tư vấn 24/7",
    buttonClassName: "bg-[#1877f2] hover:bg-[#1264d3]",
    badgeClassName: "bg-blue-50 text-[#1877f2] group-hover/item:bg-[#1877f2]",
    linkLabel: (clinic) => `Fanpage ${clinic.label} ${clinic.district}`,
    href: (clinic) => clinic.facebook,
    icon: <svg aria-hidden="true" className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" /></svg>,
  },
  {
    id: "zalo",
    ariaLabel: "Chat qua Zalo",
    heading: "Tư Vấn Trực Tuyến Zalo",
    status: "Chat ngay",
    buttonClassName: "bg-[#0068ff] hover:bg-[#0058d8]",
    badgeClassName: "bg-sky-50 text-[#0068ff] group-hover/item:bg-[#0068ff]",
    linkLabel: (clinic) => `Zalo ${clinic.label} ${clinic.district}`,
    href: (clinic) => clinic.zalo,
    icon: <span className="select-none text-sm font-extrabold tracking-tighter">Zalo</span>,
  },
] as const;

export function FloatingContactActions() {
  const [activeMenu, setActiveMenu] = useState<ActionType | null>(null);

  function toggleMenu(menu: ActionType): void {
    setActiveMenu((current) => current === menu ? null : menu);
  }

  return (
    <aside aria-label="Liên hệ nhanh" className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-5">
      {actions.map((action) => {
        const isActive = activeMenu === action.id;
        const menuId = `floating-contact-${action.id}`;
        return (
          <div className="group/action relative flex items-center justify-end" key={action.id}>
            <div aria-hidden={!isActive} className={`absolute bottom-0 right-14 z-50 w-[min(16rem,calc(100vw-5.5rem))] rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xl transition-all duration-300 ${isActive ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0 group-hover/action:pointer-events-auto group-hover/action:translate-x-0 group-hover/action:opacity-100"}`} id={menuId}>
              <div className="mb-1 flex items-center justify-between border-b border-slate-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400"><span>{action.heading}</span><span className={action.id === "phone" ? "text-brand-green-dark" : action.id === "facebook" ? "text-[#1877f2]" : "text-[#0068ff]"}>{action.status}</span></div>
              <div className="space-y-1.5">
                {siteConfig.clinics.map((clinic) => <a className="group/item flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50" href={action.href(clinic)} key={clinic.id} rel={action.id === "phone" ? undefined : "noopener noreferrer"} target={action.id === "phone" ? undefined : "_blank"}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors group-hover/item:text-white ${action.badgeClassName}`}>{clinic.label}</span><span className="min-w-0 text-left"><span className="block text-xs font-bold text-text-primary transition-colors group-hover/item:text-brand-blue-dark">{action.linkLabel(clinic)}</span><span className="block truncate text-[11px] text-text-secondary">{clinic.address}</span></span></a>)}
              </div>
            </div>
            <button aria-controls={menuId} aria-expanded={isActive} aria-label={action.ariaLabel} className={`relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${action.buttonClassName}`} onClick={() => toggleMenu(action.id)} type="button">
              {action.id === "phone" ? <span aria-hidden="true" className="motion-safe:animate-ping absolute inset-0 rounded-full bg-brand-green opacity-30" /> : null}
              <span className="relative z-10 flex items-center justify-center">{action.icon}</span>
            </button>
          </div>
        );
      })}
    </aside>
  );
}
