-- Add explicit ordering for doctors after the current doctor import migration.
-- The backfill preserves the current experience-based order. Lower values first.
ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS doctors_sort_order_idx ON doctors (sort_order, id);

WITH ranked_doctors AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY experience DESC, id ASC) * 10 AS sort_order
  FROM doctors
)
UPDATE doctors AS doctor
SET sort_order = ranked_doctors.sort_order
FROM ranked_doctors
WHERE doctor.id = ranked_doctors.id
  AND doctor.sort_order = 0;
