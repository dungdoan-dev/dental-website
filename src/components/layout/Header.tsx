import Image from "next/image";
import Link from "next/link";
import { AppointmentButton } from "@/components/common/AppointmentButton";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { Navbar } from "./Navbar";

export function Header() {
  return (
      <header className="fixed inset-x-0 top-[34px] z-40 h-20 border-b border-border-subtle bg-white/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-margin-mobile md:px-margin lg:gap-4">
          <Link aria-label="Nha Khoa 2000 - Trang chủ" className="shrink-0" href="/"><Image alt="Nha Khoa 2000" className="h-8 w-auto object-contain sm:h-10" height={42} priority src="/images/logo/nha-khoa-2000.png" width={126} /></Link>
          <Navbar />
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <HeaderSearch />
            <AppointmentButton className="px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-[13px] xl:px-6"><span className="sm:hidden">Đặt lịch</span><span className="hidden sm:inline">ĐẶT LỊCH HẸN</span></AppointmentButton>
            <MobileMenu />
          </div>
        </div>
      </header>
  );
}
