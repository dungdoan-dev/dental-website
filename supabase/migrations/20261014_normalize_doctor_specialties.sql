-- Keep doctor specialties in the relation table only. Preserve legacy values first.
BEGIN;

WITH legacy_specialties AS (
  SELECT
    d.id AS doctor_id,
    btrim(parts.specialty) AS specialty,
    parts.ordinality::INTEGER AS sort_order
  FROM public.doctors AS d
  CROSS JOIN LATERAL regexp_split_to_table(d.specialty, '[[:space:]]*[·•,;|][[:space:]]*')
    WITH ORDINALITY AS parts(specialty, ordinality)
  WHERE btrim(parts.specialty) <> ''
    AND NOT EXISTS (
      SELECT 1
      FROM public.doctor_specialties AS existing
      WHERE existing.doctor_id = d.id
    )
)
INSERT INTO public.doctor_specialties (doctor_id, specialty, sort_order)
SELECT doctor_id, specialty, sort_order
FROM legacy_specialties;

ALTER TABLE public.doctors DROP COLUMN IF EXISTS specialty;

COMMIT;
