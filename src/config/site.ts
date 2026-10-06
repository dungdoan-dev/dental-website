export const siteConfig = {
  name: "Nha Khoa 2000",
  description: "Hơn 25 năm kiến tạo hàng ngàn nụ cười hạnh phúc, tiên phong cấy ghép kỹ thuật số và nha khoa chuyên sâu chuẩn quốc tế tại TP.HCM.",
  contact: {
    phone: "1900 966 960",
    secondaryPhone: "1900 888 642",
    email: "contact@nhakhoa2000.vn",
    address: "99 Hồ Hảo Hớn, Phường Cầu Ông Lãnh, Quận 1, TP. Hồ Chí Minh",
  },
  clinics: [
    {
      id: "cs1",
      label: "CS1",
      district: "Quận 1",
      phone: "1900 966 960",
      address: "99 Hồ Hảo Hớn, P. Cầu Ông Lãnh",
      facebook: "https://facebook.com",
      zalo: "https://zalo.me",
    },
    {
      id: "cs2",
      label: "CS2",
      district: "Quận 5",
      phone: "1900 888 642",
      address: "502 Ngô Gia Tự, P. An Đông",
      facebook: "https://facebook.com",
      zalo: "https://zalo.me",
    },
  ],
  social: {
    facebook: "",
    youtube: "",
    tiktok: "",
  },
} as const;
