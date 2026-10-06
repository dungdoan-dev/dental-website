import { Icon } from "@/components/ui/Icon";

export function TopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[34px] overflow-hidden bg-brand-blue-dark px-margin-mobile text-white md:px-margin">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 overflow-hidden whitespace-nowrap text-[11px] font-semibold">
        <div className="flex shrink-0 items-center gap-x-6">
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 opacity-90" name="phone" />
            <span>
              CS1 (Q.1): <strong>1900 966 960</strong> - 99 Hồ Hảo Hớn
            </span>
          </div>
          <div className="hidden items-center gap-1.5 sm:flex">
            <Icon className="h-3.5 w-3.5 opacity-90" name="phone" />
            <span>
              CS2 (Q.5): <strong>1900 888 642</strong> - 502 Ngô Gia Tự
            </span>
          </div>
        </div>
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 md:flex">
          <Icon className="h-3.5 w-3.5 opacity-90" name="clock" />
          <span>08:00–12:00 | 13:30–20:00 (T2 - T7)</span>
        </div>
      </div>
    </div>
  );
}
