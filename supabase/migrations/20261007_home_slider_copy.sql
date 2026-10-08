-- Refine homepage hero copy to use concise, factual language.
-- Safe to run after 20251006_init.sql and preserves unrelated slide fields.

BEGIN;

UPDATE hero_slides
SET title = CASE id
  WHEN 'clinic' THEN 'Không gian thăm khám tại Nha Khoa 2000'
  WHEN 'implant' THEN 'Khu điều trị Implant chuyên biệt'
  WHEN 'team' THEN 'Đội ngũ bác sĩ Nha Khoa 2000'
  WHEN 'smile' THEN 'Chăm sóc nụ cười từ năm 1999'
  ELSE title
END
WHERE id IN ('clinic', 'implant', 'team', 'smile');

COMMIT;
