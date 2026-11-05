-- Chọn câu hỏi hiển thị ở trang chủ và trang Giới thiệu (trang Hỏi đáp luôn hiện tất cả).
-- Giữ nguyên hiện trạng: trang chủ = 4 câu đầu, Giới thiệu = tất cả.
ALTER TABLE faq_items ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE faq_items ADD COLUMN IF NOT EXISTS show_on_about BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE faq_items SET show_on_about = TRUE;
UPDATE faq_items SET show_on_home = TRUE
WHERE id IN (SELECT id FROM faq_items ORDER BY sort_order, id LIMIT 4);
