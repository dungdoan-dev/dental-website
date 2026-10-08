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

type ClinicContactProps = { title: string; address: string; phone: string; workingHours: string; qrSrc: string; accent?: "blue" | "green" };

function ClinicContact({ title, address, phone, workingHours, qrSrc, accent = "blue" }: ClinicContactProps) {
  const accentClass = accent === "green" ? "text-brand-green border-brand-green" : "text-brand-blue border-brand-blue";
  return (
    <div className="space-y-4">
      <h3 className={`inline-block border-b-2 pb-2 text-xl font-bold text-text-primary ${accentClass}`}>{title}</h3>
      <div className="space-y-2.5 text-sm text-text-secondary">
        <div className="flex items-start gap-2.5"><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${accentClass}`} name="location" /><span>{address}</span></div>
        <div className="flex items-center gap-2.5"><Icon className="h-5 w-5 shrink-0 text-brand-green" name="phone" /><a className="text-base font-bold text-brand-blue-dark hover:underline" href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a></div>
        <div className="flex items-start gap-2.5"><Icon className={`mt-0.5 h-5 w-5 shrink-0 ${accentClass}`} name="clock" /><div><p className="font-medium text-text-primary">{workingHours}</p></div></div>
      </div>
      <figure className="pt-2">
        <figcaption className="mb-2 text-sm font-semibold text-text-primary">Quét QR Zalo của {title}</figcaption>
        <Image alt={`Mã QR Zalo ${title}`} className="h-44 w-44 rounded-xl border border-border-subtle bg-white p-1" height={176} src={qrSrc} unoptimized width={176} />
      </figure>
    </div>
  );
}

export function Footer({ clinics }: { clinics: readonly Clinic[] }) {
  return (
    <footer className="w-full border-t border-border-subtle bg-surface-container-high">
      <div className="mx-auto max-w-7xl px-margin-mobile py-16 md:px-margin lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4"><Link className="inline-block" href="/"><Image alt="Nha Khoa 2000" className="h-11 w-auto object-contain" height={42} src="/images/logo/nha-khoa-2000.png" width={126} /></Link><p className="text-lg font-bold italic text-brand-blue">You Smile, We Smile</p><p className="text-sm leading-relaxed text-text-secondary">Hơn 25 năm kiến tạo hàng ngàn nụ cười hạnh phúc, tiên phong cấy ghép kỹ thuật số và nha khoa chuyên sâu chuẩn quốc tế tại TP.HCM.</p><div className="space-y-1 pt-2 text-xs text-text-secondary"><p className="font-semibold text-text-primary">CÔNG TY TNHH NHA KHOA 2000</p><p>GPĐKKD: 0302396828 do Sở KH&amp;ĐT TP.HCM cấp</p><p>GPHĐ: 00128/SYT-GPHĐ &amp; 05037/HCM-GPHĐ</p></div></div>
          {clinics.map((clinic, index) => <ClinicContact accent={clinic.accent} address={clinic.address} key={clinic.id} phone={clinic.phone} qrSrc={index === 0 ? "/images/qr/CS1-QROA.jpg" : "/images/qr/CS2-QROA.jpg"} title={clinic.label} workingHours={clinic.workingHours} />)}
          <div className="space-y-4"><h3 className="inline-block border-b-2 border-brand-blue pb-2 text-xl font-bold text-text-primary">Liên Kết Nhanh</h3><ul className="space-y-2 text-sm text-text-secondary">{quickLinks.map((item) => <li className="flex items-center gap-1.5" key={item.href}><Icon className="h-3.5 w-3.5 text-brand-blue" name="chevron-right" /><Link className="transition hover:text-brand-blue" href={item.href}>{item.label}</Link></li>)}</ul></div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-8 text-xs text-text-secondary md:flex-row"><p>© 2024 Nha Khoa 2000. Giữ toàn quyền bảo lưu bản quyền thương hiệu.</p><div className="flex flex-wrap items-center justify-center gap-6"><Link className="hover:text-brand-blue" href="/gioi-thieu">Chính sách bảo mật</Link><Link className="hover:text-brand-blue" href="/gioi-thieu">Quy chế hoạt động</Link><Link className="hover:text-brand-blue" href="/bang-gia">Chính sách bảo hành</Link></div></div>
      </div>
    </footer>
  );
}
