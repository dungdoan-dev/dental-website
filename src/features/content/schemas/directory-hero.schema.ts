import { z } from "zod";

export const directoryHeroSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600),
});

export type DirectoryHero = z.infer<typeof directoryHeroSchema>;

// One editable title + description per public list page; the key is the site_content row.
export const directoryHeroPages = {
  services: {
    key: "service_directory_hero", label: "Tiêu đề trang dịch vụ", path: "/dich-vu",
    defaults: { title: "Dịch Vụ Nha Khoa Chuyên Sâu", description: "Hơn 25 năm đồng hành kiến tạo nụ cười khỏe đẹp với công nghệ tân tiến và đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm." },
  },
  doctors: {
    key: "doctor_directory_hero", label: "Tiêu đề trang bác sĩ", path: "/bac-si",
    defaults: { title: "ĐỘI NGŨ BÁC SĨ", description: "Đội ngũ y bác sĩ đầy kinh nghiệm và tận tâm, tay nghề cao, y đức tốt, luôn luôn được cập nhật kiến thức và công nghệ hiện đại của Nha Khoa 2000, luôn coi việc điều trị cho bệnh nhân như chính người thân trong gia đình mình, sử dụng vật liệu chất lượng cao cùng trang thiết bị và kỹ thuật tiên tiến sẽ đem đến cho bạn những tiêu chuẩn điều trị cao nhất." },
  },
  articles: {
    key: "article_directory_hero", label: "Tiêu đề trang kiến thức", path: "/tin-tuc",
    defaults: { title: "CẨM NANG & KIẾN THỨC NHA KHOA", description: "Chia sẻ thông tin chăm sóc răng miệng, giải thích các phương pháp điều trị và giải đáp những câu hỏi thường gặp." },
  },
  contact: {
    key: "contact_hero", label: "Tiêu đề trang liên hệ", path: "/lien-he",
    defaults: { title: "Chúng tôi luôn sẵn sàng lắng nghe bạn.", description: "Liên hệ để được hỗ trợ chọn cơ sở, tìm hiểu dịch vụ hoặc gửi yêu cầu đặt lịch. Đội ngũ Nha Khoa 2000 sẽ tiếp nhận và liên hệ xác nhận với bạn." },
  },
} as const satisfies Record<string, { key: string; label: string; path: string; defaults: DirectoryHero }>;

export type DirectoryHeroPage = keyof typeof directoryHeroPages;
