-- Aggregate admin counters in the database to avoid several Data API round trips.
-- SECURITY INVOKER preserves the existing RLS policies on every table.
BEGIN;

CREATE OR REPLACE FUNCTION public.admin_dashboard_counts()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  RETURN jsonb_build_object(
    'services', (SELECT count(*) FROM public.services),
    'doctors', (SELECT count(*) FROM public.doctors),
    'published_articles', (SELECT count(*) FROM public.articles WHERE status = 'published'),
    'draft_articles', (SELECT count(*) FROM public.articles WHERE status = 'draft'),
    'pending_appointments', (SELECT count(*) FROM public.appointments WHERE status = 'pending'),
    'confirmed_appointments', (SELECT count(*) FROM public.appointments WHERE status = 'confirmed'),
    'slides', (SELECT count(*) FROM public.hero_slides),
    'clinics', (SELECT count(*) FROM public.clinics)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_appointment_status_counts(
  p_clinic_id TEXT DEFAULT NULL,
  p_name_query TEXT DEFAULT NULL,
  p_phone_query TEXT DEFAULT NULL,
  p_day DATE DEFAULT NULL
)
RETURNS TABLE(status TEXT, total BIGINT)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT a.status::TEXT, count(*)
  FROM public.appointments AS a
  WHERE (p_clinic_id IS NULL OR a.clinic_id = p_clinic_id)
    AND (p_name_query IS NULL OR a.name ILIKE '%' || p_name_query || '%'
      OR (p_phone_query IS NOT NULL AND a.phone ILIKE '%' || p_phone_query || '%'))
    AND (p_day IS NULL OR (
      a.appointment_date >= (p_day::TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')
      AND a.appointment_date < ((p_day + 1)::TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')
    ))
  GROUP BY a.status;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_dashboard_counts() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_appointment_status_counts(TEXT, TEXT, TEXT, DATE) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_appointment_status_counts(TEXT, TEXT, TEXT, DATE) TO authenticated;

COMMIT;
