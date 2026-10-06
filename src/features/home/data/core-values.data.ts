export type CoreValue = {
  title: string;
  slogan: string;
  description: string;
  iconKey: "heart" | "care" | "honesty" | "innovation";
};

export const coreValues: readonly CoreValue[] = [
  { title: "THÂN THƯƠNG", slogan: "“Nha Khoa là nhà”", description: "Cảm giác thân thương là điều Nha Khoa 2000 muốn mang lại cho khách hàng cũng như cho đội ngũ nhân viên làm việc tại Nha Khoa.", iconKey: "heart" },
  { title: "TẬN TÂM", slogan: "“Lấy khách hàng làm trung tâm”", description: "Tập thể Nha Khoa 2000 luôn giữ vững tôn chỉ này để tận tâm mang tới dịch vụ tốt nhất cho khách hàng.", iconKey: "care" },
  { title: "TRUNG THỰC", slogan: "“Trung thực là nền tảng đạo đức của mỗi con người”", description: "Trung thực với chính mình, trung thực với khách hàng, trung thực với đối tác là giá trị chúng tôi luôn theo đuổi.", iconKey: "honesty" },
  { title: "TÂN TIẾN", slogan: "“Phát triển song song với sự tiến bộ vượt bậc của ngành nha thế giới”", description: "Chúng tôi luôn nỗ lực nắm bắt xu hướng mới nhất của thế giới, từ máy móc trang thiết bị tới phương pháp điều trị hiện đại nhất.", iconKey: "innovation" },
];
