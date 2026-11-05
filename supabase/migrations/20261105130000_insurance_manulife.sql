-- Thêm đối tác bảo hiểm Manulife (logo: /images/insurance_logos/MANULIFE.png).
INSERT INTO insurance_partners (code, name, description, accent, sort_order, logo_src)
VALUES ('MANULIFE', 'Manulife', 'Bảo hiểm Manulife', 'green', (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM insurance_partners), '/images/insurance_logos/MANULIFE.png')
ON CONFLICT (code) DO UPDATE SET logo_src = EXCLUDED.logo_src;
