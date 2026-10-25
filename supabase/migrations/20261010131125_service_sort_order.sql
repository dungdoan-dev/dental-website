-- Add explicit ordering for services; preserve current ID order for existing records.
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS services_sort_order_idx ON services (sort_order, id);

WITH ranked_services AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id ASC) * 10 AS sort_order
  FROM services
)
UPDATE services AS service
SET sort_order = ranked_services.sort_order
FROM ranked_services
WHERE service.id = ranked_services.id
  AND service.sort_order = 0;
