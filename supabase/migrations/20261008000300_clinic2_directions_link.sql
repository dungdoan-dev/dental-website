-- Set the Google Maps directions destination for clinic 2 (CS2).
-- Additive and safe to run more than once.
UPDATE clinics
SET google_maps_url = 'https://maps.app.goo.gl/vF23xVpQzbmhWs1u6'
WHERE id = 'clinic-2';
