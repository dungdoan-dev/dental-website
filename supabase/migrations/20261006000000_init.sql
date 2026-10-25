-- ============================================================
-- NHA KHOA 2000 — SUPABASE MIGRATION
-- Chạy trong: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- SECTION 1: CLEANUP
-- ============================================================
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_certificates CASCADE;
DROP TABLE IF EXISTS doctor_experience_highlights CASCADE;
DROP TABLE IF EXISTS doctor_education CASCADE;
DROP TABLE IF EXISTS doctor_specialties CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS clinic_facilities CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS faq_items CASCADE;
DROP TABLE IF EXISTS hero_slides CASCADE;
DROP TABLE IF EXISTS core_values CASCADE;
DROP TABLE IF EXISTS insurance_partners CASCADE;

DROP TYPE IF EXISTS "ServiceCategory" CASCADE;
DROP TYPE IF EXISTS "DoctorCategory" CASCADE;
DROP TYPE IF EXISTS "ArticleCategory" CASCADE;
DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;
DROP TYPE IF EXISTS "BadgeVariant" CASCADE;

-- ============================================================
-- SECTION 2: ENUMS
-- ============================================================
CREATE TYPE "ServiceCategory"   AS ENUM ('pediatric','general','aesthetic','orthodontics','implant','periodontics','other');
CREATE TYPE "DoctorCategory"    AS ENUM ('implant','ortho','aesthetic','surgery','pediatric');
CREATE TYPE "ArticleCategory"   AS ENUM ('implant','veneer','orthodontics','kids','periodontics','general');
CREATE TYPE "AppointmentStatus" AS ENUM ('pending','confirmed','completed','cancelled');
CREATE TYPE "BadgeVariant"      AS ENUM ('blue','green');

-- ============================================================
-- SECTION 3: TABLES
-- ============================================================

CREATE TABLE clinics (
    id              TEXT         PRIMARY KEY,
    name            TEXT         NOT NULL,
    slug            TEXT         NOT NULL UNIQUE,
    label           TEXT         NOT NULL,
    badge           TEXT         NOT NULL,
    address         TEXT         NOT NULL,
    phone           TEXT         NOT NULL,
    image           TEXT         NOT NULL,
    description     TEXT         NOT NULL,
    working_hours   TEXT         NOT NULL,
    google_maps_url TEXT,
    accent          "BadgeVariant" NOT NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE clinic_facilities (
    id         BIGSERIAL    PRIMARY KEY,
    clinic_id  TEXT         NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name       TEXT         NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE services (
    id                TEXT              PRIMARY KEY,
    name              TEXT              NOT NULL,
    slug              TEXT              NOT NULL UNIQUE,
    short_description TEXT              NOT NULL,
    description       TEXT              NOT NULL,
    image             TEXT              NOT NULL,
    badge             TEXT              NOT NULL,
    badge_variant     "BadgeVariant"    NOT NULL,
    featured          BOOLEAN           NOT NULL DEFAULT FALSE,
    category          "ServiceCategory" NOT NULL,
    created_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE TABLE doctors (
    id               TEXT             PRIMARY KEY,
    name             TEXT             NOT NULL,
    slug             TEXT             NOT NULL UNIQUE,
    avatar           TEXT             NOT NULL,
    position         TEXT             NOT NULL,
    specialty        TEXT             NOT NULL,
    experience       INT              NOT NULL,
    description      TEXT             NOT NULL,
    badge            TEXT             NOT NULL,
    highlight        TEXT             NOT NULL,
    featured         BOOLEAN          NOT NULL DEFAULT FALSE,
    category         "DoctorCategory" NOT NULL,
    directory_title  TEXT             NOT NULL,
    license_number   TEXT,
    quote            TEXT,
    languages        JSONB,
    source_url       TEXT,
    created_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE TABLE doctor_specialties (
    id         BIGSERIAL PRIMARY KEY,
    doctor_id  TEXT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    specialty  TEXT      NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0
);

CREATE TABLE doctor_education (
    id         BIGSERIAL PRIMARY KEY,
    doctor_id  TEXT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    content    TEXT      NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0
);

CREATE TABLE doctor_experience_highlights (
    id         BIGSERIAL PRIMARY KEY,
    doctor_id  TEXT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    content    TEXT      NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0
);

CREATE TABLE doctor_certificates (
    id         BIGSERIAL PRIMARY KEY,
    doctor_id  TEXT      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    title      TEXT      NOT NULL,
    issuer     TEXT      NOT NULL,
    detail     TEXT      NOT NULL,
    image      TEXT      NOT NULL,
    sort_order INT       NOT NULL DEFAULT 0
);

CREATE TABLE articles (
    id              TEXT               PRIMARY KEY,
    title           TEXT               NOT NULL,
    slug            TEXT               NOT NULL UNIQUE,
    excerpt         TEXT               NOT NULL,
    content         TEXT               NOT NULL,
    thumbnail       TEXT               NOT NULL,
    published_at    TIMESTAMPTZ        NOT NULL,
    author          TEXT               NOT NULL DEFAULT 'Đội ngũ Nha Khoa 2000',
    category        "ArticleCategory"  NOT NULL,
    reading_minutes INT                NOT NULL DEFAULT 3,
    featured        BOOLEAN            NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE appointments (
    id               BIGSERIAL           PRIMARY KEY,
    name             TEXT                NOT NULL,
    phone            TEXT                NOT NULL,
    email            TEXT,
    service_id       TEXT                REFERENCES services(id) ON DELETE SET NULL,
    doctor_id        TEXT                REFERENCES doctors(id)  ON DELETE SET NULL,
    clinic_id        TEXT                REFERENCES clinics(id)  ON DELETE SET NULL,
    appointment_date TIMESTAMPTZ         NOT NULL,
    note             TEXT,
    status           "AppointmentStatus" NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE testimonials (
    id            TEXT        PRIMARY KEY,
    customer_name TEXT        NOT NULL,
    rating        INT         NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    content       TEXT        NOT NULL,
    avatar        TEXT,
    source        TEXT,
    initials      TEXT        NOT NULL,
    accent        TEXT        NOT NULL,
    sort_order    INT         NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faq_items (
    id         BIGSERIAL   PRIMARY KEY,
    question   TEXT        NOT NULL,
    answer     TEXT        NOT NULL,
    sort_order INT         NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hero_slides (
    id              TEXT PRIMARY KEY,
    image           TEXT NOT NULL,
    image_alt       TEXT NOT NULL,
    badge           TEXT NOT NULL,
    title           TEXT NOT NULL,
    badge_variant   TEXT NOT NULL,
    object_position TEXT NOT NULL DEFAULT 'center',
    sort_order      INT  NOT NULL DEFAULT 0
);

CREATE TABLE core_values (
    id          BIGSERIAL   PRIMARY KEY,
    title       TEXT        NOT NULL,
    slogan      TEXT        NOT NULL,
    description TEXT        NOT NULL,
    icon_key    TEXT        NOT NULL,
    sort_order  INT         NOT NULL DEFAULT 0
);

CREATE TABLE insurance_partners (
    id          BIGSERIAL   PRIMARY KEY,
    code        TEXT        NOT NULL UNIQUE,
    name        TEXT        NOT NULL,
    description TEXT        NOT NULL,
    accent      TEXT        NOT NULL,
    sort_order  INT         NOT NULL DEFAULT 0
);

-- ============================================================
-- SECTION 4: INDEXES
-- ============================================================
CREATE INDEX ON services(category);
CREATE INDEX ON services(featured);
CREATE INDEX ON doctors(category);
CREATE INDEX ON doctors(featured);
CREATE INDEX ON articles(category);
CREATE INDEX ON articles(featured);
CREATE INDEX ON articles(published_at DESC);
CREATE INDEX ON appointments(status);
CREATE INDEX ON appointments(appointment_date);
CREATE INDEX ON appointments(phone);

-- ============================================================
-- SECTION 5: AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON clinics      FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services     FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON doctors      FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON articles     FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- SECTION 6: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS trên tất cả bảng
ALTER TABLE clinics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_facilities    ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_specialties   ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_education     ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_experience_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides          ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values          ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_partners   ENABLE ROW LEVEL SECURITY;

-- Public READ (anon key) cho dữ liệu hiển thị công khai
CREATE POLICY "public_read" ON clinics              FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON clinic_facilities    FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON services             FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON doctors              FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON doctor_specialties   FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON doctor_education     FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON doctor_experience_highlights FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON doctor_certificates  FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON articles             FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON testimonials         FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON faq_items            FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON hero_slides          FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON core_values          FOR SELECT USING (TRUE);
CREATE POLICY "public_read" ON insurance_partners   FOR SELECT USING (TRUE);

-- Public INSERT cho appointments (khách đặt lịch không cần đăng nhập)
CREATE POLICY "public_insert_appointment" ON appointments FOR INSERT WITH CHECK (TRUE);

-- Chỉ service_role (server) mới được WRITE vào các bảng nội dung
CREATE POLICY "service_role_all" ON clinics     FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON services    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON doctors     FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON articles    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON appointments FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON testimonials FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON faq_items   FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON hero_slides FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON core_values FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "service_role_all" ON insurance_partners FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- SECTION 7: SEED DATA
-- ============================================================

-- CLINICS
INSERT INTO clinics (id, name, slug, label, badge, address, phone, image, description, working_hours, google_maps_url, accent) VALUES
('clinic-1','Cơ Sở Hồ Hảo Hớn','ho-hao-hon','Trụ sở Quận 1','12 Ghế Điều Trị','99 Hồ Hảo Hớn, P. Cầu Ông Lãnh, Quận 1, TP.HCM','1900 966 960','/images/clinics/ho-hao-hon.jpg','Khu vực trung tâm thuận tiện, gần đại lộ Võ Văn Kiệt và chợ Bến Thành.','08:00–12:00 | 13:30–20:00 (T2 - T7)','https://maps.google.com','blue'),
('clinic-2','Cơ Sở Ngô Gia Tự','ngo-gia-tu','Cơ sở Quận 5','Trung Tâm Cấy Ghép','502 Ngô Gia Tự, P. An Đông (P.9 cũ), Quận 5, TP.HCM','1900 888 642','/images/clinics/ngo-gia-tu.jpg','Trục đường giao thương sầm uất, giáp Quận 10, thuận tiện đón tiếp khách miền Tây.','08:00–12:00 | 13:30–20:00 (T2 - T7)','https://maps.google.com','green');

INSERT INTO clinic_facilities (clinic_id, name, sort_order) VALUES
('clinic-1','Máy Cone Beam 3D',1),('clinic-1','Phòng mổ áp lực âm',2),('clinic-1','Bãi đỗ xe ô tô an ninh',3),('clinic-1','Khu vui chơi trẻ em',4),
('clinic-2','Labo CAD/CAM tại chỗ',1),('clinic-2','Phòng phục hồi hậu phẫu VIP',2),('clinic-2','Máy Scan quang học iTero',3),('clinic-2','Thang máy chuyên dụng y tế',4);

-- SERVICES
INSERT INTO services (id, name, slug, short_description, description, image, badge, badge_variant, featured, category) VALUES
('service-1','Cấy Ghép Implant Kỹ Thuật Số','trong-rang-implant','Phục hồi răng mất với kế hoạch điều trị cá nhân hóa, có thể kết hợp chẩn đoán hình ảnh 3D theo chỉ định của bác sĩ.','Giải pháp phục hồi răng mất bằng Implant được bác sĩ lập kế hoạch theo tình trạng xương hàm và nhu cầu của từng người.','/images/services/implant-digital.jpg','Digital Implant','blue',TRUE,'implant'),
('service-2','Răng Sứ Thẩm Mỹ & Mặt Dán Veneer','boc-rang-su','Nụ cười tự nhiên rạng rỡ, thiết kế chuẩn nhân tướng học và đường cười Smile Design, bảo tồn tối đa răng thật với phôi sứ cao cấp.','Giải pháp thẩm mỹ nụ cười được thiết kế theo đường cười Smile Design và ưu tiên bảo tồn răng thật.','/images/services/veneer-cosmetic.jpg','Cosmetic Dentistry','blue',TRUE,'aesthetic'),
('service-3','Niềng Răng - Chỉnh Nha Trong Suốt','nieng-rang','Điều chỉnh khớp cắn hoàn hảo với khay niềng vô hình thẩm mỹ Invisalign Hoa Kỳ, biết trước kết quả điều trị qua mô phỏng 3D.','Điều chỉnh khớp cắn với kế hoạch chỉnh nha cá nhân hóa và mô phỏng kết quả điều trị 3D.','/images/services/orthodontics.jpg','Orthodontics','green',TRUE,'orthodontics'),
('service-4','Điều Trị Viêm Nha Chu & Cạo Vôi Siêu Âm','dieu-tri-tong-quat','Làm sạch mảng bám và điều trị mô nha chu bằng thiết bị siêu âm, giúp kiểm soát viêm nướu và bảo vệ nền răng khỏe mạnh.','Quy trình kiểm soát viêm nha chu chuyên sâu giúp làm sạch mảng bám, chăm sóc mô nướu và duy trì sức khỏe răng miệng lâu dài.','/images/services/endodontics.jpg','Periodontal Care','green',TRUE,'periodontics'),
('service-5','Nhổ Răng Khôn Không Đau Piezotome','nho-rang-khon-piezotome','Sóng siêu âm Piezotome hỗ trợ bóc tách mô nhẹ nhàng, giảm xâm lấn và rút ngắn thời gian hồi phục sau tiểu phẫu.','Ứng dụng sóng siêu âm Piezotome hỗ trợ bóc tách mô nhẹ nhàng, giảm xâm lấn và rút ngắn thời gian hồi phục.','/images/services/wisdom-tooth-piezotome.jpg','Piezotome Surgery','blue',TRUE,'other'),
('service-6','Nha Khoa Trẻ Em & Dự Phòng Sâu Răng','nha-khoa-tre-em','Chăm sóc nụ cười bé yêu trong không gian điều trị thân thiện, ngừa sâu sớm với Vecni Fluor sinh học, giúp bé vui vẻ hợp tác.','Chăm sóc và phòng ngừa các vấn đề răng miệng cho trẻ trong môi trường thân thiện, nhẹ nhàng.','/images/services/pediatric-dentistry.jpg','Pediatric Care','green',TRUE,'pediatric'),
('service-7','Tẩy Trắng Răng Laser Whitening','tay-trang-rang','Cải thiện sắc độ răng an toàn bằng năng lượng laser được kiểm soát, cho nụ cười sáng tự nhiên ngay sau liệu trình.','Liệu trình tẩy trắng được cá nhân hóa theo sắc độ men răng, kết hợp quy trình bảo vệ nướu và kiểm soát ê buốt.','/images/services/veneer-cosmetic.jpg','Laser Whitening','blue',FALSE,'aesthetic'),
('service-8','Phục Hình Cầu Răng Sứ & Hàm Tháo Lắp','phuc-hinh-cau-rang-su','Khôi phục chức năng ăn nhai và thẩm mỹ bằng phương án phục hình phù hợp với tình trạng răng, khớp cắn và ngân sách.','Giải pháp phục hình răng mất được thiết kế theo tình trạng lâm sàng, giúp khôi phục khả năng ăn nhai và sự hài hòa của nụ cười.','/images/services/implant-digital.jpg','Prosthodontics','green',FALSE,'general'),
('service-9','Điều Trị Tủy Răng Kính Hiển Vi','dieu-tri-tuy-rang-kinh-hien-vi','Kính hiển vi phóng đại hỗ trợ quan sát hệ thống ống tủy, tăng độ chính xác và ưu tiên bảo tồn răng thật lâu dài.','Điều trị nội nha dưới kính hiển vi giúp bác sĩ quan sát rõ hệ thống ống tủy và kiểm soát tốt hơn các vị trí phức tạp.','/images/services/endodontics.jpg','Microscope Endodontics','blue',FALSE,'general');

-- DOCTORS
INSERT INTO doctors (id, name, slug, avatar, position, specialty, experience, description, badge, highlight, featured, category, directory_title, license_number, quote, languages, source_url) VALUES
('doctor-1','BS.CKII Võ Văn Tự Hiến','vo-van-tu-hien','/images/doctors/vo-van-tu-hien.jpg','Cố vấn Y khoa','Cấy ghép Implant',35,'Chủ tịch HSDI, hơn 35 năm kinh nghiệm lâm sàng và đặt nền móng Implant học tại Việt Nam.','Cố vấn cấp cao','Hơn 35 năm kinh nghiệm',TRUE,'implant','Chuyên Gia Cấy Ghép Implant',NULL,NULL,NULL,NULL),
('doctor-2','ThS.BS Lê Hồng Phúc','le-hong-phuc','/images/doctors/le-hong-phuc.jpg','Trưởng khoa Chỉnh nha','Phục hình',15,'Thủ khoa ThS RHM ĐH Y Dược TP.HCM, tu nghiệp chuyên sâu kỹ thuật Invisalign tại Hoa Kỳ.','Trưởng khoa','Chuyên gia Chỉnh nha Hoa Kỳ',TRUE,'ortho','Chuyên Gia Chỉnh Nha & Niềng Răng',NULL,NULL,NULL,NULL),
('doctor-3','ThS.BS Nguyễn Thị Mai Trâm','nguyen-thi-mai-tram','/images/doctors/nguyen-thi-mai-tram.jpg','Thẩm mỹ Nụ cười','Veneer',15,'Hơn 15 năm kinh nghiệm phục hình dán sứ vi phẫu, thành viên Hiệp hội Thẩm mỹ Nha khoa Châu Á.','Thẩm mỹ nụ cười','Thành viên Nha khoa Châu Á',TRUE,'aesthetic','Răng Sứ & Thẩm Mỹ Nụ Cười',NULL,NULL,NULL,NULL),
('doctor-4','ThS.BS Trần Quốc Tuấn','tran-quoc-tuan','/images/doctors/tran-quoc-tuan.jpg','Chuyên Gia','Phẫu Thuật Hàm Mặt & Nha Chu',14,'Bác sĩ chuyên sâu phẫu thuật hàm mặt và điều trị nha chu với phương pháp bảo tồn hiện đại.','Phẫu thuật','Chuyên sâu Hàm Mặt',FALSE,'surgery','Phẫu Thuật Hàm Mặt & Nha Chu',NULL,NULL,NULL,NULL),
('doctor-5','BS.CKI Đỗ Thùy Trang','do-thuy-trang','/images/doctors/do-thuy-trang.jpg','Bác Sĩ','Điều Trị Tủy & Bảo Tồn Răng',12,'Bác sĩ chuyên điều trị nội nha, phục hồi và bảo tồn răng thật bằng quy trình chuyên sâu.','Nội nha','Bảo tồn răng thật',FALSE,'pediatric','Điều Trị Tủy & Bảo Tồn Răng',NULL,NULL,NULL,NULL),
('doctor-6','BS.CKI Vũ Đình Khang','vu-dinh-khang','/images/doctors/vu-dinh-khang.jpg','Bác Sĩ','Phục Hình Trên Implant Toàn Hàm',11,'Bác sĩ tập trung phục hình trên Implant, thiết kế khớp cắn và khôi phục khả năng ăn nhai toàn hàm.','Phục hình','Implant toàn hàm',FALSE,'implant','Phục Hình Trên Implant Toàn Hàm',NULL,NULL,NULL,NULL),
('doctor-7','BS Phạm Hoàng Yến','pham-hoang-yen','/images/doctors/pham-hoang-yen.jpg','Bác Sĩ','Nha Khoa Trẻ Em & Tiền Chỉnh Nha',9,'Bác sĩ chăm sóc răng miệng trẻ em và theo dõi phát triển răng hàm mặt trong giai đoạn sớm.','Nha khoa trẻ em','Chăm sóc nhẹ nhàng',FALSE,'pediatric','Nha Khoa Trẻ Em & Tiền Chỉnh Nha',NULL,NULL,NULL,NULL),
('doctor-8','BS.CKI Nguyễn Tấn Lộc','nguyen-tan-loc','/images/doctors/nguyen-tan-loc.jpg','Bác Sĩ','Phẫu Thuật Ghép Nướu & Tái Sinh Xương',13,'Bác sĩ chuyên phẫu thuật ghép nướu, tái sinh xương và điều trị các tình trạng nha chu phức tạp.','Nha chu','Tái sinh mô nha chu',FALSE,'surgery','Phẫu Thuật Ghép Nướu & Tái Sinh Xương',NULL,NULL,NULL,NULL),
('doctor-9','BS. Vũ Công Tuệ','vu-cong-tue','/images/doctors/vu-cong-tue.jpg','Giám đốc Phụ trách Chuyên môn – Nha Khoa 2000 Cơ sở 1','Nha khoa tổng quát, phục hình thẩm mỹ và Implant',20,'Hơn 20 năm kinh nghiệm trong nha khoa tổng quát, bác sĩ Tuệ theo đuổi phong cách điều trị tận tâm, gần gũi và lấy sự tin cậy của bệnh nhân làm nền tảng.','Giám đốc chuyên môn CS1','Hơn 20 năm kinh nghiệm',FALSE,'aesthetic','Giám Đốc Chuyên Môn Cơ Sở 1','010749/HCM-CCHN','Với hơn 20 năm kinh nghiệm trong nha khoa tổng quát, bác sĩ Tuệ theo đuổi phong cách điều trị tận tâm, gần gũi và lấy sự tin cậy của bệnh nhân làm nền tảng trong chăm sóc và điều trị.','["Tiếng Việt","Tiếng Anh"]','https://nhakhoa2000.com/bac-si/bac-si-vu-cong-tue/');

INSERT INTO doctor_specialties (doctor_id, specialty, sort_order) VALUES
('doctor-9','Nha khoa tổng quát',1),('doctor-9','Phục hình thẩm mỹ',2),('doctor-9','Implant',3);

INSERT INTO doctor_education (doctor_id, content, sort_order) VALUES
('doctor-9','Bác sĩ Răng Hàm Mặt, Trường Đại học Y Dược TP.HCM, tốt nghiệp năm 2007.',1),
('doctor-9','Chứng chỉ Cấy ghép Implant năm 2012.',2),
('doctor-9','Thành viên Hội Cấy ghép Nha khoa TP.HCM (HSDi).',3),
('doctor-9','Thành viên Hội Implant Thế giới (ITI).',4);

INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order) VALUES
('doctor-9','Hơn 20 năm kinh nghiệm trong nha khoa tổng quát.',1),
('doctor-9','Giám đốc phụ trách chuyên môn Nha Khoa 2000 từ năm 2016.',2),
('doctor-9','Chuyên sâu phục hình thẩm mỹ, phục hình dán và phục hình trên Implant từ đơn lẻ đến toàn hàm.',3);

INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order) VALUES
('doctor-9','Chứng chỉ hành nghề khám, chữa bệnh','Sở Y tế TP.HCM','Số 010749/HCM-CCHN','/images/doctors/certificates/vu-cong-tue-cchn.jpg',1),
('doctor-9','Đào tạo Cấy ghép Implant nâng cao','Neobiotech','Hoàn thành khóa học năm 2012','/images/doctors/certificates/vu-cong-tue-cc.jpg',2),
('doctor-9','Hội viên Implant Prosthetic Section','ICOI','Chứng nhận hội viên','/images/doctors/certificates/vu-cong-tue-ioci.jpg',3),
('doctor-9','Đào tạo liên tục về Phục hình thẩm mỹ','Bệnh viện Răng Hàm Mặt Trung ương TP.HCM','Hội thảo năm 2014','/images/doctors/certificates/vu-cong-tue-014.jpg',4),
('doctor-9','Huấn luyện nâng cao về Cấy ghép Nha khoa','Hội Cấy ghép Nha khoa TP.HCM (HSDi)','Khóa huấn luyện năm 2013','/images/doctors/certificates/vu-cong-tue-cc-1.jpg',5);

-- ARTICLES
INSERT INTO articles (id, title, slug, excerpt, content, thumbnail, published_at, author, category, reading_minutes, featured) VALUES
('article-featured','Làm Sao Để Bảo Vệ Răng Của Trẻ Nhỏ Và Phòng Ngừa Sâu Răng Sớm Từ Những Năm Đầu Đời?','bao-ve-rang-tre-nho-phong-ngua-sau-rang','Hướng dẫn thực hành giúp phụ huynh chăm sóc men răng sữa và tạo thói quen vệ sinh răng miệng cho trẻ từ sớm.','Chăm sóc răng miệng cho trẻ bắt đầu từ những thói quen hằng ngày. Phụ huynh có thể hỗ trợ trẻ chải răng phù hợp với độ tuổi, theo dõi lượng đường trong bữa ăn và đưa trẻ đi khám nha khoa khi có dấu hiệu bất thường. Bác sĩ sẽ đánh giá tình trạng cụ thể và hướng dẫn cách chăm sóc phù hợp cho từng bé.','/images/articles/featured-child-care.jpg','2025-05-20 08:00:00+07','Đội ngũ Nha Khoa 2000','kids',5,TRUE),
('article-implant-process','Quy Trình Cấy Ghép Implant Tức Thì Chuẩn Châu Âu Tại Nha Khoa 2000','quy-trinh-cay-ghep-implant-tuc-thi','Tìm hiểu các bước thăm khám, chẩn đoán hình ảnh và lập kế hoạch phục hồi răng mất bằng Implant.','Cấy ghép Implant cần được lên kế hoạch dựa trên tình trạng xương hàm, sức khỏe tổng quát và nhu cầu phục hình. Sau khi khám và chụp phim, bác sĩ sẽ trao đổi phương án, thời gian điều trị và những lưu ý chăm sóc. Khả năng cấy ghép tức thì phụ thuộc vào chỉ định lâm sàng của từng người.','/images/articles/implant-guide.jpg','2025-05-15 08:00:00+07','Đội ngũ Nha Khoa 2000','implant',4,FALSE),
('article-veneer-crown','Phân Biệt Dán Sứ Veneer Và Bọc Răng Sứ: Đâu Là Lựa Chọn Bảo Tồn Răng Thật?','phan-biet-dan-su-veneer-va-boc-rang-su','So sánh hai phương pháp phục hình thẩm mỹ và các yếu tố cần cân nhắc khi lựa chọn.','Veneer và mão sứ có chỉ định khác nhau tùy tình trạng răng, khớp cắn và mục tiêu điều trị. Mức độ sửa soạn răng, khả năng bảo tồn mô răng và tuổi thọ phục hình cần được bác sĩ giải thích sau khi thăm khám. Không có một lựa chọn phù hợp cho tất cả mọi người.','/images/articles/veneer-guide.jpg','2025-05-12 08:00:00+07','Đội ngũ Nha Khoa 2000','veneer',6,FALSE),
('article-orthodontics-compare','Niềng Răng Trong Suốt Hay Mắc Cài: So Sánh Hiệu Quả Và Thời Gian Điều Trị','nieng-rang-trong-suot-hay-mac-cai','So sánh tính thẩm mỹ, cách chăm sóc và các yếu tố ảnh hưởng đến thời gian chỉnh nha.','Khay trong suốt và mắc cài đều có thể được dùng trong chỉnh nha, nhưng chỉ định phụ thuộc vào mức độ lệch lạc, khớp cắn và khả năng tuân thủ điều trị. Bác sĩ chỉnh nha sẽ phân tích phim, mẫu hàm và mục tiêu để tư vấn phương án phù hợp.','/images/articles/orthodontics-guide.jpg','2025-05-08 08:00:00+07','Đội ngũ Nha Khoa 2000','orthodontics',5,FALSE),
('article-wisdom-tooth','Nhổ Răng Khôn Bằng Sóng Siêu Âm Piezotome: Giảm Đau, Nhanh Lành Thương','nho-rang-khon-bang-song-sieu-am-piezotome','Giới thiệu vai trò của thiết bị hỗ trợ phẫu thuật và những lưu ý trước, sau khi nhổ răng khôn.','Việc nhổ răng khôn cần được đánh giá vị trí răng và cấu trúc lân cận trên phim chẩn đoán. Thiết bị Piezotome có thể hỗ trợ thao tác trong một số trường hợp, nhưng mức độ khó chịu và thời gian hồi phục khác nhau ở từng người. Hãy tuân thủ hướng dẫn chăm sóc và tái khám của bác sĩ.','/images/articles/wisdom-tooth-guide.jpg','2025-05-04 08:00:00+07','Đội ngũ Nha Khoa 2000','periodontics',4,FALSE),
('article-periodontal','Viêm Nha Chu Và Chảy Máu Chân Răng: Dấu Hiệu Chớ Xem Thường','viem-nha-chu-va-chay-mau-chan-rang','Nhận biết một số dấu hiệu bất thường ở nướu và thời điểm nên đến nha khoa kiểm tra.','Chảy máu khi chải răng có thể liên quan đến nhiều nguyên nhân, trong đó có tình trạng viêm nướu hoặc nha chu. Bác sĩ cần thăm khám để đánh giá mảng bám, túi nha chu và các yếu tố liên quan trước khi đưa ra hướng điều trị. Không nên tự chẩn đoán chỉ dựa vào một triệu chứng.','/images/articles/periodontal-guide.jpg','2025-04-28 08:00:00+07','Đội ngũ Nha Khoa 2000','periodontics',3,FALSE),
('article-implant-longevity','Độ Bền Trụ Implant: Có Thực Sự Sử Dụng Được Trọn Đời Không?','do-ben-tru-implant-co-su-dung-tron-doi-khong','Những yếu tố có thể ảnh hưởng đến tuổi thọ Implant và lý do cần tái khám định kỳ.','Độ bền của Implant chịu ảnh hưởng bởi tình trạng xương, sức khỏe toàn thân, vệ sinh răng miệng và lịch tái khám. Không thể bảo đảm một thời hạn giống nhau cho mọi người. Bác sĩ sẽ hướng dẫn cách chăm sóc phục hình và theo dõi sau điều trị.','/images/articles/implant-longevity.jpg','2025-04-21 08:00:00+07','Đội ngũ Nha Khoa 2000','implant',5,FALSE),
('article-1','5 thói quen giúp răng khỏe mỗi ngày','5-thoi-quen-giup-rang-khoe','Những thói quen đơn giản giúp bảo vệ sức khỏe răng miệng lâu dài.','Chải răng đúng cách, dùng chỉ nha khoa, hạn chế đồ ngọt và khám nha khoa định kỳ là nền tảng của một nụ cười khỏe mạnh.','/images/articles/periodontal-guide.jpg','2025-04-15 08:00:00+07','Đội ngũ Nha Khoa 2000','general',3,FALSE),
('article-2','Khi nào nên khám nha khoa định kỳ?','khi-nao-nen-kham-nha-khoa','Khám định kỳ giúp phát hiện sớm nhiều vấn đề răng miệng.','Lịch khám phù hợp phụ thuộc vào sức khỏe răng miệng của mỗi người. Bác sĩ sẽ tư vấn tần suất kiểm tra sau lần thăm khám đầu tiên.','/images/articles/implant-guide.jpg','2025-04-10 08:00:00+07','Đội ngũ Nha Khoa 2000','general',3,FALSE),
('article-3','Cách chăm sóc răng sau khi tẩy trắng','cham-soc-rang-sau-tay-trang','Một số lưu ý để duy trì màu răng sau điều trị.','Trong thời gian đầu sau tẩy trắng, nên hạn chế thực phẩm đậm màu và tuân thủ hướng dẫn chăm sóc từ bác sĩ điều trị.','/images/articles/veneer-guide.jpg','2025-04-05 08:00:00+07','Đội ngũ Nha Khoa 2000','veneer',3,FALSE);

-- TESTIMONIALS
INSERT INTO testimonials (id, customer_name, rating, content, source, initials, accent, sort_order) VALUES
('review-1','Bác Trần Thanh Tùng',5,'"Tôi bay từ Úc về để trồng 4 trụ Implant tại cơ sở 1 Hồ Hảo Hớn. Thật sự bất ngờ vì bác sĩ làm êm vô cùng, không hề đau đớn như tôi lo sợ. Sau 3 tháng răng ăn nhai cực kì thoải mái."','Việt kiều Úc • Implant Toàn Hàm','TT','blue',1),
('review-2','Chị Nguyễn Hồng Hạnh',5,'"Làm việc trong ngành truyền thông nên tôi cực kỳ kỹ tính về độ tự nhiên của răng sứ. Bác sĩ Trâm thiết kế form răng bo tròn thanh thoát, bạn bè ai cũng khen cười tươi mà không hề bị giả tạo!"','Quận 3 • Dán Sứ Veneer Emax','NH','green',2),
('review-3','Bạn Đỗ Đăng Khoa',5,'"Mình nhổ 2 chiếc răng khôn mọc lệch 90 độ bằng máy siêu âm Piezotome ở CS2 Ngô Gia Tự. Quá trình làm chưa đầy 20 phút, về nhà uống thuốc theo toa không sưng má một ngày nào!"','Quận 5 • Nhổ Răng Khôn Siêu Âm','ĐK','blue-dark',3);

-- FAQ
INSERT INTO faq_items (question, answer, sort_order) VALUES
('Cấy ghép Implant tại Nha Khoa 2000 có đau không và mất bao lâu?','Với kỹ thuật gây tê cục bộ tân tiến và máng phẫu thuật kỹ thuật số định vị 3D, quá trình cấy ghép 1 trụ implant diễn ra rất nhẹ nhàng chỉ trong khoảng 15 - 20 phút và hoàn toàn không đau. Sau thủ thuật, bệnh nhân chỉ cảm thấy hơi căng nhẹ và có thể sinh hoạt, làm việc bình thường vào ngày hôm sau.',1),
('Dán sứ Veneer khác gì so với bọc răng sứ truyền thống?','Dán sứ Veneer là giải pháp thẩm mỹ bảo tồn đỉnh cao: bác sĩ chỉ cần làm nhám bề mặt men răng từ 0.2 – 0.5mm (thậm chí nhiều trường hợp không cần mài), không xâm lấn mô tủy răng thật. Trong khi đó, bọc sứ truyền thống cần mài chỉnh thể tích răng nhiều hơn để làm trụ chịu lực.',2),
('Nha Khoa 2000 có chính sách hỗ trợ trả góp không?','Có. Chúng tôi liên kết với hơn 25 ngân hàng uy tín hỗ trợ chương trình trả góp 0% lãi suất cho các dịch vụ như Niềng răng Chỉnh nha, Cấy ghép Implant và Răng sứ thẩm mỹ với kỳ hạn linh hoạt 3 – 6 – 12 tháng giúp quý khách an tâm điều trị mà không chịu áp lực kinh tế.',3),
('Tôi cần đặt lịch hẹn trước bao lâu khi đến khám?','Để tránh thời gian chờ đợi và được phục vụ chu đáo nhất, quý khách nên đăng ký trước ít nhất 1-2 ngày qua hotline 1900 966 960 (CS1) hoặc 1900 888 642 (CS2), hoặc để lại thông tin trực tuyến tại website để nhân viên điều phối khung giờ phù hợp nhất với bác sĩ chuyên khoa phụ trách.',4);

-- HERO SLIDES
INSERT INTO hero_slides (id, image, image_alt, badge, title, badge_variant, object_position, sort_order) VALUES
('clinic','/images/hero/clinic-modern.jpg','Không gian phòng khám Nha Khoa 2000','Hệ Thống Phòng Khám Chuẩn Quốc Tế','Không Gian Điều Trị Hiện Đại & Thư Thái','blue','center',1),
('implant','/images/hero/implant-center.jpg','Trung tâm cấy ghép Implant kỹ thuật số','Trung Tâm Cấy Ghép Kỹ Thuật Số','Phòng Phẫu Thuật Tiêu Chuẩn Class B Châu Âu','green','center',2),
('team','/images/hero/dental-team.jpg','Đội ngũ Bác sĩ Nha Khoa 2000','Thành Lập Từ Năm 1999','BS.CKII Võ Văn Tự Hiến & Đội Ngũ Chuyên Gia','blue','top',3),
('smile','/images/hero/healthy-smile.jpg','Nụ cười tự nhiên và rạng ngời','Nụ Cười Khỏe Đẹp Toàn Diện','You Smile, We Smile • Hơn 25 Năm Đồng Hành','green','center',4);

-- CORE VALUES
INSERT INTO core_values (title, slogan, description, icon_key, sort_order) VALUES
('THÂN THƯƠNG','"Nha Khoa là nhà"','Cảm giác thân thương là điều Nha Khoa 2000 muốn mang lại cho khách hàng cũng như cho đội ngũ nhân viên làm việc tại Nha Khoa.','heart',1),
('TẬN TÂM','"Lấy khách hàng làm trung tâm"','Tập thể Nha Khoa 2000 luôn giữ vững tôn chỉ này để tận tâm mang tới dịch vụ tốt nhất cho khách hàng.','care',2),
('TRUNG THỰC','"Trung thực là nền tảng đạo đức của mỗi con người"','Trung thực với chính mình, trung thực với khách hàng, trung thực với đối tác là giá trị chúng tôi luôn theo đuổi.','honesty',3),
('TÂN TIẾN','"Phát triển song song với sự tiến bộ vượt bậc của ngành nha thế giới"','Chúng tôi luôn nỗ lực nắm bắt xu hướng mới nhất của thế giới, từ máy móc trang thiết bị tới phương pháp điều trị hiện đại nhất.','innovation',4);

-- INSURANCE PARTNERS
INSERT INTO insurance_partners (code, name, description, accent, sort_order) VALUES
('PVI','PVI Care','Bảo hiểm Dầu Khí','blue',1),
('BẢO VIỆT','Bảo Việt','Bảo Việt An Gia','green',2),
('GEN','Generali','Bảo hiểm Quốc tế','blue',3),
('PAP','Papaya','Bảo lãnh số E-claim','green',4),
('LIB','Liberty','Liberty Insurance','blue',5),
('PTI','PTI Care','Bảo hiểm Bưu Điện','green',6),
('INSM','Insmart','TPA Sức khỏe Quốc tế','blue',7),
('SAS','S.A.S Care','Bảo trợ y tế toàn cầu','green',8),
('VBI','VietinBank (VBI)','Bảo hiểm VietinBank','blue',9),
('BAK','Bảo An Khang','Chăm sóc nụ cười','green',10),
('MIC','MIC Care','Bảo hiểm Quân Đội','blue',11),
('BL','Bảo Long','Bảo Long Insurance','green',12),
('PCV','PCV TPA','Bảo lãnh viện phí','blue',13),
('AIA','AIA Vitality','AIA Life Insurance','green',14),
('ATAC','ATACC','Hỗ trợ bảo lãnh 24/7','blue',15);
