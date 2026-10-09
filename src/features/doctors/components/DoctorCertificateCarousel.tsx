import Image from "next/image";
import { CardCarousel } from "@/components/common/CardCarousel";
import type { DoctorCertificate } from "../types/doctor.type";

type DoctorCertificateCarouselProps = { certificates: readonly DoctorCertificate[] };

export function DoctorCertificateCarousel({ certificates }: DoctorCertificateCarouselProps) {
  if (!certificates.length) return null;

  return (
    <section className="space-y-4 pt-2">
      <div className="border-b border-border-subtle pb-2">
        <h2 className="text-lg font-bold uppercase tracking-tight text-text-primary">
          Hình ảnh chứng chỉ &amp; bằng cấp
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">
        Ảnh tài liệu được đăng trên website chính thức của Nha Khoa 2000.
      </p>
      <CardCarousel
        desktopColumns={2}
        label="Hình ảnh chứng chỉ và bằng cấp"
        nextLabel="Xem chứng chỉ tiếp theo"
        pageLabel="Trang chứng chỉ"
        previousLabel="Xem chứng chỉ trước"
      >
        {certificates.map((certificate) => (
          <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm transition-shadow duration-300 hover:shadow-md" key={`${certificate.title}-${certificate.image}`}>
            <a
              aria-label={`Xem ảnh: ${certificate.title}`}
              className="relative block aspect-[4/3] overflow-hidden border-b border-border-subtle bg-[#f8fafc] p-3"
              href={certificate.image}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt={certificate.title}
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                fill
                sizes="(max-width: 768px) 85vw, (max-width: 1280px) 40vw, 360px"
                src={certificate.image}
              />
            </a>
            <div className="flex flex-1 flex-col justify-between gap-3 p-4">
              <div>
                <h3 className="text-sm font-bold leading-snug text-text-primary">{certificate.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{certificate.issuer}</p>
              </div>
              {certificate.detail ? (
                <p className="border-t border-border-subtle pt-2.5 text-xs font-semibold leading-relaxed text-brand-blue-dark">
                  {certificate.detail}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </CardCarousel>
    </section>
  );
}
