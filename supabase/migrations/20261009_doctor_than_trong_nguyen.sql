-- Add Dr. Thân Trọng Nguyên from the official public profile.
-- Apply after 20251006_init.sql and the later additive migrations.
BEGIN;

-- Remove the original AI-generated placeholder doctors from the initial seed.
-- Child rows are deleted explicitly; appointment doctor references are set NULL
-- by the existing foreign key. Keep verified doctor-1 and doctor-9 records.
DELETE FROM doctor_certificates WHERE doctor_id IN ('doctor-2', 'doctor-3', 'doctor-4', 'doctor-5', 'doctor-6', 'doctor-7', 'doctor-8');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN ('doctor-2', 'doctor-3', 'doctor-4', 'doctor-5', 'doctor-6', 'doctor-7', 'doctor-8');
DELETE FROM doctor_education WHERE doctor_id IN ('doctor-2', 'doctor-3', 'doctor-4', 'doctor-5', 'doctor-6', 'doctor-7', 'doctor-8');
DELETE FROM doctor_specialties WHERE doctor_id IN ('doctor-2', 'doctor-3', 'doctor-4', 'doctor-5', 'doctor-6', 'doctor-7', 'doctor-8');
DELETE FROM doctors WHERE id IN ('doctor-2', 'doctor-3', 'doctor-4', 'doctor-5', 'doctor-6', 'doctor-7', 'doctor-8');

-- Remove matching detail rows first so this import is repeatable if it has not
-- yet been edited in Admin. The profile itself is upserted by its unique slug.
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-than-trong-nguyen');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-than-trong-nguyen');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-than-trong-nguyen');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-than-trong-nguyen');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-than-trong-nguyen',
  'ThS.BS.CKII Thân Trọng Nguyên',
  'bac-si-than-trong-nguyen',
  '/images/doctors/than-trong-nguyen/portrait.jpg',
  'Bác sĩ chuyên khoa II',
  'Implant · Phẫu thuật miệng · Phẫu thuật mô mềm',
  21,
  'Cầu toàn trong công việc và phẫu thuật. Lấy nền tảng y-sinh học và lợi ích lâu dài của bệnh nhân làm cốt lõi trong triết lý điều trị.',
  'Chuyên gia Implant',
  'Hơn 20 năm kinh nghiệm',
  FALSE,
  'implant',
  'Implant & Phẫu thuật miệng',
  '003284/HCM-CCHN',
  'Cầu toàn trong công việc và phẫu thuật; lấy nền tảng y-sinh học và lợi ích lâu dài của bệnh nhân làm cốt lõi trong triết lý điều trị.',
  '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-than-trong-nguyen/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Implant', 1),
  ('Phẫu thuật miệng', 2),
  ('Phẫu thuật mô mềm', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-than-trong-nguyen';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM — 2003', 1),
  ('Tu nghiệp tại Pháp — 2004', 2),
  ('Bác sĩ Phẫu thuật miệng, Bệnh viện Răng Hàm Mặt Trung ương TP.HCM — 2004–2010', 3),
  ('Thạc sĩ Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM — 2016', 4),
  ('Chuyên khoa II Răng Hàm Mặt, Trường Đại học Y Dược Cần Thơ — 2024', 5),
  ('Đào tạo chuyên sâu về Implant và mô mềm tại Đức, Ý, Hungary và các hội nghị chuyên ngành quốc tế', 6)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-than-trong-nguyen';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Phẫu thuật miệng từ năm 2005.', 1),
  ('Phẫu thuật Implant từ năm 2010.', 2),
  ('Phẫu thuật viên chính tại Nha Khoa 2000 từ năm 2008.', 3),
  ('Chủ tịch Hội Implant TP.HCM, nhiệm kỳ 2026–2029.', 4),
  ('ITI Fellow khu vực Đông Nam Á; cố vấn đào tạo Phân hội ITI Việt Nam và Chủ tịch Câu lạc bộ ITI TP.HCM.', 5),
  ('Giảng viên thỉnh giảng và báo cáo viên về Implant, phẫu thuật mô mềm tại các chương trình và hội nghị chuyên ngành.', 6)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-than-trong-nguyen';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 003284/HCM-CCHN', '/images/doctors/than-trong-nguyen/certificates/cchn.jpg', 1),
  ('Bằng Thạc sĩ Răng Hàm Mặt', 'Trường Đại học Y Dược TP.HCM', 'Cấp năm 2016', '/images/doctors/than-trong-nguyen/certificates/thac-si.jpg', 2),
  ('Đào tạo liên tục chuyên ngành Cấy ghép Implant nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương Hà Nội', '120 giờ đào tạo, năm 2012', '/images/doctors/than-trong-nguyen/certificates/implant.jpg', 3),
  ('Bằng Chuyên khoa cấp II Răng Hàm Mặt', 'Trường Đại học Y Dược Cần Thơ', 'Khóa 2022–2024, cấp năm 2024', '/images/doctors/than-trong-nguyen/certificates/ckii.jpg', 4),
  ('Tái tạo nha chu và phẫu thuật tạo hình quanh Implant vùng thẩm mỹ', 'Khóa học quốc tế cùng GS. Giovanni Zucchelli, Bologna', 'Tham dự khóa học năm 2019', '/images/doctors/than-trong-nguyen/certificates/chung-chi-implant.jpg', 5),
  ('Kỹ thuật tái tạo xương và mô mềm nâng cao trong Implant', 'Urban Regeneration Institute', 'Khóa học tại Hungary, năm 2022', '/images/doctors/than-trong-nguyen/certificates/chung-chi-implant-2026.jpg', 6),
  ('Ghép xương và quản lý mô mềm — Clinical Master Program', 'International Centre for Implantology and Oral Surgery, Đức', 'Khóa học cùng GS. F. Khoury, năm 2022', '/images/doctors/than-trong-nguyen/certificates/khoury.jpg', 7),
  ('Điều trị bệnh nhân nha chu và phẫu thuật tạo hình quanh Implant', 'CE Program, School of Dental Medicine, University of Bern', 'Khóa học năm 2023', '/images/doctors/than-trong-nguyen/certificates/chung-chi-2.jpg', 8),
  ('ITI Fellowship', 'International Team for Implantology', 'Thời hạn 01/01/2025–31/12/2026', '/images/doctors/than-trong-nguyen/certificates/iti-fellow.jpg', 9)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-than-trong-nguyen';

-- Doctor profile: BS.CKI Huỳnh Thúy Nga
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-huynh-thuy-nga');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-huynh-thuy-nga');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-huynh-thuy-nga');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-huynh-thuy-nga');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-huynh-thuy-nga',
  'BS.CKI Huỳnh Thúy Nga',
  'bac-si-cki-huynh-thuy-nga',
  '/images/doctors/huynh-thuy-nga/portrait.jpg',
  'Bác sĩ Chuyên khoa I',
  'Chỉnh hình răng mặt',
  19,
  'Bác sĩ có nhiều năm thâm niên trong lĩnh vực chỉnh hình răng mặt, điều trị chỉnh nha can thiệp sớm ở trẻ em, chỉnh nha bằng mắc cài kim loại, mắc cài sứ và khay trong suốt. Bác sĩ tư vấn, lập kế hoạch điều trị, theo dõi tiến trình và phối hợp đa chuyên khoa khi cần.',
  'Chỉnh nha',
  'Chỉnh nha trẻ em & khay trong suốt',
  FALSE,
  'ortho',
  'Chỉnh nha & Chỉnh hình răng mặt',
  '004565/HCM-CCHN',
  'Tiếp cận và điều trị chỉnh hình can thiệp trong giai đoạn sớm ở trẻ em, giúp thay đổi hướng phát triển không thuận lợi và hạn chế các ca khó về sau.',
  '["Tiếng Việt", "Tiếng Anh chuyên ngành"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-cki-huynh-thuy-nga/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chỉnh hình răng mặt', 1),
  ('Chỉnh nha tăng trưởng cho trẻ em', 2),
  ('Chỉnh nha bằng khay trong suốt', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-cki-huynh-thuy-nga';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM — khóa 2001–2007', 1),
  ('Bác sĩ Chuyên khoa I Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM — khóa 2019–2021', 2),
  ('Chứng chỉ Chỉnh hình răng mặt, Đại học Y Dược TP.HCM liên kết HVO và IFDE — khóa 2013–2015', 3),
  ('Chứng chỉ chỉnh nha bằng khay trong suốt từ chẩn đoán, thiết kế đến sản xuất — Đại học Y Dược TP.HCM, khóa 2023–2024', 4),
  ('Chứng chỉ Kiểm soát nhiễm khuẩn', 5),
  ('Chứng nhận Invisalign Provider', 6),
  ('Thành viên Hội Chỉnh hình Răng mặt TP.HCM (HAO); tham dự các chương trình đào tạo liên tục chuyên ngành', 7)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-cki-huynh-thuy-nga';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Tư vấn và lập kế hoạch điều trị chỉnh nha chi tiết theo tình trạng của từng bệnh nhân.', 1),
  ('Điều trị bằng mắc cài kim loại, mắc cài sứ và các khí cụ chỉnh nha tăng trưởng.', 2),
  ('Theo dõi tiến trình điều trị bằng khay trong suốt và phối hợp đa chuyên khoa khi cần.', 3),
  ('Can thiệp chỉnh hình răng mặt sớm cho trẻ em nhằm hỗ trợ hướng phát triển răng hàm mặt.', 4)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-cki-huynh-thuy-nga';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 004565/HCM-CCHN; cấp ngày 03/12/2012', '/images/doctors/huynh-thuy-nga/certificates/cchn.jpg', 1),
  ('Chứng chỉ đào tạo Chỉnh hình Răng mặt', 'Đại học Y Dược TP.HCM, liên kết HVO và IFDE', '250 tiết; khóa 2013–2015', '/images/doctors/huynh-thuy-nga/certificates/chinh-hinh-rang-mat.jpg', 2),
  ('Bằng Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2019–2021; cấp năm 2022', '/images/doctors/huynh-thuy-nga/certificates/ck1.jpg', 3),
  ('Invisalign Fundamentals Seminar', 'Align Technology', 'Chứng nhận tham dự ngày 13/09/2022', '/images/doctors/huynh-thuy-nga/certificates/invisalign.jpg', 4),
  ('Cập nhật kiến thức y khoa liên tục: Bệnh lý và phẫu thuật', 'Đại học Y Dược TP.HCM', '4 tiết học; năm 2023', '/images/doctors/huynh-thuy-nga/certificates/benh-ly-va-phau-thuat.jpg', 5),
  ('Chỉnh hình răng mặt bằng khay trong suốt — từ chẩn đoán, thiết kế đến sản xuất', 'Đại học Y Dược TP.HCM', '100 tiết; khóa 2023–2024', '/images/doctors/huynh-thuy-nga/certificates/chinh-nha-khay-trong-suot.jpg', 6),
  ('Phương pháp dạy — học lâm sàng cho người giảng dạy thực hành', 'Trường Đại học Quốc tế Hồng Bàng', '40 tiết; tháng 7/2025', '/images/doctors/huynh-thuy-nga/certificates/phuong-phap-day.jpg', 7),
  ('Tối ưu hóa hiệu quả trong chỉnh nha — từ nguyên tắc đến ứng dụng lâm sàng', 'Hội Y học TP.HCM và Liên Chi hội Chỉnh hình Răng mặt TP.HCM', '6 giờ tín chỉ; tháng 11/2024', '/images/doctors/huynh-thuy-nga/certificates/toi-uu-hoa-chinh-nha.jpg', 8),
  ('Giấy chứng nhận hội viên Hội Chỉnh hình Răng mặt TP.HCM', 'Hội Y học TP.HCM', 'Hội viên năm 2022', '/images/doctors/huynh-thuy-nga/certificates/hoi-vien-hao.jpg', 9),
  ('Điều trị chỉnh nha cho bệnh nhân đang tăng trưởng — Phần 2', 'Hội Y học TP.HCM, Liên Chi hội Chỉnh hình Răng mặt TP.HCM', '6 giờ tín chỉ; tháng 11/2024', '/images/doctors/huynh-thuy-nga/certificates/chinh-nha-tang-truong.jpg', 10),
  ('Cập nhật kiến thức nha khoa liên tục: Chấn thương răng — Khóa 1', 'Bệnh viện Răng Hàm Mặt TP.HCM', '16 giờ tín chỉ; tháng 3/2025', '/images/doctors/huynh-thuy-nga/certificates/chan-thuong-rang.jpg', 11)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-cki-huynh-thuy-nga';

-- Doctor profile: Bác sĩ Ngô Thụy Tuyết Ngọc
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-ngo-thuy-tuyet-ngoc');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-ngo-thuy-tuyet-ngoc');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-ngo-thuy-tuyet-ngoc');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-ngo-thuy-tuyet-ngoc');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-ngo-thuy-tuyet-ngoc',
  'Bác sĩ Ngô Thụy Tuyết Ngọc',
  'bac-si-ngo-thuy-tuyet-ngoc',
  '/images/doctors/ngo-thuy-tuyet-ngoc/portrait.jpg',
  'Bác sĩ Răng Hàm Mặt',
  'Nha khoa Răng Hàm Mặt · Implant',
  15,
  'Bác sĩ có 15 năm kinh nghiệm trong lĩnh vực Răng Hàm Mặt, từng hoạt động tại nhiều bệnh viện lớn trực thuộc trung ương tại TP.HCM. Bác sĩ có bằng bác sĩ Răng Hàm Mặt và chứng chỉ cấy ghép răng Implant.',
  'Nha khoa tổng quát',
  '15 năm kinh nghiệm',
  FALSE,
  'implant',
  'Nha khoa Răng Hàm Mặt & Implant',
  '001365/HCM-CCHN',
  'Thân thiện, hòa nhã với bệnh nhân và đồng nghiệp; nhiệt tình, năng nổ và không ngừng học hỏi.',
  '["Tiếng Việt", "Tiếng Anh"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-ngo-thuy-tuyet-ngoc/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Nha khoa Răng Hàm Mặt', 1),
  ('Cấy ghép răng Implant', 2)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-ngo-thuy-tuyet-ngoc';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bằng Bác sĩ Răng Hàm Mặt chính quy, Trường Đại học Y Dược TP.HCM', 1),
  ('Các chứng chỉ đào tạo liên tục ngắn hạn của Đại học Y Dược TP.HCM và Bệnh viện Răng Hàm Mặt', 2),
  ('Chứng chỉ Cấy ghép răng Implant', 3)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-ngo-thuy-tuyet-ngoc';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('15 năm kinh nghiệm trong lĩnh vực nha khoa Răng Hàm Mặt.', 1),
  ('Từng hoạt động tại nhiều bệnh viện lớn trực thuộc trung ương tại TP.HCM.', 2),
  ('Có chứng chỉ đào tạo về cấy ghép răng Implant.', 3)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-ngo-thuy-tuyet-ngoc';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 001365/HCM-CCHN', '/images/doctors/ngo-thuy-tuyet-ngoc/certificates/chung-chi.jpg', 1)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-ngo-thuy-tuyet-ngoc';

-- Doctor profile: Bác sĩ CKI Nguyễn Thị Lan Phương
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-nguyen-thi-lan-phuong');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-nguyen-thi-lan-phuong');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-nguyen-thi-lan-phuong');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-nguyen-thi-lan-phuong');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-nguyen-thi-lan-phuong',
  'Bác sĩ CKI Nguyễn Thị Lan Phương',
  'b-s-nguyen-thi-lan-phuong',
  '/images/doctors/nguyen-thi-lan-phuong/portrait.jpg',
  'Bác sĩ Chuyên khoa I',
  'Điều trị nha khoa tổng quát',
  0,
  'Bác sĩ điều trị tổng quát tại Nha Khoa 2000, tốt nghiệp Bác sĩ Răng Hàm Mặt và Chuyên khoa I tại Đại học Y Dược TP.HCM.',
  'Nha khoa tổng quát',
  'Điều trị tổng quát',
  FALSE,
  'pediatric',
  'Nha khoa tổng quát',
  '048599/HCM-CCHN',
  'Bác sĩ điều trị tổng quát tại Nha Khoa 2000.',
  '["Tiếng Việt", "Tiếng Anh"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/b-s-nguyen-thi-lan-phuong/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Nha khoa tổng quát', 1),
  ('Cấy ghép nha khoa Implant', 2),
  ('Chỉnh nha bằng khay trong suốt', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'b-s-nguyen-thi-lan-phuong';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM', 1),
  ('Bác sĩ Chuyên khoa I Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM', 2),
  ('Đào tạo liên tục chuyên ngành Cấy ghép nha khoa — 180 tiết, năm 2023', 3),
  ('Invisalign Fundamentals Seminar — tham dự ngày 14/02/2023', 4)
) AS x(content, sort_order)
WHERE d.slug = 'b-s-nguyen-thi-lan-phuong';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ điều trị tổng quát tại Nha Khoa 2000.', 1)
) AS x(content, sort_order)
WHERE d.slug = 'b-s-nguyen-thi-lan-phuong';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 048599/HCM-CCHN; cấp ngày 29/05/2020', '/images/doctors/nguyen-thi-lan-phuong/certificates/cchn.jpg', 1),
  ('Bằng Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2017–2019; cấp ngày 25/12/2019', '/images/doctors/nguyen-thi-lan-phuong/certificates/ck1.jpg', 2),
  ('Chứng chỉ đào tạo liên tục Cấy ghép nha khoa', 'Đại học Y Dược TP.HCM', '180 tiết; khóa học từ 01/11 đến 02/12/2023', '/images/doctors/nguyen-thi-lan-phuong/certificates/implant.jpg', 3),
  ('Invisalign Fundamentals Seminar', 'Align Technology', 'Chứng nhận tham dự ngày 14/02/2023', '/images/doctors/nguyen-thi-lan-phuong/certificates/invisalign.jpg', 4)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'b-s-nguyen-thi-lan-phuong';

-- Doctor profile: BS. CKI Phan Duy Ân
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-phan-duy-an',
  'BS. CKI Phan Duy Ân',
  'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn',
  '/images/doctors/phan-duy-an/portrait.jpg',
  'Bác sĩ Chuyên khoa I',
  'Nha khoa tổng quát · Phẫu thuật miệng · Nha chu',
  0,
  'Bác sĩ CKI Phan Duy Ân có chuyên môn về nhổ răng, tiểu phẫu thuật, phẫu thuật và điều trị nha chu, đồng thời thăm khám và lập phác đồ điều trị các bệnh lý răng miệng thường gặp.',
  'Phẫu thuật nha khoa',
  'Phẫu thuật miệng & Nha chu',
  FALSE,
  'surgery',
  'Phẫu thuật & Nha khoa tổng quát',
  '049577/HCM-CCHN',
  'Ưu tiên giải pháp điều trị nhẹ nhàng, hạn chế xâm lấn và giúp bệnh nhân an tâm.',
  '["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Nhổ răng & tiểu phẫu thuật', 1),
  ('Phẫu thuật và điều trị nha chu', 2),
  ('Nha khoa tổng quát', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Đại học Y Dược TP.HCM — 2018', 1),
  ('Bác sĩ Chuyên khoa I, chuyên ngành Nha khoa Phẫu thuật, Đại học Y Dược TP.HCM — 2022', 2)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Thăm khám, chẩn đoán và lập phác đồ điều trị các bệnh lý răng miệng thường gặp.', 1),
  ('Thực hiện nhổ răng, tiểu phẫu vùng miệng và điều trị nha chu theo chỉ định chuyên môn.', 2)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 049577/HCM-CCHN; cấp năm 2020', '/images/doctors/phan-duy-an/certificates/cchn.jpg', 1),
  ('Bằng Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2020–2022; cấp năm 2023', '/images/doctors/phan-duy-an/certificates/ck1.jpg', 2),
  ('Chứng chỉ đào tạo liên tục Phẫu thuật miệng', 'Bệnh viện Răng Hàm Mặt Trung Ương TP.HCM', '325 tiết; hoàn thành năm 2023', '/images/doctors/phan-duy-an/certificates/phau-thuat-mieng.jpg', 3),
  ('Chứng nhận cập nhật kiến thức y khoa liên tục: Phẫu thuật nha chu cơ bản', 'Bệnh viện Răng Hàm Mặt Trung Ương TP.HCM', '110 tiết; hoàn thành năm 2024', '/images/doctors/phan-duy-an/certificates/nha-chu.jpg', 4),
  ('Chứng chỉ đào tạo kỹ thuật chuyên môn Cấy ghép nha khoa', 'Bệnh viện Răng Hàm Mặt Trung Ương TP.HCM', '72 tiết; hoàn thành năm 2025', '/images/doctors/phan-duy-an/certificates/implant.jpg', 5)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-cki-phan-duy-an-chhn-049577-hcm-cchn';

-- Doctor profile: Bác sĩ CKI Võ Đăng Khoa
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-vo-dang-khoa');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-vo-dang-khoa');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-vo-dang-khoa');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-vo-dang-khoa');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-vo-dang-khoa',
  'Bác sĩ CKI Võ Đăng Khoa',
  'bac-si-vo-dang-khoa',
  '/images/doctors/vo-dang-khoa/portrait.jpg',
  'Bác sĩ Chuyên khoa I',
  'Nha khoa tổng quát · Phục hồi · Nha chu',
  20,
  'Bác sĩ CKI Võ Đăng Khoa có gần 20 năm kinh nghiệm trong lĩnh vực Răng Hàm Mặt và hiện đảm nhận công việc điều trị nha khoa tổng quát tại Nha Khoa 2000.',
  'Nha khoa tổng quát',
  'Gần 20 năm kinh nghiệm',
  FALSE,
  'surgery',
  'Nha khoa tổng quát & Phục hồi',
  '000137/HCM-CCHN',
  'Hãy luôn vui cười đón nhận mọi việc bằng sự lạc quan và thường xuyên đến nha sĩ chăm sóc nụ cười của bạn.',
  '["Tiếng Việt", "Tiếng Anh"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-vo-dang-khoa/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Nha khoa tổng quát', 1),
  ('Nha khoa phục hồi', 2),
  ('Phẫu thuật nha chu', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-vo-dang-khoa';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt chính quy, Đại học Y Dược TP.HCM — khóa 2007–2009', 1),
  ('Bác sĩ Chuyên khoa I, chuyên ngành Nha khoa Phục hồi', 2),
  ('Các chương trình đào tạo liên tục ngắn hạn tại Đại học Y Dược TP.HCM và Bệnh viện Răng Hàm Mặt', 3)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-vo-dang-khoa';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Gần 20 năm kinh nghiệm trong lĩnh vực nha khoa Răng Hàm Mặt.', 1),
  ('Bác sĩ điều trị nha khoa tổng quát tại Nha Khoa 2000.', 2)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-vo-dang-khoa';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 000137/HCM-CCHN', '/images/doctors/vo-dang-khoa/certificates/cchn.jpg', 1),
  ('Bằng Bác sĩ Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Hệ chính quy; khóa 2007–2009', '/images/doctors/vo-dang-khoa/certificates/bang-rang-ham-mat.jpg', 2),
  ('Chứng chỉ đào tạo Phẫu thuật nha chu — Khóa 04', 'Đại học Y Dược TP.HCM', '115 tiết; hoàn thành năm 2017', '/images/doctors/vo-dang-khoa/certificates/phau-thuat-nha-chu.jpg', 3)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-vo-dang-khoa';

-- Doctor profile: Bác sĩ Huỳnh Ngọc Diễm
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-huynh-ngoc-diem');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-huynh-ngoc-diem');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-huynh-ngoc-diem');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'bac-si-huynh-ngoc-diem');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-huynh-ngoc-diem',
  'Bác sĩ Huỳnh Ngọc Diễm',
  'bac-si-huynh-ngoc-diem',
  '/images/doctors/huynh-ngoc-diem/portrait.jpg',
  'Bác sĩ Răng Hàm Mặt',
  'Nha khoa tổng quát · Chỉnh nha · Nha chu',
  10,
  'Bác sĩ Huỳnh Ngọc Diễm có hơn 10 năm kinh nghiệm thăm khám và điều trị nha khoa tổng quát; có chứng chỉ chỉnh nha và phẫu thuật nha chu.',
  'Nha khoa tổng quát',
  'Hơn 10 năm kinh nghiệm',
  FALSE,
  'ortho',
  'Nha khoa tổng quát & Chỉnh nha',
  '001711/HCM-CCHN',
  'Bác sĩ khuyến khích duy trì tinh thần lạc quan và thường xuyên thăm khám để chăm sóc nụ cười.',
  '["Tiếng Việt", "Tiếng Anh"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/bac-si-huynh-ngoc-diem/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Nha khoa tổng quát', 1),
  ('Chỉnh nha', 2),
  ('Phẫu thuật nha chu', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'bac-si-huynh-ngoc-diem';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Đại học Y Dược TP.HCM', 1),
  ('Chứng chỉ Chỉnh nha — 2013', 2),
  ('Đào tạo liên tục ngắn hạn tại Đại học Y Dược TP.HCM và Bệnh viện Răng Hàm Mặt', 3)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-huynh-ngoc-diem';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Hơn 10 năm kinh nghiệm thăm khám và điều trị nha khoa tổng quát.', 1),
  ('Từng đảm nhiệm công việc bác sĩ Răng Hàm Mặt tại Đại học Y Dược TP.HCM.', 2)
) AS x(content, sort_order)
WHERE d.slug = 'bac-si-huynh-ngoc-diem';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 001711/HCM-CCHN; cấp năm 2012', '/images/doctors/huynh-ngoc-diem/certificates/cchn.jpg', 1)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'bac-si-huynh-ngoc-diem';

-- Doctor profile: Bác sĩ Trần Khoa Bằng
DELETE FROM doctor_certificates WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-tran-khoa-bang');
DELETE FROM doctor_experience_highlights WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-tran-khoa-bang');
DELETE FROM doctor_education WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-tran-khoa-bang');
DELETE FROM doctor_specialties WHERE doctor_id IN (SELECT id FROM doctors WHERE slug = 'b-s-tran-khoa-bang');

INSERT INTO doctors (
  id, name, slug, avatar, position, specialty, experience, description,
  badge, highlight, featured, category, directory_title, license_number,
  quote, languages, source_url
) VALUES (
  'doctor-tran-khoa-bang',
  'Bác sĩ Trần Khoa Bằng',
  'b-s-tran-khoa-bang',
  '/images/doctors/tran-khoa-bang/portrait.jpg',
  'Bác sĩ Răng Hàm Mặt',
  'Cấy ghép Implant · Phẫu thuật răng khôn',
  0,
  'Bác sĩ Trần Khoa Bằng chuyên phẫu thuật răng khôn và cấy ghép Implant. Bác sĩ chú trọng chẩn đoán kỹ, giải thích rõ ràng và xây dựng phác đồ điều trị phù hợp cho từng khách hàng.',
  'Phẫu thuật & Implant',
  'Phẫu thuật răng khôn · Implant',
  FALSE,
  'implant',
  'Implant & Phẫu thuật miệng',
  '0022673/BYT-CCHN',
  'Ưu tiên điều trị an toàn, nhẹ nhàng, bảo tồn tối đa răng thật và hướng đến hiệu quả lâu dài.',
  '["Tiếng Việt", "Tiếng Anh"]'::jsonb,
  'https://nhakhoa2000.com/bac-si/b-s-tran-khoa-bang/'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  position = EXCLUDED.position,
  specialty = EXCLUDED.specialty,
  experience = EXCLUDED.experience,
  description = EXCLUDED.description,
  badge = EXCLUDED.badge,
  highlight = EXCLUDED.highlight,
  category = EXCLUDED.category,
  directory_title = EXCLUDED.directory_title,
  license_number = EXCLUDED.license_number,
  quote = EXCLUDED.quote,
  languages = EXCLUDED.languages,
  source_url = EXCLUDED.source_url;

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT d.id, x.specialty, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Cấy ghép Implant', 1),
  ('Phẫu thuật răng khôn', 2),
  ('Phẫu thuật miệng', 3)
) AS x(specialty, sort_order)
WHERE d.slug = 'b-s-tran-khoa-bang';

INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Bác sĩ Răng Hàm Mặt, Đại học Y Dược TP.HCM', 1),
  ('Chứng chỉ Cấy ghép nha khoa, Đại học Y Dược TP.HCM — 2017', 2),
  ('Chứng chỉ Phẫu thuật miệng, Bệnh viện Răng Hàm Mặt Trung Ương — 2021', 3)
) AS x(content, sort_order)
WHERE d.slug = 'b-s-tran-khoa-bang';

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT d.id, x.content, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chuyên phẫu thuật răng khôn và cấy ghép Implant.', 1),
  ('Thăm khám cẩn thận, giải thích rõ tình trạng và cá nhân hóa kế hoạch điều trị.', 2),
  ('Chú trọng quy trình vô trùng, an toàn và bảo tồn tối đa răng thật.', 3)
) AS x(content, sort_order)
WHERE d.slug = 'b-s-tran-khoa-bang';

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT d.id, x.title, x.issuer, x.detail, x.image, x.sort_order
FROM doctors d
CROSS JOIN (VALUES
  ('Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Bộ Y tế', 'Số 0022673/BYT-CCHN; cấp năm 2014', '/images/doctors/tran-khoa-bang/certificates/cchn.jpg', 1),
  ('Chứng chỉ Cấy ghép nha khoa — Khóa 14', 'Đại học Y Dược TP.HCM', '180 tiết; hoàn thành năm 2017', '/images/doctors/tran-khoa-bang/certificates/implant.jpg', 2),
  ('Chứng chỉ Nghiệp vụ sư phạm y học cơ bản', 'Đại học Y khoa Phạm Ngọc Thạch', '80 tiết; hoàn thành năm 2020', '/images/doctors/tran-khoa-bang/certificates/nghiep-vu-su-pham-y-hoc.jpg', 3),
  ('Chứng chỉ đào tạo liên tục Phẫu thuật miệng', 'Bệnh viện Răng Hàm Mặt Trung Ương TP.HCM', '325 tiết; hoàn thành năm 2021', '/images/doctors/tran-khoa-bang/certificates/phau-thuat-mieng.jpg', 4)
) AS x(title, issuer, detail, image, sort_order)
WHERE d.slug = 'b-s-tran-khoa-bang';

COMMIT;
