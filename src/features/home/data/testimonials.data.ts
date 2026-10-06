export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  avatar?: string;
  source?: string;
  initials: string;
  accent: "blue" | "green" | "blue-dark";
}

export const testimonials: readonly Testimonial[] = [
  { id: "review-1", customerName: "Bác Trần Thanh Tùng", rating: 5, content: "“Tôi bay từ Úc về để trồng 4 trụ Implant tại cơ sở 1 Hồ Hảo Hớn. Thật sự bất ngờ vì bác sĩ làm êm vô cùng, không hề đau đớn như tôi lo sợ. Sau 3 tháng răng ăn nhai cực kì thoải mái.”", source: "Việt kiều Úc • Implant Toàn Hàm", initials: "TT", accent: "blue" },
  { id: "review-2", customerName: "Chị Nguyễn Hồng Hạnh", rating: 5, content: "“Làm việc trong ngành truyền thông nên tôi cực kỳ kỹ tính về độ tự nhiên của răng sứ. Bác sĩ Trâm thiết kế form răng bo tròn thanh thoát, bạn bè ai cũng khen cười tươi mà không hề bị giả tạo!”", source: "Quận 3 • Dán Sứ Veneer Emax", initials: "NH", accent: "green" },
  { id: "review-3", customerName: "Bạn Đỗ Đăng Khoa", rating: 5, content: "“Mình nhổ 2 chiếc răng khôn mọc lệch 90 độ bằng máy siêu âm Piezotome ở CS2 Ngô Gia Tự. Quá trình làm chưa đầy 20 phút, về nhà uống thuốc theo toa không sưng má một ngày nào!”", source: "Quận 5 • Nhổ Răng Khôn Siêu Âm", initials: "ĐK", accent: "blue-dark" },
];
