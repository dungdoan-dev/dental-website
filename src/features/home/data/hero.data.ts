export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  badgeVariant: "blue" | "green";
  objectPosition?: "center" | "top";
}

export const heroSlides: readonly HeroSlide[] = [
  { id: "clinic", image: "/images/hero/clinic-modern.jpg", imageAlt: "Không gian phòng khám Nha Khoa 2000", badge: "Hệ Thống Phòng Khám Chuẩn Quốc Tế", title: "Không Gian Điều Trị Hiện Đại & Thư Thái", badgeVariant: "blue" },
  { id: "implant", image: "/images/hero/implant-center.jpg", imageAlt: "Trung tâm cấy ghép Implant kỹ thuật số", badge: "Trung Tâm Cấy Ghép Kỹ Thuật Số", title: "Phòng Phẫu Thuật Tiêu Chuẩn Class B Châu Âu", badgeVariant: "green" },
  { id: "team", image: "/images/hero/dental-team.jpg", imageAlt: "Đội ngũ Bác sĩ Nha Khoa 2000", badge: "Thành Lập Từ Năm 1999", title: "BS.CKII Võ Văn Tự Hiến & Đội Ngũ Chuyên Gia", badgeVariant: "blue", objectPosition: "top" },
  { id: "smile", image: "/images/hero/healthy-smile.jpg", imageAlt: "Nụ cười tự nhiên và rạng ngời", badge: "Nụ Cười Khỏe Đẹp Toàn Diện", title: "You Smile, We Smile • Hơn 25 Năm Đồng Hành", badgeVariant: "green" },
];
