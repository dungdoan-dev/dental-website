BEGIN;

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA app_private TO service_role;

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS request_id UUID;
CREATE UNIQUE INDEX IF NOT EXISTS appointments_request_id_key ON public.appointments(request_id);
CREATE INDEX IF NOT EXISTS appointments_phone_created_idx ON public.appointments(phone, created_at DESC);

CREATE TABLE app_private.appointment_rate_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX ON app_private.appointment_rate_limits(expires_at);
ALTER TABLE app_private.appointment_rate_limits ENABLE ROW LEVEL SECURITY;
GRANT ALL ON app_private.appointment_rate_limits TO service_role;

CREATE TABLE public.appointment_notification_outbox (
  appointment_id BIGINT PRIMARY KEY REFERENCES public.appointments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointment_notification_outbox ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.appointment_notification_outbox TO authenticated;
GRANT ALL ON public.appointment_notification_outbox TO service_role;
CREATE POLICY admin_read ON public.appointment_notification_outbox FOR SELECT TO authenticated USING (public.is_admin_user());
CREATE INDEX ON public.appointment_notification_outbox(status, available_at);

-- All public bookings must pass through the server, which validates input before this service-only RPC.
DROP POLICY IF EXISTS appointments_public_insert ON public.appointments;
DROP POLICY IF EXISTS public_insert_appointment ON public.appointments;
REVOKE INSERT ON public.appointments FROM anon;
REVOKE INSERT (name,phone,email,service_id,doctor_id,clinic_id,appointment_date,note) ON public.appointments FROM anon;
GRANT ALL ON public.appointments TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.appointments_id_seq TO service_role;

CREATE OR REPLACE FUNCTION public.submit_appointment(p_data JSONB, p_request_id UUID, p_client_key TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  existing_id BIGINT;
  new_id BIGINT;
  limit_key TEXT;
  hits INTEGER;
BEGIN
  IF p_request_id IS NULL THEN RAISE EXCEPTION 'Missing request id' USING ERRCODE = '22023'; END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_data->>'phone', 0));
  SELECT id INTO existing_id FROM public.appointments WHERE request_id = p_request_id;
  IF existing_id IS NOT NULL THEN RETURN jsonb_build_object('created',false,'id',existing_id::TEXT); END IF;

  IF NOT EXISTS (SELECT 1 FROM public.clinics WHERE id = p_data->>'clinicId') THEN
    RAISE EXCEPTION 'Invalid clinic' USING ERRCODE = 'P0002';
  END IF;
  IF char_length(p_data->>'name') NOT BETWEEN 2 AND 100 OR coalesce(p_data->>'phone','') !~ '^\+[1-9][0-9]{7,14}$'
    OR (p_data->>'appointmentDate')::TIMESTAMPTZ < (now() AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE::TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh'
    OR coalesce(char_length(p_data->>'note'),0) > 1200 THEN
    RAISE EXCEPTION 'Invalid appointment' USING ERRCODE = '22023';
  END IF;

  SELECT id INTO existing_id FROM public.appointments
    WHERE phone = p_data->>'phone' AND clinic_id = p_data->>'clinicId'
      AND appointment_date = (p_data->>'appointmentDate')::TIMESTAMPTZ
      AND service_id IS NOT DISTINCT FROM nullif(p_data->>'serviceId','')
      AND created_at > now() - INTERVAL '10 minutes' AND status <> 'cancelled'
    ORDER BY id DESC LIMIT 1;
  IF existing_id IS NOT NULL THEN RETURN jsonb_build_object('created',false,'id',existing_id::TEXT); END IF;

  SELECT count(*) INTO hits FROM public.appointments WHERE phone = p_data->>'phone' AND created_at > now() - INTERVAL '1 hour';
  IF hits >= 3 THEN RAISE EXCEPTION 'Appointment rate limit' USING ERRCODE = 'P0001'; END IF;
  IF p_client_key IS NOT NULL THEN
    limit_key := 'ip:' || p_client_key;
    INSERT INTO app_private.appointment_rate_limits AS limits(key,attempts,expires_at)
      VALUES(limit_key,1,now()+INTERVAL '10 minutes')
      ON CONFLICT(key) DO UPDATE SET
        attempts = CASE WHEN limits.expires_at <= now() THEN 1 ELSE limits.attempts+1 END,
        expires_at = CASE WHEN limits.expires_at <= now() THEN now()+INTERVAL '10 minutes' ELSE limits.expires_at END
      RETURNING attempts INTO hits;
    IF hits > 10 THEN RAISE EXCEPTION 'Appointment rate limit' USING ERRCODE = 'P0001'; END IF;
    DELETE FROM app_private.appointment_rate_limits WHERE expires_at < now() - INTERVAL '1 day';
  END IF;

  INSERT INTO public.appointments(name,phone,email,service_id,doctor_id,clinic_id,appointment_date,note,request_id)
    VALUES(p_data->>'name',p_data->>'phone',nullif(p_data->>'email',''),nullif(p_data->>'serviceId',''),nullif(p_data->>'doctorId',''),
      p_data->>'clinicId',(p_data->>'appointmentDate')::TIMESTAMPTZ,nullif(p_data->>'note',''),p_request_id)
    RETURNING id INTO new_id;
  INSERT INTO public.appointment_notification_outbox(appointment_id) VALUES(new_id);
  RETURN jsonb_build_object('created',true,'id',new_id::TEXT);
END;
$$;
REVOKE ALL ON FUNCTION public.submit_appointment(JSONB,UUID,TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_appointment(JSONB,UUID,TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_appointment_notifications(p_limit INTEGER DEFAULT 5)
RETURNS SETOF public.appointment_notification_outbox LANGUAGE SQL SECURITY INVOKER SET search_path = '' AS $$
  UPDATE public.appointment_notification_outbox AS jobs SET status='sending',attempts=jobs.attempts+1,available_at=now()+INTERVAL '2 minutes'
  WHERE appointment_id IN (
    SELECT appointment_id FROM public.appointment_notification_outbox
    WHERE status IN ('pending','failed','sending') AND available_at <= now() AND attempts < 5
    ORDER BY created_at LIMIT least(greatest(p_limit,1),20) FOR UPDATE SKIP LOCKED
  ) RETURNING jobs.*;
$$;
REVOKE ALL ON FUNCTION public.claim_appointment_notifications(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_appointment_notifications(INTEGER) TO service_role;

COMMIT;
