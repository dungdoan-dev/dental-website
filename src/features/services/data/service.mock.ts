import type { DentalService, ServiceCategory } from "../types/service.type";

const baseServiceMockData: readonly Omit<DentalService, "category">[] = [
  { id: "service-1", name: "Cấy Ghép Implant Kỹ Thuật Số", slug: "trong-rang-implant", shortDescription: "Phục hồi răng mất với kế hoạch điều trị cá nhân hóa, có thể kết hợp chẩn đoán hình ảnh 3D theo chỉ định của bác sĩ.", description: "Giải pháp phục hồi răng mất bằng Implant được bác sĩ lập kế hoạch theo tình trạng xương hàm và nhu cầu của từng người.", image: "/images/services/implant-digital.jpg", badge: "Digital Implant", badgeVariant: "blue", featured: true },
  { id: "service-2", name: "Răng Sứ Thẩm Mỹ & Mặt Dán Veneer", slug: "boc-rang-su", shortDescription: "Nụ cười tự nhiên rạng rỡ, thiết kế chuẩn nhân tướng học và đường cười Smile Design, bảo tồn tối đa răng thật với phôi sứ cao cấp.", description: "Giải pháp thẩm mỹ nụ cười được thiết kế theo đường cười Smile Design và ưu tiên bảo tồn răng thật.", image: "/images/services/veneer-cosmetic.jpg", badge: "Cosmetic Dentistry", badgeVariant: "blue", featured: true },
  { id: "service-3", name: "Niềng Răng - Chỉnh Nha Trong Suốt", slug: "nieng-rang", shortDescription: "Điều chỉnh khớp cắn hoàn hảo với khay niềng vô hình thẩm mỹ Invisalign Hoa Kỳ, biết trước kết quả điều trị qua mô phỏng 3D.", description: "Điều chỉnh khớp cắn với kế hoạch chỉnh nha cá nhân hóa và mô phỏng kết quả điều trị 3D.", image: "/images/services/orthodontics.jpg", badge: "Orthodontics", badgeVariant: "green", featured: true },
  { id: "service-4", name: "Điều Trị Viêm Nha Chu & Cạo Vôi Siêu Âm", slug: "dieu-tri-tong-quat", shortDescription: "Làm sạch mảng bám và điều trị mô nha chu bằng thiết bị siêu âm, giúp kiểm soát viêm nướu và bảo vệ nền răng khỏe mạnh.", description: "Quy trình kiểm soát viêm nha chu chuyên sâu giúp làm sạch mảng bám, chăm sóc mô nướu và duy trì sức khỏe răng miệng lâu dài.", image: "/images/services/endodontics.jpg", badge: "Periodontal Care", badgeVariant: "green", featured: true },
  { id: "service-5", name: "Nhổ Răng Khôn Không Đau Piezotome", slug: "nho-rang-khon-piezotome", shortDescription: "Sóng siêu âm Piezotome hỗ trợ bóc tách mô nhẹ nhàng, giảm xâm lấn và rút ngắn thời gian hồi phục sau tiểu phẫu.", description: "Ứng dụng sóng siêu âm Piezotome hỗ trợ bóc tách mô nhẹ nhàng, giảm xâm lấn và rút ngắn thời gian hồi phục.", image: "/images/services/wisdom-tooth-piezotome.jpg", badge: "Piezotome Surgery", badgeVariant: "blue", featured: true },
  { id: "service-6", name: "Nha Khoa Trẻ Em & Dự Phòng Sâu Răng", slug: "nha-khoa-tre-em", shortDescription: "Chăm sóc nụ cười bé yêu trong không gian điều trị thân thiện, ngừa sâu sớm với Vecni Fluor sinh học, giúp bé vui vẻ hợp tác.", description: "Chăm sóc và phòng ngừa các vấn đề răng miệng cho trẻ trong môi trường thân thiện, nhẹ nhàng.", image: "/images/services/pediatric-dentistry.jpg", badge: "Pediatric Care", badgeVariant: "green", featured: true },
];

const categoryByServiceId: Record<string, ServiceCategory> = {
  "service-1": "implant",
  "service-2": "aesthetic",
  "service-3": "orthodontics",
  "service-4": "periodontics",
  "service-5": "other",
  "service-6": "pediatric",
};

const additionalServices: readonly DentalService[] = [
  {
    id: "service-7",
    name: "Tẩy Trắng Răng Laser Whitening",
    slug: "tay-trang-rang",
    shortDescription: "Cải thiện sắc độ răng an toàn bằng năng lượng laser được kiểm soát, cho nụ cười sáng tự nhiên ngay sau liệu trình.",
    description: "Liệu trình tẩy trắng được cá nhân hóa theo sắc độ men răng, kết hợp quy trình bảo vệ nướu và kiểm soát ê buốt.",
    image: "/images/services/veneer-cosmetic.jpg",
    badge: "Laser Whitening",
    badgeVariant: "blue",
    featured: false,
    category: "aesthetic",
  },
  {
    id: "service-8",
    name: "Phục Hình Cầu Răng Sứ & Hàm Tháo Lắp",
    slug: "phuc-hinh-cau-rang-su",
    shortDescription: "Khôi phục chức năng ăn nhai và thẩm mỹ bằng phương án phục hình phù hợp với tình trạng răng, khớp cắn và ngân sách.",
    description: "Giải pháp phục hình răng mất được thiết kế theo tình trạng lâm sàng, giúp khôi phục khả năng ăn nhai và sự hài hòa của nụ cười.",
    image: "/images/services/implant-digital.jpg",
    badge: "Prosthodontics",
    badgeVariant: "green",
    featured: false,
    category: "general",
  },
  {
    id: "service-9",
    name: "Điều Trị Tủy Răng Kính Hiển Vi",
    slug: "dieu-tri-tuy-rang-kinh-hien-vi",
    shortDescription: "Kính hiển vi phóng đại hỗ trợ quan sát hệ thống ống tủy, tăng độ chính xác và ưu tiên bảo tồn răng thật lâu dài.",
    description: "Điều trị nội nha dưới kính hiển vi giúp bác sĩ quan sát rõ hệ thống ống tủy và kiểm soát tốt hơn các vị trí phức tạp.",
    image: "/images/services/endodontics.jpg",
    badge: "Microscope Endodontics",
    badgeVariant: "blue",
    featured: false,
    category: "general",
  },
];

export const serviceMockData: readonly DentalService[] = [
  ...baseServiceMockData.map((service) => ({
    ...service,
    category: categoryByServiceId[service.id],
  })),
  ...additionalServices,
];
