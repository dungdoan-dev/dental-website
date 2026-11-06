import type { AboutPageData, AboutPhoto } from "../schemas/about.schema";

/** What the photo viewer and <Image> need: `full` is the larger crop when one exists. */
export type AboutImage = { src: string; full: string; alt: string; caption: string };

export function toAboutImage(photo: AboutPhoto): AboutImage {
  return { src: photo.src, full: photo.src.replace("/catalogue/web/", "/catalogue/original/"), alt: photo.caption, caption: photo.caption };
}

export const aboutSubnav = [
  { label: "Về chúng tôi", href: "/gioi-thieu" },
  { label: "Giấy phép hoạt động", href: "/gioi-thieu/giay-phep-hoat-dong" },
  { label: "Bảo hiểm", href: "/gioi-thieu/bao-hiem" },
  { label: "Hoạt động nội bộ", href: "/gioi-thieu/hoat-dong-noi-bo" },
  { label: "Câu hỏi thường gặp", href: "/gioi-thieu/cau-hoi-thuong-gap" },
] as const;

const photo = (id: string, caption: string): AboutPhoto => ({ src: `/images/about/catalogue/web/${id}.jpg`, caption });

/** Used until the about_page record exists in site_content, and as the seed for it. */
export const defaultAboutContent: AboutPageData = {
  hero: {
    title: "Về Nha Khoa 2000",
    description: "Thành lập ngày 01.11.1999 bởi Bác sĩ Võ Văn Tự Hiến, Nha Khoa 2000 được ví như “cái nôi” của nha khoa tư nhân tại TP. Hồ Chí Minh. Hai cơ sở tại Quận 1 và Quận 5 chăm sóc nụ cười khách hàng với phương châm “Coi bệnh nhân như người thân trong gia đình”.",
    photo: photo("cs1-team-facade", "Đội ngũ Nha Khoa 2000 tại Cơ sở 1"),
  },
  highlights: [
    { value: "01.11.1999", label: "Thành lập cơ sở đầu tiên" },
    { value: "2 cơ sở", label: "Quận 1 và Quận 5, TP.HCM" },
    { value: "11/2024", label: "Kỷ niệm 25 năm thành lập" },
  ],
  founder: {
    name: "Bác sĩ Võ Văn Tự Hiến",
    role: "Người sáng lập · Cố vấn chuyên môn Nha Khoa 2000",
    photo: photo("founder", "Chân dung Bác sĩ Võ Văn Tự Hiến"),
    paragraphs: [
      "Sau quá trình tu nghiệp ở nước ngoài, nhận thấy tại TP. Hồ Chí Minh chưa có phòng khám nha khoa đạt tiêu chuẩn quốc tế, cũng như hệ thống nha khoa tư nhân còn sơ khởi, với mong muốn đem đến cho người dân một trung tâm chăm sóc răng miệng đạt chuẩn, Bác sĩ Võ Văn Tự Hiến đã thành lập Nha Khoa 2000.",
      "Do đam mê nghiên cứu chuyên môn và mong muốn được điều trị trực tiếp, Bác sĩ Tự Hiến thành lập Nha Khoa 2000 như một lẽ tự nhiên, không hề có chủ đích kinh doanh. Ông kiêm nhiệm nhiều vị trí, từ bác sĩ điều trị tới người điều hành nha khoa và Chủ tịch hội Implant HSDI, ICOI. Điều đó cũng lý giải vì sao Nha Khoa 2000 không chú trọng truyền thông, quảng cáo và chỉ dừng lại ở 2 chi nhánh để tập trung đầu tư chuyên môn thật tốt.",
    ],
    credentials: [
      "Cựu Chủ tịch Hội Cấy ghép Nha khoa TP.HCM.",
      "Cựu Chủ tịch Hiệp hội Chuyên gia Implant Quốc tế tại Việt Nam.",
      "Cựu Chủ tịch Hội đồng Thẩm định ICOI Việt Nam.",
      "Cựu Đại sứ Hiệp hội ICOI.",
      "Cựu Trưởng khoa Cấy ghép Nha khoa - BV. RHM Trung Ương.",
      "Cố vấn chuyên môn Nha Khoa 2000.",
    ],
    traits: ["Giỏi chuyên môn", "Giản dị", "Có tâm", "Truyền cảm hứng", "Giàu lòng nhân ái"],
  },
  history: {
    title: "Hành trình từ một cơ sở nhỏ",
    intro: "Cái tên NHA KHOA 2000 được lấy cảm hứng từ năm 2000, năm của sự chuyển giao, một thiên niên kỷ mới. Sự hình thành của Nha Khoa 2000 mở ra cánh cửa mới cho hệ thống nha khoa tư nhân tại TP.HCM.",
    milestones: [
      {
        date: "01.11.1999", tag: "Cơ sở đầu tiên", title: "“Cái nôi” Nha khoa tư nhân TP.HCM", stat: "5 ghế ban đầu",
        text: "Khi mới ra đời, Nha Khoa 2000 chỉ là một cơ sở nhỏ nhưng đầy khát vọng. Ban Giám Đốc tự tìm tòi tài liệu nước ngoài, cân đối với thực tế trong nước để xây dựng hệ thống quản lý chất lượng: từ quy trình điều trị, hồ sơ bệnh nhân, giấy tờ pháp lý tới bảng giá và quy trình thăm khám.",
        photos: [photo("hist-cong-quynh-team", "Phòng khám Nha Khoa 2000 trên đường Cống Quỳnh"), photo("h13-cong-quynh-facade", "Mặt tiền phòng khám Nha Khoa 2000 trên đường Cống Quỳnh"), photo("hist-early-treatment", "Những năm đầu hoạt động"), photo("h13-tu-van", "Quầy tư vấn những năm đầu")],
      },
      {
        date: "14.02.2002", tag: "Cơ sở thứ hai", title: "Phòng nha tiên tiến vượt bậc", stat: "12 ghế ban đầu",
        text: "Năm 2002, cơ sở 2 chính thức mở cửa để thực hiện những ca điều trị chuyên sâu hơn, với các máy móc như máy đo hôi miệng, máy phát hiện sâu răng, máy điều trị laser. Số ghế tăng gấp đôi so với cơ sở 1, và Nha Khoa Trẻ Em cũng được mở lần đầu tại đây.",
        photos: [photo("h15-toa-nha", "Trung tâm Nha khoa Kỹ thuật cao"), photo("h15-le-tan", "Quầy đón tiếp"), photo("h15-tiet-trung", "Khu tiệt trùng dụng cụ")],
      },
      {
        date: "1999 – 2003", tag: "Kỷ niệm", title: "Kỷ niệm 4 năm thành lập", stat: "",
        text: "Phòng khám kỷ niệm 4 năm thành lập cùng khách hàng.",
        photos: [photo("h15-mat-tien-4-nam", "Kỷ niệm 4 năm thành lập (1999 – 2003)")],
      },
      {
        date: "11/2024", tag: "Cột mốc", title: "25 năm thành lập và phát triển", stat: "",
        text: "Tính tới tháng 11/2024, Nha Khoa 2000 chính thức đạt cột mốc 25 năm thành lập và phát triển, với hai cơ sở tại Quận 1 và Quận 5.",
        photos: [photo("cs2-team-facade", "Đội ngũ Nha Khoa 2000 tại Cơ sở 2"), photo("team-cs2-blue", "Đội ngũ bác sĩ và điều dưỡng")],
      },
    ],
    archive: [
      photo("h13-hop-dau-nam", "Buổi họp đầu năm Nha Khoa 2000"),
      photo("h13-phong-hop", "Buổi họp đội ngũ"),
      photo("h15-khai-truong", "Đón tiếp khách hàng"),
      photo("h15-dieu-tri", "Hoạt động điều trị"),
      photo("h13-dieu-tri", "Phòng điều trị"),
      photo("h15-phau-thuat", "Ê-kíp phẫu thuật"),
    ],
  },
  facilities: {
    title: "Không gian điều trị tại Nha Khoa 2000",
    rooms: [
      { title: "Phòng điều trị", text: "Cơ sở 1: 13 ghế điều trị. Cơ sở 2: 10 ghế điều trị. Nơi diễn ra các hoạt động thăm khám, hồi sức cho bệnh nhân.", photo: photo("fac-dieu-tri", "Phòng điều trị") },
      { title: "Phòng phẫu thuật", text: "Mỗi cơ sở được trang bị 1 phòng phẫu thuật đạt chuẩn, nơi thực hiện các ca phẫu thuật implant, phẫu thuật miệng…", photo: photo("fac-phau-thuat", "Phòng phẫu thuật") },
      { title: "Phòng thanh trùng", text: "Đảm bảo chất lượng vệ sinh vô trùng cho dụng cụ điều trị, giúp ngăn ngừa lây nhiễm chéo.", photo: photo("fac-thanh-trung", "Phòng thanh trùng") },
      { title: "Phòng đón tiếp", text: "Không gian rộng rãi, sạch sẽ, với đội ngũ nhân viên nhiệt tình, thân thiện sẵn sàng hỗ trợ khách hàng.", photo: photo("fac-don-tiep", "Phòng đón tiếp") },
    ],
    // The catalogue swaps the CT and 3D-scanner photos; these are matched to the right device (handoff note 4).
    equipment: [
      { title: "Máy CT Conebeam", text: "Chụp phim toàn hàm, phim sọ nghiêng, sọ thẳng, 3D, khớp thái dương hàm…, hỗ trợ chẩn đoán và lập kế hoạch điều trị.", photo: photo("eq-scan-3d", "Máy CT Conebeam") },
      { title: "Máy scan dấu 3D", text: "Lấy dấu thoải mái hơn phương pháp truyền thống khi làm phục hình sứ, giúp bác sĩ tư vấn tình trạng răng qua hình ảnh 3D và hỗ trợ scan lấy dấu Invisalign.", photo: photo("eq-ct-conebeam", "Máy scan dấu 3D") },
      { title: "Đèn tẩy trắng Flash", text: "Hỗ trợ làm trắng răng, giảm ê buốt và thời gian điều trị so với thiết bị cũ.", photo: photo("eq-flash", "Đèn tẩy trắng Flash") },
      { title: "Máy laser Picasso Lite Plus 3.0", text: "Phục vụ phẫu thuật mô mềm, điều trị nha chu và nội nha, giúp bớt chảy máu và tổn thương mô mềm.", photo: photo("eq-laser-picasso", "Máy laser Picasso Lite Plus 3.0") },
      { title: "Máy thổi cát AP-A Air Polisher", text: "Phục vụ điều trị nha chu với hai chế độ thổi cát trên nướu và dưới nướu, giúp loại bỏ sắc tố và mảng bám.", photo: photo("eq-apa-air", "Máy thổi cát AP-A Air Polisher") },
    ],
  },
  license: {
    photo: { src: "/images/about/license-cs1.jpg", caption: "Giấy phép hoạt động khám bệnh, chữa bệnh của phòng khám tại 99 Hồ Hảo Hớn, do Sở Y tế TP.HCM cấp ngày 08/07/2016" },
    companyInfo: [
      { label: "Tên doanh nghiệp", value: "CÔNG TY TNHH NHA KHOA 2000" },
      { label: "Giấy phép đăng ký kinh doanh", value: "0302396828 do Sở KH&ĐT TP.HCM cấp" },
      { label: "Giấy phép hoạt động", value: "00128/SYT-GPHĐ & 05037/HCM-GPHĐ" },
    ],
  },
  insurance: {
    steps: [
      { title: "Xuất trình giấy tờ và thẻ bảo hiểm", text: "Tại Quầy Lễ Tân, Quý khách xuất trình thẻ bảo hiểm (thẻ cứng hoặc thẻ điện tử đã kích hoạt, còn thời hạn) và CCCD hoặc Hộ chiếu. Khách hàng dưới 18 tuổi cung cấp thêm bản sao Giấy khai sinh." },
      { title: "Tiếp nhận và xác minh thông tin", text: "Nhân viên lễ tân đối soát thông tin cá nhân, kiểm tra đơn vị bảo hiểm liên kết và chụp hai mặt giấy tờ theo quy định của công ty bảo hiểm." },
      { title: "Thăm khám, lập kế hoạch và xác nhận phạm vi chi trả", text: "Bác sĩ thăm khám và lập kế hoạch điều trị. Bộ phận Bảo hiểm gửi yêu cầu xác nhận hạn mức đến công ty bảo hiểm theo gói Quý khách tham gia; bác sĩ và nhân viên tư vấn trao đổi để vừa tối ưu quyền lợi, vừa bảo đảm hiệu quả điều trị." },
      { title: "Thanh toán phần ngoài phạm vi, ký xác nhận và hoàn tất hồ sơ", text: "Quý khách thanh toán phần chi phí ngoài phạm vi chi trả (nếu có) và ký xác nhận hồ sơ. Nha Khoa 2000 bàn giao chứng từ liên quan cho công ty bảo hiểm." },
    ],
    benefits: [
      { title: "Thủ tục đơn giản", text: "Đội ngũ lễ tân hỗ trợ quy trình xác minh và làm việc với công ty bảo hiểm." },
      { title: "Minh bạch chi phí", text: "Các khoản được chi trả và phần chênh lệch (nếu có) được tư vấn rõ trước khi điều trị." },
      { title: "Chất lượng điều trị", text: "Đội ngũ bác sĩ giàu kinh nghiệm cùng trang thiết bị hiện đại." },
    ],
  },
  activities: {
    featured: {
      title: "Đội ngũ Nha Khoa 2000",
      description: "Hình ảnh tập thể đội ngũ trước hai cơ sở tại Quận 1 và Quận 5.",
      photos: [photo("cs1-team-facade", "Đội ngũ Nha Khoa 2000 tại Cơ sở 1"), photo("cs2-team-facade", "Đội ngũ Nha Khoa 2000 tại Cơ sở 2")],
    },
    items: [
      { category: "Đội ngũ các cơ sở", title: "Đội ngũ Cơ sở 1", description: "Bác sĩ, điều dưỡng, lễ tân và bộ phận hỗ trợ tại Cơ sở 1, 99 Hồ Hảo Hớn.", photos: [photo("cs1-bac-si", "Đội ngũ bác sĩ Cơ sở 1"), photo("cs1-dieu-duong", "Đội ngũ điều dưỡng Cơ sở 1"), photo("cs1-le-tan-1", "Đội ngũ lễ tân Cơ sở 1"), photo("cs1-le-tan-2", "Đội ngũ Cơ sở 1"), photo("cs1-ho-tro", "Bộ phận hỗ trợ Cơ sở 1")] },
      { category: "Đội ngũ các cơ sở", title: "Đội ngũ Cơ sở 2", description: "Bác sĩ, điều dưỡng, lễ tân và bộ phận hỗ trợ tại Cơ sở 2, 502 Ngô Gia Tự.", photos: [photo("cs2-bac-si", "Đội ngũ bác sĩ Cơ sở 2"), photo("cs2-dieu-tri", "Đội ngũ điều trị Cơ sở 2"), photo("cs2-dieu-duong", "Đội ngũ điều dưỡng Cơ sở 2"), photo("cs2-le-tan", "Đội ngũ Cơ sở 2"), photo("cs2-ho-tro", "Bộ phận hỗ trợ Cơ sở 2")] },
      { category: "Du lịch", title: "Tham quan Malaysia", description: "Đoàn Nha Khoa 2000 trong chuyến tham quan Malaysia.", photos: [photo("act-malaysia-bien", "Tham quan Malaysia"), photo("act-malaysia-cung", "Tham quan Malaysia"), photo("act-putrajaya", "Tham quan Malaysia")] },
      { category: "Du lịch", title: "Chuyến đi Pattaya", description: "Đội ngũ Nha Khoa 2000 chụp ảnh tập thể tại Pattaya.", photos: [photo("act-pattaya", "Chuyến đi Pattaya")] },
      { category: "Gắn kết đội ngũ", title: "Year End Party", description: "Đội ngũ Nha Khoa 2000 cùng gia đình trong buổi tiệc cuối năm.", photos: [photo("act-yep-2", "Year End Party"), photo("act-yep-1", "Year End Party")] },
      { category: "Gắn kết đội ngũ", title: "Những buổi gặp mặt", description: "Những khoảnh khắc gắn kết của đội ngũ ngoài giờ làm việc.", photos: [photo("act-khach-san", "Buổi gặp mặt"), photo("act-an-toi", "Bữa tối cùng nhau"), photo("act-bien", "Hoạt động ngoài trời")] },
      { category: "Sự kiện", title: "Sự kiện nội bộ", description: "Đội ngũ Nha Khoa 2000 trên sân khấu sự kiện nội bộ.", photos: [photo("act-san-khau", "Sự kiện nội bộ")] },
      { category: "Tư liệu", title: "Những hình ảnh đáng nhớ", description: "Hình ảnh tư liệu của đội ngũ Nha Khoa 2000 từ những năm đầu.", photos: [photo("act-xua-nhom", "Hình ảnh tư liệu"), photo("h13-hop-dau-nam", "Buổi họp đầu năm Nha Khoa 2000"), photo("h13-phong-hop", "Buổi họp đội ngũ")] },
    ],
  },
};
