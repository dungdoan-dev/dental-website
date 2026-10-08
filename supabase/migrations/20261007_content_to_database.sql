-- Apply after 20251006_init.sql. This migration is additive and preserves admin edits.
-- Do not re-run 20251006_init.sql on a database containing real data: it drops tables.

BEGIN;

ALTER TABLE insurance_partners ADD COLUMN IF NOT EXISTS logo_src TEXT;

UPDATE insurance_partners
SET logo_src = CASE code
  WHEN 'PVI' THEN '/images/insurance_logos/PVI.png'
  WHEN 'BẢO VIỆT' THEN '/images/insurance_logos/BAO_VIET.png'
  WHEN 'GEN' THEN '/images/insurance_logos/GEN.png'
  WHEN 'PAP' THEN '/images/insurance_logos/PAP.png'
  WHEN 'LIB' THEN '/images/insurance_logos/LIB.png'
  WHEN 'PTI' THEN '/images/insurance_logos/PTI.png'
  WHEN 'INSM' THEN '/images/insurance_logos/INSM.png'
  WHEN 'SAS' THEN '/images/insurance_logos/SAS.jpg'
  WHEN 'VBI' THEN '/images/insurance_logos/VBI.png'
  WHEN 'BAK' THEN '/images/insurance_logos/BAK.png'
  WHEN 'MIC' THEN '/images/insurance_logos/MIC.png'
  WHEN 'AIA' THEN '/images/insurance_logos/AIA.png'
  WHEN 'ATAC' THEN '/images/insurance_logos/ATAC.png'
  WHEN 'PCV' THEN '/images/insurance_logos/PCV.jpg'
  WHEN 'BLI' THEN '/images/insurance_logos/BLI.jpg'
END
WHERE logo_src IS NULL AND code IN (
  'PVI', 'BẢO VIỆT', 'GEN', 'PAP', 'LIB', 'PTI', 'INSM', 'SAS',
  'VBI', 'BAK', 'MIC', 'AIA', 'ATAC', 'PCV', 'BLI'
);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_content_public_read" ON site_content;
CREATE POLICY "site_content_public_read" ON site_content FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "site_content_service_role_all" ON site_content;
CREATE POLICY "site_content_service_role_all" ON site_content
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

INSERT INTO site_content (key, content) VALUES
('home_why_choose', $content${"image":"https://lh3.googleusercontent.com/aida/AEtjO1X8TXA9ITIaZT49iJQapAM5-lpTOX1YNolONtmfcOgN9l5o4lVbOMVGp7VJhALCltMRQmjtHowDLFVig66-9nTc7FYE_Ia4pc6Q-kdn7UcD5yPKqOXyYguKTxBZ4H4dRz8gRQXFeEjy6rG3kSWqybBlyholcromc3VkVEH0l-Qp-kyPD_zWKp3DI5T3OZ9zefuJ8rS9CY7q4um5HDIZ-mqvV9ijy8g6Kng-LDi9M6l23HXhf4ndX7nq9P0"}$content$::jsonb),
('about_page', $content$
{
  "hero": {
    "eyebrow": "Về Nha Khoa 2000",
    "title": "Chăm sóc nụ cười bằng chuyên môn và sự tận tâm",
    "description": "Thành lập năm 1999 bởi bác sĩ Võ Văn Tự Hiến, Nha Khoa 2000 hướng tới trải nghiệm chăm sóc răng miệng chất lượng, rõ ràng và gần gũi cho mỗi gia đình.",
    "image": "/images/hero/clinic-modern.jpg"
  },
  "highlights": [
    { "value": "1999", "label": "Năm thành lập" },
    { "value": "2", "label": "Cơ sở tại TP. Hồ Chí Minh" },
    { "value": "25+", "label": "Năm đồng hành cùng nụ cười Việt" }
  ],
  "story": {
    "eyebrow": "Hành trình phát triển",
    "title": "Khởi đầu từ mong muốn nâng tầm chăm sóc răng miệng",
    "paragraphs": [
      "Sau thời gian học hỏi ở nước ngoài, bác sĩ Võ Văn Tự Hiến thành lập Nha Khoa 2000 để đưa dịch vụ nha khoa chất lượng cao đến gần hơn với người dân TP. Hồ Chí Minh.",
      "Từ năm 1999, phòng khám từng bước đầu tư cơ sở điều trị, trang thiết bị và đội ngũ chuyên môn. Hai cơ sở hiện phục vụ nhu cầu thăm khám, điều trị và chăm sóc răng miệng của khách hàng."
    ],
    "founderName": "BS. Võ Văn Tự Hiến",
    "founderRole": "Người sáng lập Nha Khoa 2000",
    "image": "/images/doctors/vo-van-tu-hien.jpg"
  },
  "visionMission": {
    "eyebrow": "Định hướng hoạt động",
    "title": "Tầm nhìn và sứ mệnh",
    "introduction": "Một nụ cười khỏe mạnh giúp mỗi người tự tin hơn trong cuộc sống. Đó là động lực để chúng tôi tiếp tục hoàn thiện chuyên môn và chất lượng phục vụ.",
    "vision": "Phát triển hệ thống dịch vụ nha khoa bền vững, trở thành địa chỉ đáng tin cậy khi khách hàng trong và ngoài nước cần điều trị, chăm sóc răng miệng.",
    "mission": "Kết hợp đội ngũ chuyên môn, thái độ phục vụ tận tụy và phương pháp điều trị được cập nhật để mang đến kế hoạch chăm sóc phù hợp cho từng khách hàng."
  },
  "principles": {
    "eyebrow": "Tinh thần Nha Khoa 2000",
    "title": "Những nguyên tắc làm nghề",
    "introduction": "Những nguyên tắc định hướng cách chúng tôi làm nghề và đồng hành cùng khách hàng.",
    "items": [
      { "number": "01", "title": "Tận tâm", "description": "Lắng nghe nhu cầu và xây dựng kế hoạch điều trị phù hợp với tình trạng thực tế của từng khách hàng." },
      { "number": "02", "title": "Chân thật", "description": "Tư vấn rõ ràng, minh bạch và đặt lợi ích lâu dài của khách hàng lên trước." },
      { "number": "03", "title": "Tiên tiến", "description": "Liên tục cập nhật kiến thức, quy trình và công nghệ để hỗ trợ chẩn đoán, điều trị." }
    ]
  },
  "expertise": {
    "eyebrow": "Năng lực phục vụ",
    "title": "Chuyên môn, công nghệ và sự chăm sóc liền mạch",
    "description": "Nha Khoa 2000 chú trọng đào tạo liên tục, ứng dụng công nghệ hình ảnh trong chẩn đoán và tổ chức các bộ phận lễ tân, tổng đài, chăm sóc khách hàng để hỗ trợ người bệnh từ lúc đặt hẹn đến sau điều trị.",
    "commitments": [
      "Đội ngũ bác sĩ được đào tạo chuyên môn và thường xuyên cập nhật kiến thức.",
      "Không gian thăm khám được tổ chức khoa học, chú trọng sự thoải mái và riêng tư.",
      "Quy trình chăm sóc tiếp tục sau điều trị để hỗ trợ khách hàng khi cần."
    ],
    "image": "/images/hero/dental-team.jpg"
  },
  "clinics": {
    "eyebrow": "Hệ thống phòng khám",
    "title": "Hai cơ sở, một cam kết chăm sóc",
    "description": "Mỗi cơ sở được bố trí khu vực thăm khám và điều trị nhằm tạo trải nghiệm thuận tiện, thoải mái cho khách hàng."
  }
}
$content$::jsonb),
('implant_detail', $content$
{
  "priceSourceUrl": "https://nhakhoa2000.com/dich-vu/bang-gia-chi-tiet-theo-danh-muc-ky-thuat/",
  "prices": [
    { "name": "Phẫu thuật cấy ghép Implant", "detail": "Tùy loại Implant và chỉ định điều trị", "price": "24.400.000 – 43.920.000 đ" },
    { "name": "Cấy ghép Implant tức thì sau nhổ răng", "detail": "Chỉ áp dụng khi đủ điều kiện lâm sàng", "price": "24.400.000 – 43.920.000 đ" },
    { "name": "Ghép xương nhân tạo để cấy Implant", "detail": "Chỉ thực hiện khi bác sĩ chỉ định", "price": "7.320.000 – 12.200.000 đ" }
  ],
  "steps": [
    { "number": "01", "title": "Thăm khám & chẩn đoán hình ảnh", "description": "Bác sĩ đánh giá tình trạng răng miệng, xương hàm và chỉ định phim chụp phù hợp để xác định khả năng cấy ghép." },
    { "number": "02", "title": "Lập kế hoạch điều trị", "description": "Vị trí cấy ghép, loại trụ và các can thiệp bổ sung được cân nhắc theo tình trạng cụ thể của từng người." },
    { "number": "03", "title": "Đặt trụ Implant", "description": "Thực hiện thủ thuật theo kế hoạch đã thống nhất; việc gắn răng tạm phụ thuộc vào độ ổn định ban đầu của trụ." },
    { "number": "04", "title": "Phục hình & tái khám", "description": "Sau giai đoạn lành thương và tích hợp xương, bác sĩ đánh giá trước khi lắp phục hình chính thức và hướng dẫn chăm sóc." }
  ],
  "faqs": [
    { "question": "Trồng răng Implant có đau và sưng nhiều không?", "answer": "Thủ thuật thường được thực hiện với gây tê tại chỗ. Mức độ khó chịu và sưng sau điều trị khác nhau tùy từng người, số lượng trụ và can thiệp đi kèm. Bác sĩ sẽ tư vấn cách chăm sóc và kiểm soát đau phù hợp." },
    { "question": "Mất răng bao lâu thì nên đi trồng Implant?", "answer": "Bạn nên thăm khám sớm sau khi mất răng. Cấy ghép tức thì hay cần chờ lành thương phụ thuộc vào tình trạng xương, mô nướu, nhiễm trùng và sức khỏe tổng thể; bác sĩ sẽ quyết định sau khi khám." },
    { "question": "Chi phí và bảo hành trụ Implant được xác định thế nào?", "answer": "Chi phí phụ thuộc loại trụ và các bước điều trị cần thiết. Chính sách bảo hành theo sản phẩm và kế hoạch điều trị thực tế; bạn nên yêu cầu phòng khám cung cấp báo giá và điều kiện bảo hành bằng văn bản trước khi thực hiện." }
  ]
}
$content$::jsonb)
ON CONFLICT (key) DO NOTHING;

COMMIT;
