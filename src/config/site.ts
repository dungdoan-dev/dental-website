export const siteConfig = {
  name: "Nha Khoa 2000",
  description: "Hơn 25 năm kiến tạo hàng ngàn nụ cười hạnh phúc, tiên phong cấy ghép kỹ thuật số và nha khoa chuyên sâu chuẩn quốc tế tại TP.HCM.",
  contact: {
    phone: "1900 966 960",
    secondaryPhone: "1900 888 642",
    email: "contact@nhakhoa2000.vn",
    address: "99 Hồ Hảo Hớn, Phường Cầu Ông Lãnh, Quận 1, TP. Hồ Chí Minh",
  },
  // Legacy components may still be imported by downstream customizations; clinic records live in PostgreSQL.
  clinics: [] as readonly { id: string; label: string; district: string; phone: string; address: string; facebook: string; zalo: string }[],
  social: {
    facebook: "",
    youtube: "",
    tiktok: "",
  },
} as const;
