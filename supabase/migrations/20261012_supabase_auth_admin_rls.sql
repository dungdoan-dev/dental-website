-- Move application access to the Supabase Data API and Supabase Auth.
-- Admin users must have app_metadata.role = 'admin' in Supabase Auth.
BEGIN;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role' = 'admin', FALSE);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.appointments_id_seq TO anon;

-- Public website content remains readable via anon; authenticated admins can manage it.
GRANT SELECT ON clinics, clinic_facilities, services, doctors, doctor_specialties,
  doctor_education, doctor_experience_highlights, doctor_certificates, articles,
  testimonials, faq_items, hero_slides, core_values, insurance_partners, site_content
  TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON clinics, clinic_facilities, services, doctors,
  doctor_specialties, doctor_education, doctor_experience_highlights,
  doctor_certificates, articles, testimonials, faq_items, hero_slides,
  core_values, insurance_partners, site_content TO authenticated;

DROP POLICY IF EXISTS public_read ON articles;
DROP POLICY IF EXISTS articles_public_read ON articles;
CREATE POLICY articles_public_read ON articles
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at <= NOW());

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'clinics', 'clinic_facilities', 'services', 'doctors', 'doctor_specialties',
    'doctor_education', 'doctor_experience_highlights', 'doctor_certificates',
    'testimonials', 'faq_items', 'hero_slides', 'core_values',
    'insurance_partners', 'site_content'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS admin_manage_authenticated ON public.%I', table_name);
    EXECUTE format(
      'CREATE POLICY admin_manage_authenticated ON public.%I FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())',
      table_name
    );
  END LOOP;
END $$;

DROP POLICY IF EXISTS admin_manage_authenticated ON articles;
CREATE POLICY admin_manage_authenticated ON articles
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Appointment creation is public, but reading or managing appointments is admin-only.
GRANT INSERT ON appointments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON appointments TO authenticated;
DROP POLICY IF EXISTS admin_manage_authenticated ON appointments;
CREATE POLICY admin_manage_authenticated ON appointments
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admin history is private to authenticated administrators.
GRANT SELECT, INSERT ON admin_content_revisions TO authenticated;
DROP POLICY IF EXISTS admin_manage_authenticated ON admin_content_revisions;
CREATE POLICY admin_manage_authenticated ON admin_content_revisions
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Public bucket reads stay public; uploads and object management require admin Auth.
DROP POLICY IF EXISTS site_media_admin_insert ON storage.objects;
CREATE POLICY site_media_admin_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin_user());
DROP POLICY IF EXISTS site_media_admin_update ON storage.objects;
CREATE POLICY site_media_admin_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'site-media' AND public.is_admin_user());
DROP POLICY IF EXISTS site_media_admin_delete ON storage.objects;
CREATE POLICY site_media_admin_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.is_admin_user());

COMMIT;
