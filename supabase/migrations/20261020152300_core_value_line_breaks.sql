-- Manual line breaks for three core value descriptions (rendered with whitespace-pre-line).
-- "care" (TẬN TÂM) is unchanged. Keyed by icon_key so a renamed title does not break the match.
BEGIN;

UPDATE core_values SET description = E'Cảm giác thân thương là điều\nNha Khoa 2000 muốn mang lại cho\nKhách hàng cũng như cho đội ngũ\nnhân viên làm việc tại nha khoa.' WHERE icon_key = 'heart';
UPDATE core_values SET description = E'Trung thực với chính mình,\nTrung thực với khách hàng,\nTrung thực với đối tác\nLà giá trị mà chúng tôi luôn theo đuổi' WHERE icon_key = 'honesty';
UPDATE core_values SET description = E'Chúng tôi luôn nỗ lực nắm bắt\nXu hướng mới nhất của thế giới.\nTừ máy móc trang thiết bị, tới\nPhương pháp điều trị hiện đại nhất' WHERE icon_key = 'innovation';

COMMIT;
