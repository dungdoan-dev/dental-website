-- 1) The anon key is public, so the insert policy itself must enforce what the API validates.
-- 2) Replace doctor child rows in one transaction so a failed insert cannot wipe existing rows.
BEGIN;

REVOKE INSERT ON appointments FROM anon;
GRANT INSERT (name, phone, email, service_id, doctor_id, clinic_id, appointment_date, note) ON appointments TO anon;

DROP POLICY IF EXISTS "public_insert_appointment" ON appointments;
DROP POLICY IF EXISTS appointments_public_insert ON appointments;
CREATE POLICY appointments_public_insert ON appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(name) BETWEEN 2 AND 100
    AND phone ~ '^\+[1-9][0-9]{7,14}$'
    AND (email IS NULL OR char_length(email) <= 254)
    AND (note IS NULL OR char_length(note) <= 1200)
    AND clinic_id IS NOT NULL
  );

CREATE OR REPLACE FUNCTION public.replace_doctor_details(
  p_doctor_id TEXT,
  p_education TEXT[] DEFAULT NULL,
  p_specialties TEXT[] DEFAULT NULL,
  p_experience_highlights TEXT[] DEFAULT NULL,
  p_certificates JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  -- NULL means "leave this list unchanged".
  IF p_education IS NOT NULL THEN
    DELETE FROM doctor_education WHERE doctor_id = p_doctor_id;
    INSERT INTO doctor_education (doctor_id, content, sort_order)
    SELECT p_doctor_id, item, ord - 1 FROM unnest(p_education) WITH ORDINALITY AS t(item, ord);
  END IF;

  IF p_specialties IS NOT NULL THEN
    DELETE FROM doctor_specialties WHERE doctor_id = p_doctor_id;
    INSERT INTO doctor_specialties (doctor_id, specialty, sort_order)
    SELECT p_doctor_id, item, ord - 1 FROM unnest(p_specialties) WITH ORDINALITY AS t(item, ord);
  END IF;

  IF p_experience_highlights IS NOT NULL THEN
    DELETE FROM doctor_experience_highlights WHERE doctor_id = p_doctor_id;
    INSERT INTO doctor_experience_highlights (doctor_id, content, sort_order)
    SELECT p_doctor_id, item, ord - 1 FROM unnest(p_experience_highlights) WITH ORDINALITY AS t(item, ord);
  END IF;

  IF p_certificates IS NOT NULL THEN
    DELETE FROM doctor_certificates WHERE doctor_id = p_doctor_id;
    INSERT INTO doctor_certificates (doctor_id, title, issuer, detail, image, sort_order)
    SELECT p_doctor_id, c ->> 'title', c ->> 'issuer', COALESCE(c ->> 'detail', ''), c ->> 'image', ord - 1
    FROM jsonb_array_elements(p_certificates) WITH ORDINALITY AS t(c, ord);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.replace_doctor_details(TEXT, TEXT[], TEXT[], TEXT[], JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.replace_doctor_details(TEXT, TEXT[], TEXT[], TEXT[], JSONB) TO authenticated;

COMMIT;
