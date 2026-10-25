-- Set the Google Maps directions destination for clinic 1 (CS1).
-- Additive and safe to run more than once.
UPDATE clinics
SET google_maps_url = 'https://maps.app.goo.gl/6dthSmZEqV8Ct3Uo7'
WHERE id = 'clinic-1';
