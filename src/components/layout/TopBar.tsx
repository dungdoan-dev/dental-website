import { Icon } from "@/components/ui/Icon";
import type { Clinic } from "@/features/clinics/types/clinic.type";

export function TopBar({ clinics }: { clinics: readonly Clinic[] }) {
  const [firstClinic, secondClinic] = clinics;

  const getHeaderLabel = (clinic: Clinic) => {
    if (clinic.id === "clinic-1") return "Trụ sở Quận 1";
    if (clinic.id === "clinic-2") return "Cơ sở Quận 5";
    return clinic.label;
  };

  const getHeaderAddress = (clinic: Clinic) => {
    if (clinic.id === "clinic-1") return "99 Hồ Hảo Hớn, P. Cầu Ông Lãnh, TP.HCM";
    if (clinic.id === "clinic-2") return "502 Ngô Gia Tự, P. An Đông, TP.HCM";
    return clinic.address;
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[34px] overflow-hidden bg-brand-blue-dark px-margin-mobile text-white md:px-margin">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 overflow-hidden whitespace-nowrap text-[11px] font-semibold">
        <div className="flex shrink-0 items-center gap-x-6">
          {firstClinic ? <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 opacity-90" name="phone" />
            <span>{getHeaderLabel(firstClinic)}: <strong>{firstClinic.phone}</strong> - {getHeaderAddress(firstClinic)}</span>
          </div> : null}
          {secondClinic ? <div className="hidden items-center gap-1.5 sm:flex">
            <Icon className="h-3.5 w-3.5 opacity-90" name="phone" />
            <span>{getHeaderLabel(secondClinic)}: <strong>{secondClinic.phone}</strong> - {getHeaderAddress(secondClinic)}</span>
          </div> : null}
        </div>
        {firstClinic ? <div className="ml-auto hidden shrink-0 items-center gap-1.5 md:flex">
          <Icon className="h-3.5 w-3.5 opacity-90" name="clock" />
          <span>{firstClinic.workingHours}</span>
        </div> : null}
      </div>
    </div>
  );
}
