import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { servicePriceLink } from "@/features/services/data/service-filter.data";
import type { Clinic } from "@/features/clinics/types/clinic.type";

const quickLinks = [
  { label: "Trang Chủ", href: "/" },
  { label: "Giới Thiệu Nha Khoa 2000", href: "/gioi-thieu" },
  { label: "Đội Ngũ Bác Sĩ", href: "/bac-si" },
  { label: "Cơ Sở Vật Chất Hiện Đại", href: "/#co-so-vat-chat" },
  servicePriceLink,
  { label: "Chỉ Đường & Liên Hệ", href: "/lien-he" },
] as const;

type ClinicContactProps = { title: string; address: string; phone: string; qrLabel: string; qrSrc: string };

function ClinicContact({ title, address, phone, qrLabel, qrSrc }: ClinicContactProps) {
  return (
    <div className="grid h-fit content-start gap-y-3">
      <h3 className="inline-block w-full border-b-2 border-brand-blue pb-2 text-lg font-bold text-black">{title}</h3>
      <div className="flex items-start gap-2.5 text-sm leading-relaxed text-black"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" name="location" /><span className="xl:whitespace-nowrap xl:text-xs">{address}</span></div>
      <div className="flex min-h-6 items-center gap-2.5 text-black"><Icon className="h-5 w-5 shrink-0 text-brand-green" name="phone" /><a className="text-base font-bold text-brand-blue-dark underline decoration-brand-blue decoration-2 underline-offset-4" href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a></div>
      <figure className="pt-1">
        <figcaption className="mb-2 text-sm font-semibold text-black">{qrLabel}</figcaption>
        <Image alt={qrLabel} className="h-28 w-28 rounded-lg border border-border-subtle bg-white p-1" height={112} src={qrSrc} unoptimized width={112} />
      </figure>
    </div>
  );
}

function clinicDisplay(clinic: Clinic, index: number) {
  return {
    title: clinic.name,
    address: clinic.address,
    qrLabel: `QR Zalo OA ${clinic.name}`,
    qrSrc: index === 0 ? "/images/qr/CS1-QROA.jpg" : "/images/qr/CS2-QROA.jpg",
  };
}

export function Footer({ clinics }: { clinics: readonly Clinic[] }) {
  // "Thứ hai - Thứ bảy: 08:00 – 12:00 | 13:30 – 20:00" -> days on the label line, hours on the next.
  const [hours, days] = (clinics[0]?.workingHours ?? "08:00–12:00 | 13:30–20:00 (T2 - T7)").split(/:\s+(?=\d)/).reverse();
  return (
    <footer className="w-full border-t border-border-subtle bg-surface-container-high">
      <div className="mx-auto max-w-7xl px-margin-mobile py-12 text-black md:px-margin md:py-14">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-[1.2fr_1.15fr_1.15fr_0.9fr] xl:gap-x-12">
          <div className="space-y-4"><div className="flex flex-col items-start gap-0"><Link className="inline-block" href="/"><Image alt="Nha Khoa 2000" className="h-11 w-auto object-contain" height={42} src="/images/logo/nha-khoa-2000.png" width={126} /></Link><p className="-mt-1 text-lg font-bold italic leading-tight text-brand-blue">You Smile, We Smile</p></div><p className="text-sm leading-relaxed text-black">Hơn 25 năm kiến tạo hàng ngàn nụ cười hạnh phúc, tiên phong cấy ghép kỹ thuật số và nha khoa chuyên sâu chuẩn quốc tế tại TP.HCM.</p><div className="space-y-1 pt-1 text-xs leading-relaxed text-black"><p className="font-semibold">CÔNG TY TNHH NHA KHOA 2000</p><p>GPĐKKD: 0302396828 do Sở KH&amp;ĐT TP.HCM cấp</p><p>GPHĐ: 00128/SYT-GPHĐ &amp; 05037/HCM-GPHĐ</p></div><p className="text-xs leading-relaxed text-black"><span className="font-semibold">Thời gian hoạt động:</span> {days && <>{days}:<br /></>}{hours}</p></div>
          {clinics.map((clinic, index) => {
            const display = clinicDisplay(clinic, index);
            return <ClinicContact address={display.address} key={clinic.id} phone={clinic.phone} qrLabel={display.qrLabel} qrSrc={display.qrSrc} title={display.title} />;
          })}
          <div className="space-y-4"><h3 className="inline-block border-b-2 border-brand-blue pb-2 text-xl font-bold text-black">Liên Kết Nhanh</h3><ul className="space-y-2 text-sm text-black">{quickLinks.map((item) => <li className="flex items-center gap-1.5" key={item.href}><Icon className="h-3.5 w-3.5 text-brand-green" name="chevron-right" /><Link className="transition hover:text-brand-blue" href={item.href}>{item.label}</Link></li>)}</ul></div>
        </div>
        <div className="mt-10 grid gap-4 border-t border-border-subtle pt-5 text-xs text-black sm:grid-cols-[1fr_auto] sm:items-end">
          <p>© 2024 Nha Khoa 2000. Giữ toàn quyền bảo lưu bản quyền thương hiệu.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end"><Link className="hover:text-brand-blue" href="/gioi-thieu">Chính sách bảo mật</Link><Link className="hover:text-brand-blue" href="/gioi-thieu">Quy chế hoạt động</Link><Link className="hover:text-brand-blue" href="/bang-gia">Chính sách bảo hành</Link></div>
        </div>
      </div>
    </footer>
  );
}
