export const HOME_SECTION_COPY = {
  services: { title: "Dịch vụ nha khoa", note: "Các giải pháp điều trị được cá nhân hóa, phù hợp với nhu cầu chăm sóc nụ cười của bạn." },
  doctors: { title: "Đội ngũ bác sĩ", note: "Đội ngũ y bác sĩ giàu kinh nghiệm, tận tâm và luôn cập nhật kiến thức chuyên môn." },
  whyChoose: { title: "Vì Sao Chọn Chúng Tôi?", note: "Chất lượng điều trị, sự tận tâm và trải nghiệm an tâm cho mỗi khách hàng." },
  clinics: { title: "Hệ thống phòng khám", note: "Thông tin địa chỉ, giờ làm việc và liên hệ các cơ sở Nha Khoa 2000." },
  insurance: { title: "Đối Tác Bảo Hiểm & Bảo Lãnh Viện Phí Trực Tiếp", note: "Hỗ trợ thanh toán bảo lãnh viện phí trực tiếp cùng các đối tác bảo hiểm." },
  faq: { title: "Câu hỏi thường gặp khi đến với Nha Khoa 2000", note: "Mọi thắc mắc được đội ngũ chuyên môn giải đáp chi tiết, minh bạch và khoa học." },
  testimonials: { title: "Khách hàng chia sẻ", note: "Cảm nhận của khách hàng sau khi trải nghiệm dịch vụ tại Nha Khoa 2000." },
  vision: { title: "TẦM NHÌN & SỨ MỆNH", note: "Định hướng phát triển và cam kết của Nha Khoa 2000 với khách hàng." },
  values: { title: "4 Giá Trị Tạo Dựng Niềm Tin Bền Vững", note: "Những nguyên tắc làm nên trải nghiệm chăm sóc tận tâm và đáng tin cậy." },
} as const;

export type HomeSectionCopy = { title: string; note: string };
export type HomeSectionCopyMap = Record<keyof typeof HOME_SECTION_COPY, HomeSectionCopy>;
