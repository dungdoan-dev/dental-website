-- Email liên hệ của từng cơ sở; dùng để hiển thị và nhận thông báo đặt lịch.
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE clinics SET email = 'focs1.nk2000@gmail.com' WHERE id = 'clinic-1';
UPDATE clinics SET email = 'focs2.nk2000@gmail.com' WHERE id = 'clinic-2';
