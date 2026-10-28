-- Chủ đề cho câu hỏi thường gặp, dùng làm bộ lọc ở trang /hoi-dap.
ALTER TABLE faq_items ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Chung';

UPDATE faq_items SET category = 'Bọc răng sứ' WHERE category = 'Chung' AND question ILIKE '%răng sứ%' AND question NOT ILIKE '%veneer%';
UPDATE faq_items SET category = 'Trám răng' WHERE category = 'Chung' AND (question ILIKE '%trám%' OR question ILIKE '%hàn răng%');
UPDATE faq_items SET category = 'Implant' WHERE category = 'Chung' AND question ILIKE '%implant%';
