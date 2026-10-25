-- Spell out and uppercase doctor degrees in the data:
-- "ThS.BS.CKII" -> "THẠC SĨ, BÁC SĨ CKII", "BS. CKI" -> "BÁC SĨ CKI", "BS." -> "BÁC SĨ".
-- Runs after 20261016151042_doctor_degree.sql. Safe to re-run, including on rows already spelled out as "Thạc sĩ"/"Bác sĩ".
-- Vietnamese letters are replaced literally because upper() may not uppercase them under a C collation.
BEGIN;

UPDATE doctors
SET degree = rtrim(trim(
  regexp_replace(
    regexp_replace(
      upper(replace(replace(degree, 'Thạc sĩ', 'THẠC SĨ'), 'Bác sĩ', 'BÁC SĨ')),
      '\mTHS\.?\s*', 'THẠC SĨ, ', 'g'),
    '\mBS\.?\s*', 'BÁC SĨ ', 'g')
), ',')
WHERE degree <> '';

COMMIT;
