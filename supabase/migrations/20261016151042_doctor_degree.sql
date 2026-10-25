-- Doctor cards show: degree (học vị) / name / position (chức vị, optional) / directory_title (chuyên môn).
-- Replaces the old name_lines + name_line_2 split. Those columns are left in place (unused) so code
-- still running from before this migration keeps working; drop them in a later migration.
BEGIN;

ALTER TABLE doctors ADD COLUMN IF NOT EXISTS degree TEXT NOT NULL DEFAULT '';

-- Two-line names: the first line held the degree, the second line the person's name.
UPDATE doctors
SET degree = trim(name), name = trim(name_line_2)
WHERE degree = '' AND name_lines = 2 AND coalesce(trim(name_line_2), '') <> '';

-- One-line names: split leading degree tokens such as "BS.", "BS. CKI", "ThS.BS.CKII".
UPDATE doctors
SET degree = trim(substring(name FROM '^((?:(?:(?:[A-Za-z]+\.)+[A-Za-z]*|[A-Z]{2,})\s*)+)')),
    name = trim(regexp_replace(name, '^((?:(?:[A-Za-z]+\.)+[A-Za-z]*|[A-Z]{2,})\s*)+', ''))
WHERE degree = ''
  AND name ~ '^((?:(?:[A-Za-z]+\.)+[A-Za-z]*|[A-Z]{2,})\s*)+'
  AND trim(regexp_replace(name, '^((?:(?:[A-Za-z]+\.)+[A-Za-z]*|[A-Z]{2,})\s*)+', '')) <> '';

COMMIT;
