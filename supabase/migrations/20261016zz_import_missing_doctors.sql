-- Doctors missing from the new site, copied from https://nhakhoa2000.com/gioi-thieu/ (2026-10-16).
-- Run after 20261016_doctor_degree.sql. Re-runnable: existing doctors and their rows are left untouched.
BEGIN;

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-le-tien-huy', 'Lê Tiến Huy', 'bac-si-le-tien-huy', '/images/doctors/le-tien-huy/portrait.jpg', '', 25, 'Với tay nghề vững vàng cùng nhiều chứng chỉ đào tạo chuyên môn nâng cao, bác sĩ Tiến Huy luôn hướng tới phác đồ điều trị an toàn, bảo tồn tối đa răng thật và phục hồi chức năng ăn nhai bền vững cho bệnh nhân.', 'Nha khoa tổng quát', 'Hơn 25 năm kinh nghiệm', FALSE, 'pediatric', 'Tổng quát – Nội nha – Tiểu phẫu – Phục hình', '001356/HCM-CCHN', NULL, '["Tiếng Anh", "Tiếng Việt"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-le-tien-huy/', 11, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-tien-huy', 'Nha khoa tổng quát', 0),
  ('doctor-le-tien-huy', 'Nội nha', 1),
  ('doctor-le-tien-huy', 'Tiểu phẫu răng khôn', 2),
  ('doctor-le-tien-huy', 'Phục hình', 3)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-le-tien-huy');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-tien-huy', 'Năm 2001: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Đại học Y Dược TP.HCM.', 0),
  ('doctor-le-tien-huy', 'Năm 2017: Chứng chỉ Đào tạo Cấy ghép Nha khoa – Đại học Y Dược TP.HCM.', 1),
  ('doctor-le-tien-huy', 'Năm 2025: Chứng chỉ Đào tạo liên tục “Phẫu thuật miệng cơ bản” – Trường Đại học Văn Lang & MESI.', 2),
  ('doctor-le-tien-huy', 'Chứng chỉ Đào tạo liên tục Nội nha – Trường Đại học Y Dược TP.HCM.', 3),
  ('doctor-le-tien-huy', 'Chứng nhận “Advanced Dental Implant Course”.', 4)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-le-tien-huy');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-tien-huy', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 001356/HCM-CCHN', '/images/doctors/le-tien-huy/certificates/01-cchn.jpg', 0),
  ('doctor-le-tien-huy', 'Chứng chỉ đào tạo Cấy ghép Nha khoa – Khóa 14', 'Đại học Y Dược TP.HCM', '180 tiết; năm 2017', '/images/doctors/le-tien-huy/certificates/02-chung-chi.jpg', 1),
  ('doctor-le-tien-huy', 'Advanced Dental Implant Course', 'DDS Institute & University of Miami', 'Năm 2016', '/images/doctors/le-tien-huy/certificates/03-chung-chi.jpg', 2),
  ('doctor-le-tien-huy', 'Chứng chỉ đào tạo liên tục Phẫu thuật miệng cơ bản', 'Trường Đại học Văn Lang', '90 tiết; năm 2025', '/images/doctors/le-tien-huy/certificates/04-phau-thuat-mieng.jpg', 3),
  ('doctor-le-tien-huy', 'Basic Oral Surgery', 'MESI Medical', 'Năm 2025', '/images/doctors/le-tien-huy/certificates/05-chung-chi.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-le-tien-huy');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-hoang-manh-cuong', 'Hoàng Mạnh Cường', 'bac-si-hoang-manh-cuong', '/images/doctors/hoang-manh-cuong/portrait.jpg', '', 9, 'Tận tâm và nhẹ nhàng trong từng ca điều trị – lấy nền tảng khoa học vững chắc và kỹ năng tinh tế làm cốt lõi, với tinh thần học hỏi không ngừng.', 'Phục hình thẩm mỹ', 'Hơn 9 năm kinh nghiệm', FALSE, 'aesthetic', 'Phục hình thẩm mỹ – Cắn khớp học – Bảo tồn tủy', NULL, 'Tận tâm và nhẹ nhàng trong từng ca điều trị – lấy nền tảng khoa học vững chắc và kỹ năng tinh tế làm cốt lõi, với tinh thần học hỏi không ngừng.', '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-hoang-manh-cuong/', 12, 'TIẾN SĨ, BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-hoang-manh-cuong', 'Phục hình thẩm mỹ', 0),
  ('doctor-hoang-manh-cuong', 'Cắn khớp học', 1),
  ('doctor-hoang-manh-cuong', 'Điều trị bảo tồn sự sống tủy và răng nhiễm trùng', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-hoang-manh-cuong');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-hoang-manh-cuong', 'Năm 2015: Chương trình đào tạo nha khoa tại Đại học Y Nha Tokyo (TMDU) – Nhật Bản.', 0),
  ('doctor-hoang-manh-cuong', 'Năm 2017: Bác sĩ Răng Hàm Mặt tại Đại học Y Dược TP. Hồ Chí Minh.', 1),
  ('doctor-hoang-manh-cuong', 'Năm 2017 – 2020: Bác sĩ Nội trú Răng Hàm Mặt tại Đại học Y Dược TP. Hồ Chí Minh.', 2),
  ('doctor-hoang-manh-cuong', 'Năm 2020: Tốt nghiệp Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt tại Đại học Y Dược TP. Hồ Chí Minh.', 3),
  ('doctor-hoang-manh-cuong', 'Năm 2020: Tốt nghiệp Thạc sĩ Răng Hàm Mặt tại Đại học Y Dược TP. Hồ Chí Minh.', 4),
  ('doctor-hoang-manh-cuong', 'Năm 2026: Tốt nghiệp Tiến sĩ (Ph.D.) Nha khoa tại Đại học Chulalongkorn, Thái Lan.', 5)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-hoang-manh-cuong');
INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-hoang-manh-cuong', 'Năm 2026: Giải Nhất cuộc thi báo cáo khoa học – Hội Răng Hàm Mặt Thái Lan.', 0),
  ('doctor-hoang-manh-cuong', 'Năm 2017, 2018: Giải Nhất báo cáo poster – Hội nghị Khoa học kỹ thuật, Đại học Y Dược TP. Hồ Chí Minh.', 1)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_experience_highlights WHERE doctor_id = 'doctor-hoang-manh-cuong');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-hoang-manh-cuong', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', '', '/images/doctors/hoang-manh-cuong/certificates/01-cchn.jpg', 0),
  ('doctor-hoang-manh-cuong', 'Bằng Bác sĩ Nội trú bệnh viện – Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2017 – 2020', '/images/doctors/hoang-manh-cuong/certificates/02-noi-tru.jpg', 1),
  ('doctor-hoang-manh-cuong', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2017 – 2020', '/images/doctors/hoang-manh-cuong/certificates/03-cki.jpg', 2),
  ('doctor-hoang-manh-cuong', 'Bằng Tiến sĩ (Doctor of Philosophy)', 'Chulalongkorn University, Thái Lan', 'Năm 2026', '/images/doctors/hoang-manh-cuong/certificates/04-ths.jpg', 3)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-hoang-manh-cuong');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-tran-yen-xuan', 'Nguyễn Trần Yến Xuân', 'bac-si-nguyen-tran-yen-xuan', '/images/doctors/nguyen-tran-yen-xuan/portrait.jpg', '', 0, 'Với niềm đam mê và sự tận tâm trong từng ca điều trị, Bác sĩ Xuân luôn hướng đến một nụ cười khỏe đẹp và bền vững. Bác sĩ Xuân theo đuổi triết lý Nha khoa xâm lấn tối thiểu và Nha khoa dựa trên bằng chứng, ưu tiên chẩn đoán sớm, điều trị bảo tồn và cá nhân hóa, mang lại trải nghiệm nhẹ nhàng, thoải mái cho bệnh nhân.', 'Phục hình thẩm mỹ', 'Tổng quát – Nha chu – Phục hình thẩm mỹ', FALSE, 'aesthetic', 'Tổng quát – Nha chu – Phục hình thẩm mỹ', '053478/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-nguyen-tran-yen-xuan/', 13, 'THẠC SĨ, BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-tran-yen-xuan', 'Nha khoa tổng quát', 0),
  ('doctor-nguyen-tran-yen-xuan', 'Nha chu', 1),
  ('doctor-nguyen-tran-yen-xuan', 'Phục hình thẩm mỹ', 2),
  ('doctor-nguyen-tran-yen-xuan', 'Phục hình mất răng', 3),
  ('doctor-nguyen-tran-yen-xuan', 'Cắn khớp', 4)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-tran-yen-xuan');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-tran-yen-xuan', 'Bác sĩ Răng Hàm Mặt: Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-nguyen-tran-yen-xuan', 'Thạc sĩ Răng Hàm Mặt: Trường Đại học Y Dược TP.HCM (2023).', 1),
  ('doctor-nguyen-tran-yen-xuan', 'Năm 2016: Chương trình đào tạo Nha khoa tại Khoa Nha – Đại học Y Nha Tokyo (Tokyo Medical and Dental University – TMDU).', 2),
  ('doctor-nguyen-tran-yen-xuan', 'Năm 2020: Chứng chỉ Đào tạo liên tục “Phẫu thuật Nha chu” – Đại học Y Dược TP.HCM.', 3),
  ('doctor-nguyen-tran-yen-xuan', 'Năm 2024: Chứng chỉ Đào tạo kỹ thuật chuyên môn “Cấy ghép Nha khoa” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 4),
  ('doctor-nguyen-tran-yen-xuan', 'Năm 2026: Chương trình đào tạo tại Khoa Khoa học Sức khỏe Nha khoa – Đại học Meikai (Meikai University).', 5),
  ('doctor-nguyen-tran-yen-xuan', 'Chứng chỉ Kỹ thuật chuyên môn Cấp cứu cơ bản và Cấp cứu nha khoa – Đại học Y Dược TP.HCM.', 6),
  ('doctor-nguyen-tran-yen-xuan', 'Các chứng chỉ, chứng nhận đào tạo về Nha khoa thẩm mỹ, Mặt dán sứ, Implant và Phục hình trên implant.', 7)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-tran-yen-xuan');
INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-tran-yen-xuan', 'Giải thưởng các cuộc thi tại Hội nghị Khoa học Kỹ thuật Đại học Y Dược TP.HCM và Hội Răng Hàm Mặt Việt Nam (VOSA).', 0)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_experience_highlights WHERE doctor_id = 'doctor-nguyen-tran-yen-xuan');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-tran-yen-xuan', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 053478/HCM-CCHN', '/images/doctors/nguyen-tran-yen-xuan/certificates/01-cchn.jpg', 0),
  ('doctor-nguyen-tran-yen-xuan', 'Bằng Thạc sĩ Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Năm 2023', '/images/doctors/nguyen-tran-yen-xuan/certificates/02-thac-si.jpg', 1),
  ('doctor-nguyen-tran-yen-xuan', 'Chứng chỉ đào tạo liên tục Phẫu thuật Nha chu', 'Đại học Y Dược TP.HCM', '180 tiết; năm 2020', '/images/doctors/nguyen-tran-yen-xuan/certificates/03-nha-chu.jpg', 2),
  ('doctor-nguyen-tran-yen-xuan', 'Chứng chỉ đào tạo kỹ thuật chuyên môn Cấy ghép Nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '72 tiết; năm 2024', '/images/doctors/nguyen-tran-yen-xuan/certificates/04-chung-chi.jpg', 3),
  ('doctor-nguyen-tran-yen-xuan', 'Giấy chứng nhận “Kiềng ba chân trong thực hành Implant thẩm mỹ”', 'Hội Y học TP.HCM & Hội Cấy ghép Nha khoa TP.HCM', '', '/images/doctors/nguyen-tran-yen-xuan/certificates/05-chung-chi.jpg', 4),
  ('doctor-nguyen-tran-yen-xuan', 'TMDU Dental Training Program 2016', 'Tokyo Medical and Dental University', 'Năm 2016', '/images/doctors/nguyen-tran-yen-xuan/certificates/06-toykyo.jpg', 5),
  ('doctor-nguyen-tran-yen-xuan', 'Chứng nhận học tập tại School of Health Sciences', 'Meikai University, Nhật Bản', 'Tháng 3/2026', '/images/doctors/nguyen-tran-yen-xuan/certificates/07-tokyo.jpg', 6),
  ('doctor-nguyen-tran-yen-xuan', 'Giấy chứng nhận đào tạo liên tục “Thẩm mỹ khuôn mặt dưới góc nhìn đa diện”', 'Đại học Y Dược TP.HCM', '8 tiết', '/images/doctors/nguyen-tran-yen-xuan/certificates/08-chung-chi.jpg', 7)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-tran-yen-xuan');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-tran-thi-hien-nhi', 'Trần Thị Hiền Nhi', 'bac-si-tran-thi-hien-nhi', '/images/doctors/tran-thi-hien-nhi/portrait.jpg', '', 19, 'Đồng hành cùng triết lý “Nha khoa là một nghệ thuật, vẻ đẹp thực sự bắt đầu từ sự hài hòa và chuẩn xác”, BS.CKI Trần Thị Hiền Nhi luôn đặt sức khỏe răng miệng toàn diện cùng nụ cười tự nhiên của bệnh nhân lên hàng đầu.', 'Chỉnh nha', 'Hơn 19 năm kinh nghiệm', FALSE, 'ortho', 'Chỉnh hình răng mặt', '008484/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-duong-thi-le-khanh/', 14, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-tran-thi-hien-nhi', 'Chỉnh hình răng mặt', 0),
  ('doctor-tran-thi-hien-nhi', 'Niềng răng khay trong suốt', 1),
  ('doctor-tran-thi-hien-nhi', 'Chỉnh nha can thiệp tăng trưởng cho trẻ em', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-tran-thi-hien-nhi');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-tran-thi-hien-nhi', 'Năm 2007: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-tran-thi-hien-nhi', 'Năm 2022: Tốt nghiệp Bác sĩ Chuyên khoa I – Trường Đại học Y – Dược Huế.', 1),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ “Chỉnh hình Răng Mặt” – Đại học Y Dược TP.HCM.', 2),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ Đào tạo “Chỉnh hình Răng Mặt” kết hợp với HVO và IFDE – Đại học Y Dược TP.HCM.', 3),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ “Chỉnh hình Răng Mặt với khay chỉnh nha trong suốt – Từ chẩn đoán, thiết kế đến sản xuất” – Đại học Y Dược TP.HCM.', 4),
  ('doctor-tran-thi-hien-nhi', 'Chứng nhận “Điều trị chỉnh nha cho bệnh nhân đang tăng trưởng” – Hội Y học TP.HCM & Liên chi hội CHRM TP.HCM.', 5),
  ('doctor-tran-thi-hien-nhi', 'Chứng nhận “Hoàn tất ca chỉnh nha: Khi sự chính xác đạt mục tiêu” – Hội Y học TP.HCM & Hội CHRM TP.HCM.', 6)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-tran-thi-hien-nhi');
INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-tran-thi-hien-nhi', 'Chỉnh nha chuẩn y khoa và bền vững: kết hợp tư duy thẩm mỹ khuôn mặt với kỹ thuật chỉnh hình răng mặt chính xác.', 0),
  ('doctor-tran-thi-hien-nhi', 'Ứng dụng công nghệ số hóa trong chỉnh nha và niềng răng khay trong suốt.', 1),
  ('doctor-tran-thi-hien-nhi', 'Tỉ mỉ trong từng ca, đặc biệt là chỉnh nha can thiệp tăng trưởng cho trẻ em.', 2)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_experience_highlights WHERE doctor_id = 'doctor-tran-thi-hien-nhi');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 008484/HCM-CCHN', '/images/doctors/tran-thi-hien-nhi/certificates/01-cchn.jpg', 0),
  ('doctor-tran-thi-hien-nhi', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Trường Đại học Y – Dược, Đại học Huế', 'Khóa 2019 – 2021', '/images/doctors/tran-thi-hien-nhi/certificates/02-cki.jpg', 1),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ đào tạo Chỉnh hình Răng Mặt (kết hợp HVO và IFDE)', 'Đại học Y Dược TP.HCM', '540 tiết; năm 2019', '/images/doctors/tran-thi-hien-nhi/certificates/03-chung-chi.jpg', 2),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ Chỉnh hình Răng Mặt', 'Đại học Y Dược TP.HCM', '480 giờ; năm 2013', '/images/doctors/tran-thi-hien-nhi/certificates/04-chinh-hinh.jpg', 3),
  ('doctor-tran-thi-hien-nhi', 'Chứng chỉ đào tạo Chỉnh hình răng mặt với khay chỉnh nha trong suốt – Từ chẩn đoán, thiết kế đến sản xuất', 'Đại học Y Dược TP.HCM', '100 tiết; năm 2024', '/images/doctors/tran-thi-hien-nhi/certificates/05-khay-trong-suot.jpg', 4),
  ('doctor-tran-thi-hien-nhi', 'Giấy chứng nhận chuyên đề “Số hóa trong chỉnh hình răng mặt”', 'Khoa Răng Hàm Mặt – Đại học Y Dược TP.HCM', 'Năm 2019', '/images/doctors/tran-thi-hien-nhi/certificates/06-so-hoa-chinh-hinh.jpg', 5),
  ('doctor-tran-thi-hien-nhi', 'Giấy chứng nhận “Chấn thương răng – Khóa 1”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2025', '/images/doctors/tran-thi-hien-nhi/certificates/07-chung-chi.jpg', 6),
  ('doctor-tran-thi-hien-nhi', 'Giấy chứng nhận “Điều trị chỉnh nha cho bệnh nhân đang tăng trưởng – Phần 2”', 'Hội Y học TP.HCM & Liên chi hội Chỉnh hình Răng Mặt TP.HCM', 'Năm 2024', '/images/doctors/tran-thi-hien-nhi/certificates/08-chung-chi.jpg', 7),
  ('doctor-tran-thi-hien-nhi', 'Giấy chứng nhận “Hoàn tất ca chỉnh nha: Khi sự chính xác đạt mục tiêu”', 'Hội Y học TP.HCM & Hội Chỉnh hình Răng Mặt TP.HCM', 'Năm 2025', '/images/doctors/tran-thi-hien-nhi/certificates/09-chung-chi.jpg', 8)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-tran-thi-hien-nhi');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-phan-thi-tuyet-linh', 'Phan Thị Tuyết Linh', 'b-s-phan-thi-tuyet-linh', '/images/doctors/phan-thi-tuyet-linh/portrait.jpg', '', 19, 'Gần 20 năm kinh nghiệm trong lĩnh vực nha khoa Răng Hàm Mặt, bác sĩ Tuyết Linh là đại diện cho lực lượng y bác sĩ tiêu biểu của Nha Khoa 2000 bởi sự nhiệt tình, năng nổ, tinh thần học hỏi cầu tiến không ngừng nghỉ.', 'Nha khoa tổng quát', 'Gần 20 năm kinh nghiệm', FALSE, 'pediatric', 'Nha khoa Răng Hàm Mặt', '000536/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/b-s-phan-thi-tuyet-linh/', 15, 'BÁC SĨ CKII')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-phan-thi-tuyet-linh', 'Nha khoa Răng Hàm Mặt', 0)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-phan-thi-tuyet-linh');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-phan-thi-tuyet-linh', 'Bác sĩ Răng Hàm Mặt – Đại học Y Dược TP. Hồ Chí Minh.', 0),
  ('doctor-phan-thi-tuyet-linh', 'Bác sĩ Chuyên khoa I chuyên ngành Răng Hàm Mặt.', 1)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-phan-thi-tuyet-linh');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-phan-thi-tuyet-linh', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 000536/HCM-CCHN', '/images/doctors/phan-thi-tuyet-linh/certificates/01-cchn.jpg', 0),
  ('doctor-phan-thi-tuyet-linh', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Trường Đại học Y Dược Cần Thơ', 'Khóa 2021 – 2023', '/images/doctors/phan-thi-tuyet-linh/certificates/02-cki.jpg', 1)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-phan-thi-tuyet-linh');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-dinh-nhat-dinh', 'Đinh Nhật Dinh', 'bac-si-dinh-nhat-dinh', '/images/doctors/dinh-nhat-dinh/portrait.jpg', '', 9, 'Đặt sự chân thành, trung thực và minh bạch lên hàng đầu, bác sĩ Nhật Dinh luôn dành trọn tâm trí để giúp bệnh nhân hiểu rõ tình trạng sức khỏe răng miệng của mình. Bác sĩ kiên trì theo đuổi trường phái nha khoa bảo tồn: tối ưu giữ lại mô răng tự nhiên, đưa ra giải pháp can thiệp hợp lý và mang lại sự an tâm trong suốt hành trình điều trị.', 'Nha khoa tổng quát', 'Hơn 9 năm kinh nghiệm', FALSE, 'pediatric', 'Nha khoa tổng quát', '007075/KH-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-dinh-nhat-dinh/', 16, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-dinh-nhat-dinh', 'Nha khoa tổng quát', 0)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-dinh-nhat-dinh');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-dinh-nhat-dinh', 'Năm 2017: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược Huế.', 0),
  ('doctor-dinh-nhat-dinh', 'Năm 2019: Chứng chỉ “Chỉnh hình Răng Mặt” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 1)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-dinh-nhat-dinh');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-dinh-nhat-dinh', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế Khánh Hòa', 'Số 007075/KH-CCHN', '/images/doctors/dinh-nhat-dinh/certificates/01-cchn.jpg', 0),
  ('doctor-dinh-nhat-dinh', 'Chứng chỉ đào tạo liên tục Chỉnh hình Răng Mặt', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '128 tiết; năm 2018', '/images/doctors/dinh-nhat-dinh/certificates/02-chinh-hinh.jpg', 1)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-dinh-nhat-dinh');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-thuy-bao-ngan', 'Nguyễn Thuỳ Bảo Ngân', 'bac-si-nguyen-thuy-bao-ngan', '/images/doctors/nguyen-thuy-bao-ngan/portrait.jpg', '', 2, 'Với định hướng phát triển chuyên môn vững chắc, Bác sĩ Bảo Ngân theo đuổi triết lý điều trị nhẹ nhàng, lấy sự thoải mái của bệnh nhân làm trung tâm.', 'Nha khoa tổng quát', 'Tổng quát – Nội nha – Nhổ răng', FALSE, 'pediatric', 'Tổng quát – Nội nha – Nhổ răng', '012565/HCM-GPHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-nguyen-thuy-bao-ngan/', 17, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thuy-bao-ngan', 'Nha khoa tổng quát', 0),
  ('doctor-nguyen-thuy-bao-ngan', 'Nội nha', 1),
  ('doctor-nguyen-thuy-bao-ngan', 'Nhổ răng', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-thuy-bao-ngan');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thuy-bao-ngan', 'Năm 2024: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y – Dược, Đại học Huế.', 0)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-thuy-bao-ngan');
INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thuy-bao-ngan', 'Tận tâm và ân cần: lắng nghe mong muốn của bệnh nhân, thăm khám kỹ càng và tư vấn phương án phù hợp nhất.', 0),
  ('doctor-nguyen-thuy-bao-ngan', 'Can thiệp tối thiểu, bảo tồn răng thật.', 1),
  ('doctor-nguyen-thuy-bao-ngan', 'Thao tác tỉ mỉ, giảm thiểu tối đa sự khó chịu cho khách hàng ở mọi lứa tuổi.', 2)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_experience_highlights WHERE doctor_id = 'doctor-nguyen-thuy-bao-ngan');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thuy-bao-ngan', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 012565/HCM-GPHN', '/images/doctors/nguyen-thuy-bao-ngan/certificates/01-cchn.jpg', 0)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-thuy-bao-ngan');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-kieu-thi-thu-hoai', 'Kiều Thị Thu Hoài', 'bac-si-kieu-thi-thu-hoai', '/images/doctors/kieu-thi-thu-hoai/portrait.jpg', '', 2, 'Là thế hệ bác sĩ trẻ đại diện cho sự năng động và nhiệt huyết tại Nha Khoa 2000, BS Thu Hoài tốt nghiệp Bác sĩ Răng Hàm Mặt năm 2024. Với phương châm nhẹ nhàng và chu đáo, bác sĩ luôn nỗ lực mang lại cảm giác an tâm, thoải mái nhất cho bệnh nhân trong từng dịch vụ chăm sóc và điều trị nha khoa tổng quát.', 'Nha khoa tổng quát', 'Nha khoa tổng quát', FALSE, 'pediatric', 'Nha khoa tổng quát', '009674/HCM-GPHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-kieu-thi-thu-hoai/', 18, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-kieu-thi-thu-hoai', 'Nha khoa tổng quát', 0)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-kieu-thi-thu-hoai');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-kieu-thi-thu-hoai', 'Năm 2024: Tốt nghiệp Bác sĩ Răng Hàm Mặt chính quy.', 0)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-kieu-thi-thu-hoai');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-kieu-thi-thu-hoai', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 009674/HCM-GPHN', '/images/doctors/kieu-thi-thu-hoai/certificates/01-cchn.jpg', 0)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-kieu-thi-thu-hoai');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-duy-dang', 'Nguyễn Duy Đăng', 'bac-si-nguyen-duy-dang', '/images/doctors/nguyen-duy-dang/portrait.jpg', '', 26, 'Luôn đặt sức khỏe răng miệng toàn diện lên hàng đầu; kết hợp kỹ thuật điều trị chuẩn xác với tư duy thẩm mỹ tự nhiên, tỉ mỉ kiến tạo nụ cười hài hòa và bền đẹp theo thời gian.', 'Nha khoa tổng quát', 'Hơn 26 năm kinh nghiệm', FALSE, 'pediatric', 'Nội nha – Tổng quát – Phục hình', '001527/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-dang-thi-to-oanh/', 19, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-duy-dang', 'Nội nha', 0),
  ('doctor-nguyen-duy-dang', 'Nha khoa tổng quát', 1),
  ('doctor-nguyen-duy-dang', 'Phục hình', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-duy-dang');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-duy-dang', 'Năm 2000: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-nguyen-duy-dang', 'Năm 2012: Chứng chỉ “Cấy ghép Nha khoa” – Trường Đại học Y Dược TP.HCM.', 1),
  ('doctor-nguyen-duy-dang', 'Năm 2018: Giấy chứng nhận đào tạo liên tục “Từ khoa học nha khoa đến chăm sóc răng miệng tối ưu” – Trường Đại học Y Dược TP.HCM.', 2),
  ('doctor-nguyen-duy-dang', 'Năm 2022: Tốt nghiệp Bác sĩ Chuyên khoa I Răng Hàm Mặt – Trường Đại học Y Dược Cần Thơ.', 3)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-duy-dang');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-duy-dang', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 001527/HCM-CCHN', '/images/doctors/nguyen-duy-dang/certificates/01-cchn.jpg', 0),
  ('doctor-nguyen-duy-dang', 'Chứng chỉ Cấy ghép Nha khoa – Khóa 3', 'Đại học Y Dược TP.HCM', 'Năm 2012', '/images/doctors/nguyen-duy-dang/certificates/02-cay-ghep.jpg', 1),
  ('doctor-nguyen-duy-dang', 'Giấy chứng nhận đào tạo liên tục “Từ khoa học nha khoa đến chăm sóc răng miệng tối ưu”', 'Đại học Y Dược TP.HCM', '12 tiết; năm 2018', '/images/doctors/nguyen-duy-dang/certificates/03-chung-chi.jpg', 2),
  ('doctor-nguyen-duy-dang', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Trường Đại học Y Dược Cần Thơ', 'Khóa 2020 – 2022', '/images/doctors/nguyen-duy-dang/certificates/04-cki.jpg', 3)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-duy-dang');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-huynh-bao-anh-nguyen', 'Huỳnh Bảo Anh Nguyên', 'bac-si-huynh-bao-anh-nguyen', '/images/doctors/huynh-bao-anh-nguyen/portrait.jpg', '', 5, 'BS. Anh Nguyên là bác sĩ trẻ đầy năng nổ, không ngừng nâng cao tay nghề thực hành lâm sàng thông qua các chương trình đào tạo chuyên sâu; bác sĩ chú trọng xây dựng quy trình điều trị an toàn, chuẩn xác và chuẩn Y khoa.', 'Tiểu phẫu răng khôn', 'Hơn 5 năm kinh nghiệm', FALSE, 'surgery', 'Tổng quát – Tiểu phẫu răng khôn', '000080/ĐL-GPHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-huynh-bao-anh-nguyen/', 20, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-huynh-bao-anh-nguyen', 'Nha khoa tổng quát', 0),
  ('doctor-huynh-bao-anh-nguyen', 'Tiểu phẫu răng khôn', 1)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-huynh-bao-anh-nguyen');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-huynh-bao-anh-nguyen', 'Năm 2021: Tốt nghiệp Bác sĩ Răng Hàm Mặt.', 0),
  ('doctor-huynh-bao-anh-nguyen', 'Năm 2024: Chứng chỉ “Phẫu thuật miệng” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 1),
  ('doctor-huynh-bao-anh-nguyen', 'Năm 2025: Chứng chỉ “Cấy ghép Nha khoa” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 2),
  ('doctor-huynh-bao-anh-nguyen', 'Năm 2025: Giấy chứng nhận “Kiềng ba chân trong thực hành Implant thẩm mỹ” – Hiệp hội Cấy ghép Nha khoa TP.HCM.', 3)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-huynh-bao-anh-nguyen');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-huynh-bao-anh-nguyen', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế Đắk Lắk', 'Số 000080/ĐL-GPHN', '/images/doctors/huynh-bao-anh-nguyen/certificates/01-cchn.jpg', 0),
  ('doctor-huynh-bao-anh-nguyen', 'Giấy chứng nhận đào tạo Phẫu thuật miệng', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '268 tiết; năm 2024', '/images/doctors/huynh-bao-anh-nguyen/certificates/02-chung-chi.jpg', 1),
  ('doctor-huynh-bao-anh-nguyen', 'Chứng chỉ đào tạo kỹ thuật chuyên môn Cấy ghép Nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '72 tiết; năm 2025', '/images/doctors/huynh-bao-anh-nguyen/certificates/03-chung-chi.jpg', 2),
  ('doctor-huynh-bao-anh-nguyen', 'Giấy chứng nhận “Kiềng ba chân trong thực hành Implant thẩm mỹ”', 'Hội Y học TP.HCM & Hội Cấy ghép Nha khoa TP.HCM', 'Năm 2024', '/images/doctors/huynh-bao-anh-nguyen/certificates/04-kieng-3-chan.jpg', 3)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-huynh-bao-anh-nguyen');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-vo-minh-toan', 'Võ Minh Toàn', 'bac-si-vo-minh-toan', '/images/doctors/vo-minh-toan/portrait.jpg', '', 13, 'Bác sĩ Võ Minh Toàn luôn đặt sự an tâm và sức khỏe lâu dài của bệnh nhân lên hàng đầu: lắng nghe, thấu hiểu tâm lý và tư vấn minh bạch phác đồ cá nhân hóa; thao tác nhẹ nhàng, thân thiện giúp các bé giải tỏa tâm lý sợ hãi và hợp tác tốt trong suốt quá trình chăm sóc răng miệng.', 'Nha khoa trẻ em', 'Hơn 13 năm kinh nghiệm', FALSE, 'pediatric', 'Nha khoa tổng quát – Nha khoa trẻ em', '038224/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-vo-minh-toan/', 21, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-vo-minh-toan', 'Nha khoa tổng quát', 0),
  ('doctor-vo-minh-toan', 'Nha khoa trẻ em', 1)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-vo-minh-toan');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-vo-minh-toan', 'Năm 2013: Tốt nghiệp Bác sĩ Răng Hàm Mặt.', 0),
  ('doctor-vo-minh-toan', 'Năm 2020: Chứng chỉ “Cấy ghép Nha khoa” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 1),
  ('doctor-vo-minh-toan', 'Năm 2023: Chứng chỉ “Phục hình thẩm mỹ mặt dán sứ” – Trường Đại học Y Dược TP.HCM.', 2),
  ('doctor-vo-minh-toan', 'Năm 2023: Chứng chỉ “Phương pháp tiếp cận toàn diện lấy bệnh nhân làm trung tâm” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 3),
  ('doctor-vo-minh-toan', 'Năm 2024: Giấy chứng nhận “Cá nhân hóa kế hoạch điều trị trong nha khoa” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 4)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-vo-minh-toan');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-vo-minh-toan', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 038224/HCM-CCHN', '/images/doctors/vo-minh-toan/certificates/01-cchn.jpg', 0),
  ('doctor-vo-minh-toan', 'Chứng chỉ đào tạo liên tục Cấy ghép Nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '104 tiết; năm 2020', '/images/doctors/vo-minh-toan/certificates/02-cay-ghep.jpg', 1),
  ('doctor-vo-minh-toan', 'Giấy chứng nhận đào tạo liên tục “Phương pháp tiếp cận toàn diện lấy bệnh nhân làm trung tâm”', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', 'Năm 2023', '/images/doctors/vo-minh-toan/certificates/03-tiep-can-toan-dien.jpg', 2),
  ('doctor-vo-minh-toan', 'Giấy chứng nhận đào tạo liên tục Phục hình thẩm mỹ mặt dán sứ', 'Đại học Y Dược TP.HCM', '16 tiết; năm 2023', '/images/doctors/vo-minh-toan/certificates/04-mat-dan-su.jpg', 3),
  ('doctor-vo-minh-toan', 'Giấy chứng nhận “Cá nhân hóa kế hoạch điều trị trong nha khoa”', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', 'Năm 2024', '/images/doctors/vo-minh-toan/certificates/05-ca-nhan-hoa.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-vo-minh-toan');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-thi-xuan-huyen', 'Nguyễn Thị Xuân Huyền', 'bac-si-nguyen-thi-xuan-huyen', '/images/doctors/nguyen-thi-xuan-huyen/portrait.jpg', '', 19, 'Tỉ mỉ, kỹ lưỡng trong từng công đoạn điều trị cùng phong cách tư vấn tận tâm, BS.CKI Xuân Huyền luôn mong muốn mang lại vẻ đẹp tự nhiên và chức năng ăn nhai bền vững cho khách hàng.', 'Phục hình thẩm mỹ', 'Hơn 19 năm kinh nghiệm', FALSE, 'aesthetic', 'Phục hình Implant – Phục hình thẩm mỹ – Tổng quát', NULL, NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-nguyen-thi-xuan-huyen/', 22, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-xuan-huyen', 'Phục hình Implant', 0),
  ('doctor-nguyen-thi-xuan-huyen', 'Phục hình thẩm mỹ', 1),
  ('doctor-nguyen-thi-xuan-huyen', 'Nha khoa tổng quát', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-thi-xuan-huyen');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-xuan-huyen', 'Năm 2007: Tốt nghiệp Đại học ngành Răng Hàm Mặt – Đại học Y Dược TP.HCM.', 0),
  ('doctor-nguyen-thi-xuan-huyen', 'Năm 2016: Chứng chỉ “Phẫu thuật Nha chu” – Đại học Y Dược TP.HCM.', 1),
  ('doctor-nguyen-thi-xuan-huyen', 'Năm 2020: Bác sĩ Chuyên khoa I Răng Hàm Mặt.', 2),
  ('doctor-nguyen-thi-xuan-huyen', 'Năm 2022: Chứng chỉ Đào tạo liên tục “Cấy ghép Nha khoa” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 3),
  ('doctor-nguyen-thi-xuan-huyen', 'Năm 2023: Chứng chỉ “Chỉnh hình Răng mặt Cơ bản” – Đại học Y Dược TP.HCM.', 4)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-thi-xuan-huyen');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-xuan-huyen', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', '', '', '/images/doctors/nguyen-thi-xuan-huyen/certificates/01-cchn.jpg', 0),
  ('doctor-nguyen-thi-xuan-huyen', 'Chứng chỉ đào tạo Phẫu thuật Nha chu – Khóa 3', 'Đại học Y Dược TP.HCM', '115 tiết; năm 2016', '/images/doctors/nguyen-thi-xuan-huyen/certificates/02-chung-chi.jpg', 1),
  ('doctor-nguyen-thi-xuan-huyen', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Trường Đại học Y – Dược, Đại học Huế', 'Khóa 2018 – 2020', '/images/doctors/nguyen-thi-xuan-huyen/certificates/03-chung-chi.jpg', 2),
  ('doctor-nguyen-thi-xuan-huyen', 'Chứng chỉ đào tạo liên tục Cấy ghép Nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '104 tiết; năm 2022', '/images/doctors/nguyen-thi-xuan-huyen/certificates/04-chung-chi.jpg', 3),
  ('doctor-nguyen-thi-xuan-huyen', 'Chứng chỉ đào tạo liên tục Chỉnh hình Răng Mặt cơ bản', 'Đại học Y Dược TP.HCM', '241 tiết; năm 2023', '/images/doctors/nguyen-thi-xuan-huyen/certificates/05-chung-chi.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-thi-xuan-huyen');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-do-duy-tan', 'Đỗ Duy Tân', 'b-s-do-duy-tan', '/images/doctors/do-duy-tan/portrait.jpg', '', 12, 'Với phương châm làm việc cẩn trọng và lấy bệnh nhân làm trung tâm.', 'Nha khoa tổng quát', 'Hơn 12 năm kinh nghiệm', FALSE, 'pediatric', 'Tổng quát – Nội nha – Phục hình', '045220/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/b-s-do-duy-tan/', 23, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-do-duy-tan', 'Nha khoa tổng quát', 0),
  ('doctor-do-duy-tan', 'Nội nha', 1),
  ('doctor-do-duy-tan', 'Phục hình', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-do-duy-tan');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-do-duy-tan', 'Năm 2014: Tốt nghiệp Bác sĩ Răng Hàm Mặt tại Đại học Y Dược TP.HCM.', 0),
  ('doctor-do-duy-tan', 'Năm 2017: Tốt nghiệp Bác sĩ Chuyên khoa I tại Đại học Y Dược TP.HCM.', 1),
  ('doctor-do-duy-tan', 'Năm 2018: Chứng chỉ Chỉnh nha tại Bệnh viện Trung ương Huế.', 2)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-do-duy-tan');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-do-duy-tan', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 045220/HCM-CCHN', '/images/doctors/do-duy-tan/certificates/01-cchn.jpg', 0),
  ('doctor-do-duy-tan', 'Chứng chỉ đào tạo liên tục Cấy ghép Nha khoa', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '104 tiết; năm 2017', '/images/doctors/do-duy-tan/certificates/02-cay-gep.jpg', 1),
  ('doctor-do-duy-tan', 'Chứng chỉ đào tạo liên tục Chỉnh nha nâng cao', 'Bệnh viện Trung ương Huế', '124 tiết; năm 2017', '/images/doctors/do-duy-tan/certificates/03-chinh-nha.jpg', 2),
  ('doctor-do-duy-tan', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2016 – 2018', '/images/doctors/do-duy-tan/certificates/04-ck-bs.jpg', 3)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-do-duy-tan');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-bui-thi-hong-nhi', 'Bùi Thị Hồng Nhi', 'b-s-bui-thi-hong-nhi', '/images/doctors/bui-thi-hong-nhi/portrait.jpg', '', 12, 'Với quan điểm làm nghề xuất phát từ sự tận tâm, Bác sĩ Hồng Nhi luôn cẩn trọng trong từng chẩn đoán và cân nhắc kỹ lưỡng mọi phương án trước khi tiến hành điều trị: đặt lợi ích bệnh nhân làm trọng tâm; thẩm mỹ tự nhiên và bền vững; điều trị nhẹ nhàng, chu đáo.', 'Phục hình thẩm mỹ', 'Hơn 12 năm kinh nghiệm', FALSE, 'aesthetic', 'Tổng quát – Phục hình thẩm mỹ – Nội nha', '042056/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/b-s-bui-thi-hong-nhi/', 24, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-bui-thi-hong-nhi', 'Nha khoa tổng quát', 0),
  ('doctor-bui-thi-hong-nhi', 'Phục hình thẩm mỹ', 1),
  ('doctor-bui-thi-hong-nhi', 'Nội nha', 2)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-bui-thi-hong-nhi');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-bui-thi-hong-nhi', 'Năm 2014: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-bui-thi-hong-nhi', 'Năm 2020: Chứng chỉ “Mặt dán sứ nha khoa: Từ tiến bộ công nghệ đến thực hành nha khoa đương đại” – Hội Răng Hàm Mặt TP.HCM.', 1),
  ('doctor-bui-thi-hong-nhi', 'Năm 2021: Chứng chỉ “Phục hình thẩm mỹ mặt dán sứ” – Đại học Y Dược TP.HCM.', 2),
  ('doctor-bui-thi-hong-nhi', 'Năm 2023: Tốt nghiệp Bác sĩ Chuyên khoa I (CKI) – Trường Đại học Y Dược, Đại học Huế.', 3),
  ('doctor-bui-thi-hong-nhi', 'Năm 2024: Giấy chứng nhận cập nhật kiến thức nha khoa liên tục “Thảo luận về định hướng tương lai của nội nha với những đổi mới sinh học” – Bệnh viện Răng Hàm Mặt TP.HCM.', 4)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-bui-thi-hong-nhi');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-bui-thi-hong-nhi', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 042056/HCM-CCHN', '/images/doctors/bui-thi-hong-nhi/certificates/01-cchn.jpg', 0),
  ('doctor-bui-thi-hong-nhi', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Trường Đại học Y – Dược, Đại học Huế', 'Khóa 2021 – 2023', '/images/doctors/bui-thi-hong-nhi/certificates/02-cki.jpg', 1),
  ('doctor-bui-thi-hong-nhi', 'Giấy chứng nhận đào tạo liên tục – Hội nghị khoa học chuyên ngành Răng Hàm Mặt 2020 (Mặt dán sứ nha khoa)', 'Hội Y học TP.HCM', 'Năm 2020', '/images/doctors/bui-thi-hong-nhi/certificates/03-mat-dan-su.jpg', 2),
  ('doctor-bui-thi-hong-nhi', 'Giấy chứng nhận đào tạo liên tục Phục hình thẩm mỹ mặt dán sứ', 'Đại học Y Dược TP.HCM', '16 tiết; năm 2021', '/images/doctors/bui-thi-hong-nhi/certificates/04-mat-dan-su.jpg', 3),
  ('doctor-bui-thi-hong-nhi', 'Giấy chứng nhận “Thảo luận về định hướng tương lai của nội nha với những đổi mới sinh học”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2024', '/images/doctors/bui-thi-hong-nhi/certificates/05-noi-nha.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-bui-thi-hong-nhi');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-le-thi-thai-hoa', 'Lê Thị Thái Hoà', 'bac-si-le-thi-thai-hoa', '/images/doctors/le-thi-thai-hoa/portrait.jpg', '', 7, 'Tỉ mỉ, thấu hiểu và cẩn trọng trong từng thao tác, bác sĩ luôn mang lại lộ trình chăm sóc sức khỏe răng miệng an toàn, nhẹ nhàng và hiệu quả tối ưu cho bệnh nhân.', 'Nha khoa trẻ em', 'Hơn 7 năm kinh nghiệm', FALSE, 'pediatric', 'Nha khoa tổng quát – Răng trẻ em', '054063/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/15313/', 25, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-thi-thai-hoa', 'Nha khoa tổng quát', 0),
  ('doctor-le-thi-thai-hoa', 'Răng trẻ em', 1)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-le-thi-thai-hoa');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-thi-thai-hoa', 'Năm 2019: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược Cần Thơ.', 0),
  ('doctor-le-thi-thai-hoa', 'Năm 2022: Chứng chỉ “Chỉnh hình Răng Mặt” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 1),
  ('doctor-le-thi-thai-hoa', 'Năm 2023: Chứng chỉ “Phẫu thuật Miệng” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 2),
  ('doctor-le-thi-thai-hoa', 'Năm 2023: Chứng chỉ “Cấy ghép Nha khoa” – Trường Đại học Y Dược TP.HCM.', 3)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-le-thi-thai-hoa');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-le-thi-thai-hoa', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 054063/HCM-CCHN', '/images/doctors/le-thi-thai-hoa/certificates/01-cchn.jpg', 0),
  ('doctor-le-thi-thai-hoa', 'Chứng chỉ đào tạo liên tục Phẫu thuật miệng', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', '325 tiết; năm 2023', '/images/doctors/le-thi-thai-hoa/certificates/02-phau-thuat-mieng.jpg', 1),
  ('doctor-le-thi-thai-hoa', 'Chứng chỉ đào tạo liên tục Cấy ghép Nha khoa', 'Đại học Y Dược TP.HCM', '180 tiết; năm 2023', '/images/doctors/le-thi-thai-hoa/certificates/03-cay-ghep.jpg', 2)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-le-thi-thai-hoa');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-thi-bich-thuy', 'Nguyễn Thị Bích Thuỷ', 'bs-cki-nguyen-thi-bich-thuy', '/images/doctors/nguyen-thi-bich-thuy/portrait.jpg', '', 33, 'Với kinh nghiệm nhiều năm trực tiếp khám và điều trị cho rất nhiều bệnh nhân, bác sĩ luôn mong muốn đem đến cho bệnh nhân chức năng và thẩm mỹ toàn diện của hệ thống nhai.', 'Nha khoa tổng quát', 'Hơn 33 năm kinh nghiệm', FALSE, 'pediatric', 'Nha khoa tổng quát', NULL, NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bs-cki-nguyen-thi-bich-thuy/', 26, 'BÁC SĨ CKI')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-bich-thuy', 'Nha khoa tổng quát', 0)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-thi-bich-thuy');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-bich-thuy', 'Năm 1993: Tốt nghiệp Bác sĩ Răng Hàm Mặt – Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-nguyen-thi-bich-thuy', 'Năm 2011: Tốt nghiệp Bác sĩ Chuyên khoa I – Trường Đại học Y Dược TP.HCM.', 1),
  ('doctor-nguyen-thi-bich-thuy', 'Tham gia thường xuyên các chương trình đào tạo liên tục hàng năm về Chẩn đoán, Điều trị Nha khoa Tổng quát và Cập nhật Y khoa từ các hội nghề nghiệp uy tín.', 2)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-thi-bich-thuy');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-bich-thuy', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', '', '', '/images/doctors/nguyen-thi-bich-thuy/certificates/01-cchn.jpg', 0),
  ('doctor-nguyen-thi-bich-thuy', 'Chứng chỉ đào tạo liên tục Cấy ghép Nha khoa (Khóa 9)', 'Bệnh viện Răng Hàm Mặt TP.HCM', '120 giờ; năm 2020', '/images/doctors/nguyen-thi-bich-thuy/certificates/02-cay-ghep.jpg', 1),
  ('doctor-nguyen-thi-bich-thuy', 'Bằng Bác sĩ Chuyên khoa cấp I Răng Hàm Mặt', 'Đại học Y Dược TP.HCM', 'Khóa 2009 – 2011', '/images/doctors/nguyen-thi-bich-thuy/certificates/03-cki.jpg', 2)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-thi-bich-thuy');

INSERT INTO doctors (id, name, slug, avatar, position, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url, sort_order, degree)
VALUES ('doctor-nguyen-thi-hoai-nguyen', 'Nguyễn Thị Hoài Nguyên', 'bac-si-nguyen-thi-hoai-nguyen', '/images/doctors/nguyen-thi-hoai-nguyen/portrait.jpg', '', 0, 'Với thông điệp hành nghề “Tận tâm trong từng điều trị – Trân trọng từng nụ cười”, Bác sĩ Hoài Nguyên chinh phục sự tin tưởng của khách hàng bằng sự ân cần, lắng nghe và chăm sóc chu đáo như người thân. Thao tác nhẹ nhàng, giải thích cặn kẽ cùng sự tỉ mỉ trong từng chi tiết giúp bác sĩ mang lại cho bệnh nhân trải nghiệm điều trị an toàn, êm ái và hiệu quả bền vững lâu dài.', 'Nha khoa tổng quát', 'Nha khoa tổng quát', FALSE, 'pediatric', 'Nha khoa tổng quát', '002768/HCM-CCHN', NULL, '["Tiếng Việt", "Tiếng Anh"]'::jsonb, 'https://nhakhoa2000.com/bac-si/bac-si-nguyen-thi-hoai-nguyen/', 27, 'BÁC SĨ')
ON CONFLICT (id) DO NOTHING;
INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-hoai-nguyen', 'Nha khoa tổng quát', 0)
) AS v(doctor_id, specialty, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_specialties WHERE doctor_id = 'doctor-nguyen-thi-hoai-nguyen');
INSERT INTO doctor_education (doctor_id, content, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-hoai-nguyen', 'Bác sĩ Răng Hàm Mặt: Tốt nghiệp chính quy – Trường Đại học Y Dược TP.HCM.', 0),
  ('doctor-nguyen-thi-hoai-nguyen', 'Chứng nhận “Thực hành Răng Hàm Mặt trong kỷ nguyên số” – Trường Đại học Y Dược TP.HCM.', 1),
  ('doctor-nguyen-thi-hoai-nguyen', 'Chứng nhận Hội thảo “Hoàn thiện phục hồi bằng vật liệu Composite” – Bệnh viện Răng Hàm Mặt TP.HCM.', 2),
  ('doctor-nguyen-thi-hoai-nguyen', 'Chứng nhận “Ứng dụng vật liệu sinh học trong bảo tồn tủy sống” – Bệnh viện Răng Hàm Mặt Trung ương TP.HCM.', 3)
) AS v(doctor_id, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_education WHERE doctor_id = 'doctor-nguyen-thi-hoai-nguyen');
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-nguyen-thi-hoai-nguyen', 'Chứng chỉ hành nghề khám bệnh, chữa bệnh', 'Sở Y tế TP.HCM', 'Số 002768/HCM-CCHN', '/images/doctors/nguyen-thi-hoai-nguyen/certificates/01-cchn.jpg', 0),
  ('doctor-nguyen-thi-hoai-nguyen', 'Giấy chứng nhận “Thảo luận về định hướng tương lai của nội nha với những đổi mới sinh học”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2024', '/images/doctors/nguyen-thi-hoai-nguyen/certificates/02-chung-chi.jpg', 1),
  ('doctor-nguyen-thi-hoai-nguyen', 'Giấy chứng nhận Hội thảo “Hoàn thiện phục hồi bằng vật liệu Composite”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2024', '/images/doctors/nguyen-thi-hoai-nguyen/certificates/03-chung-chi.jpg', 2),
  ('doctor-nguyen-thi-hoai-nguyen', 'Giấy chứng nhận Hội thảo “Xử trí cấp cứu y khoa trong phòng khám răng hàm mặt”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2024', '/images/doctors/nguyen-thi-hoai-nguyen/certificates/04-chung-chi.jpg', 3),
  ('doctor-nguyen-thi-hoai-nguyen', 'Giấy chứng nhận “Ứng dụng vật liệu sinh học trong bảo tồn tủy sống”', 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', 'Năm 2025', '/images/doctors/nguyen-thi-hoai-nguyen/certificates/05-chung-chi.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM doctor_certificates WHERE doctor_id = 'doctor-nguyen-thi-hoai-nguyen');

-- Existing doctors that only had their practising licence: append the other certificates from the old site.
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-ngo-thuy-tuyet-ngoc', 'Chứng chỉ đào tạo liên tục Phẫu thuật miệng cơ bản', 'Trường Đại học Văn Lang', '90 tiết; năm 2025', '/images/doctors/ngo-thuy-tuyet-ngoc/certificates/02-phau-thuat-mieng.jpg', 1),
  ('doctor-ngo-thuy-tuyet-ngoc', 'Basic Oral Surgery', 'MESI Medical', 'Năm 2025', '/images/doctors/ngo-thuy-tuyet-ngoc/certificates/03-chung-chi.jpg', 2),
  ('doctor-ngo-thuy-tuyet-ngoc', 'Chứng chỉ đào tạo liên tục Kiểm soát lây nhiễm trong thực hành nha khoa', 'Trường Đại học Văn Lang', '48 tiết; năm 2023', '/images/doctors/ngo-thuy-tuyet-ngoc/certificates/04-ksnk.jpg', 3),
  ('doctor-ngo-thuy-tuyet-ngoc', 'Seminar “Full-Mouth Rehabilitation & Aesthetics Dentistry”', '3M Lava Precision Solutions', 'Năm 2015', '/images/doctors/ngo-thuy-tuyet-ngoc/certificates/05-3m-lava.jpg', 4)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE (SELECT count(*) FROM doctor_certificates WHERE doctor_id = 'doctor-ngo-thuy-tuyet-ngoc') = 1;
INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
SELECT * FROM (VALUES
  ('doctor-huynh-ngoc-diem', 'Chứng chỉ Chỉnh hình Răng Mặt', 'Đại học Y Dược TP.HCM', '480 giờ; năm 2013', '/images/doctors/huynh-ngoc-diem/certificates/02-chinh-hinh.jpg', 1),
  ('doctor-huynh-ngoc-diem', 'Giấy chứng nhận Hội viên Hội Chỉnh hình Răng Mặt TP.HCM', 'Hội Y học TP.HCM', 'Năm 2017', '/images/doctors/huynh-ngoc-diem/certificates/03-chinh-hinh.jpg', 2),
  ('doctor-huynh-ngoc-diem', 'Giấy chứng nhận chuyên đề “Những quan niệm đương đại trong điều trị chỉnh hình răng mặt”', 'Khoa Răng Hàm Mặt – Đại học Y Dược TP.HCM', 'Năm 2017', '/images/doctors/huynh-ngoc-diem/certificates/04-chinh-hinh.jpg', 3),
  ('doctor-huynh-ngoc-diem', 'Giấy chứng nhận “Bảo tồn và thẩm mỹ trong nha khoa cá nhân hóa hiện đại”', 'Đại học Y Dược TP.HCM', 'Năm 2026', '/images/doctors/huynh-ngoc-diem/certificates/05-bao-ton-tham-my.jpg', 4),
  ('doctor-huynh-ngoc-diem', 'Giấy chứng nhận Hội thảo “Hoàn thiện phục hồi bằng vật liệu Composite”', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2024', '/images/doctors/huynh-ngoc-diem/certificates/06-hoan-thien-phuc-hoi.jpg', 5),
  ('doctor-huynh-ngoc-diem', 'Implantology Evolution – From Immediate Implantation to Patient Journey through a Fully Digital Workflow', 'Warantec Implant Academy', 'Năm 2025', '/images/doctors/huynh-ngoc-diem/certificates/07-chung-chi.jpg', 6),
  ('doctor-huynh-ngoc-diem', 'Giấy chứng nhận Hội nghị khoa học và triển lãm Răng Hàm Mặt quốc tế TP.HCM lần III', 'Bệnh viện Răng Hàm Mặt TP.HCM', 'Năm 2025', '/images/doctors/huynh-ngoc-diem/certificates/08-chung-chi.jpg', 7),
  ('doctor-huynh-ngoc-diem', 'The 3rd Ho Chi Minh City International Dental Exhibition & Congress (HIDEC 2025)', 'HIDEC 2025 Organizing Committee', 'Năm 2025', '/images/doctors/huynh-ngoc-diem/certificates/09-chung-chi.jpg', 8)
) AS v(doctor_id, title, issuer, detail, image, sort_order)
WHERE (SELECT count(*) FROM doctor_certificates WHERE doctor_id = 'doctor-huynh-ngoc-diem') = 1;

COMMIT;
