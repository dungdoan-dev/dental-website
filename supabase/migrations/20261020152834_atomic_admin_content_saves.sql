BEGIN;

CREATE OR REPLACE FUNCTION public.admin_save_content(p_kind TEXT, p_data JSONB, p_title TEXT, p_snapshot JSONB DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  s public.services%ROWTYPE;
  d public.doctors%ROWTYPE;
  a public.articles%ROWTYPE;
  h public.hero_slides%ROWTYPE;
  entity TEXT;
  previous_status TEXT;
  previous_published TIMESTAMPTZ;
  site_key TEXT;
  phone_record JSONB;
  revision_kind TEXT := p_kind;
BEGIN
  IF NOT public.is_admin_user() THEN RAISE EXCEPTION 'Administrator access required' USING ERRCODE='42501'; END IF;
  IF p_kind NOT IN ('service','doctor','article','slider','site-content','service-detail','contact-cta') THEN
    RAISE EXCEPTION 'Unsupported content kind' USING ERRCODE='22023';
  END IF;
  entity := coalesce(p_data->'record'->>'id',p_data->>'key',p_data->>'serviceId','');
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_kind || ':' || entity, 0));

  IF p_kind = 'service' THEN
    s := jsonb_populate_record(NULL::public.services,p_data->'record');
    INSERT INTO public.services(id,name,slug,short_description,description,image,badge,badge_variant,featured,category,sort_order)
      VALUES(s.id,s.name,s.slug,s.short_description,s.description,s.image,s.badge,s.badge_variant,s.featured,s.category,0)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,slug=excluded.slug,short_description=excluded.short_description,
        description=excluded.description,image=excluded.image,badge=excluded.badge,badge_variant=excluded.badge_variant,
        featured=excluded.featured,category=excluded.category,updated_at=now();
  ELSIF p_kind = 'doctor' THEN
    d := jsonb_populate_record(NULL::public.doctors,p_data->'record');
    INSERT INTO public.doctors(id,name,slug,avatar,position,experience,sort_order,degree,description,badge,highlight,category,directory_title,license_number,quote,languages,source_url)
      VALUES(d.id,d.name,d.slug,d.avatar,d.position,d.experience,d.sort_order,d.degree,d.description,d.badge,d.highlight,d.category,d.directory_title,d.license_number,d.quote,d.languages,d.source_url)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,slug=excluded.slug,avatar=excluded.avatar,position=excluded.position,
        experience=excluded.experience,sort_order=excluded.sort_order,degree=excluded.degree,description=excluded.description,
        badge=excluded.badge,highlight=excluded.highlight,category=excluded.category,directory_title=excluded.directory_title,
        license_number=excluded.license_number,quote=excluded.quote,languages=excluded.languages,source_url=excluded.source_url,updated_at=now();
    PERFORM public.replace_doctor_details(d.id,
      CASE WHEN jsonb_typeof(p_data->'education')='array' THEN ARRAY(SELECT jsonb_array_elements_text(p_data->'education')) ELSE NULL END,
      CASE WHEN jsonb_typeof(p_data->'specialties')='array' THEN ARRAY(SELECT jsonb_array_elements_text(p_data->'specialties')) ELSE NULL END,
      CASE WHEN jsonb_typeof(p_data->'experienceHighlights')='array' THEN ARRAY(SELECT jsonb_array_elements_text(p_data->'experienceHighlights')) ELSE NULL END,
      CASE WHEN jsonb_typeof(p_data->'certificates')='array' THEN p_data->'certificates' ELSE NULL END);
  ELSIF p_kind = 'article' THEN
    a := jsonb_populate_record(NULL::public.articles,p_data->'record');
    SELECT status::TEXT,published_at INTO previous_status,previous_published FROM public.articles WHERE id=a.id FOR UPDATE;
    a.published_at := CASE WHEN a.status::TEXT='published' AND previous_status IS DISTINCT FROM 'published' THEN now() ELSE coalesce(previous_published,now()) END;
    INSERT INTO public.articles(id,title,slug,excerpt,content,thumbnail,published_at,author,category,reading_minutes,featured,status)
      VALUES(a.id,a.title,a.slug,a.excerpt,a.content,a.thumbnail,a.published_at,a.author,a.category,a.reading_minutes,a.featured,a.status)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,excerpt=excluded.excerpt,content=excluded.content,
        thumbnail=excluded.thumbnail,published_at=excluded.published_at,author=excluded.author,category=excluded.category,
        reading_minutes=excluded.reading_minutes,featured=excluded.featured,status=excluded.status,updated_at=now();
  ELSIF p_kind = 'slider' THEN
    h := jsonb_populate_record(NULL::public.hero_slides,p_data->'record');
    INSERT INTO public.hero_slides(id,image,image_alt,badge,title,badge_variant,object_position,sort_order)
      VALUES(h.id,h.image,h.image_alt,'',h.title,'blue',h.object_position,h.sort_order)
      ON CONFLICT(id) DO UPDATE SET image=excluded.image,image_alt=excluded.image_alt,title=excluded.title,
        object_position=excluded.object_position,sort_order=excluded.sort_order;
  ELSE
    revision_kind := 'site-content';
    IF p_kind = 'service-detail' THEN
      SELECT * INTO s FROM public.services WHERE id=p_data->>'serviceId' FOR UPDATE;
      IF s.id IS NULL THEN RAISE EXCEPTION 'Service not found' USING ERRCODE='P0002'; END IF;
      site_key := 'service_detail_' || s.id;
      UPDATE public.services SET image=p_data->>'image',updated_at=now() WHERE id=s.id;
    ELSE
      site_key := p_data->>'key';
    END IF;
    IF p_kind = 'contact-cta' THEN
      site_key := 'contact_cta';
      FOR phone_record IN SELECT * FROM jsonb_array_elements(p_data->'phones') LOOP
        UPDATE public.clinics SET phone=phone_record->>'phone',updated_at=now() WHERE id=phone_record->>'id';
        IF NOT FOUND THEN RAISE EXCEPTION 'Clinic not found' USING ERRCODE='P0002'; END IF;
      END LOOP;
    END IF;
    INSERT INTO public.site_content(key,content) VALUES(site_key,p_data->'content')
      ON CONFLICT(key) DO UPDATE SET content=excluded.content;
    entity := site_key;
  END IF;
  INSERT INTO public.admin_content_revisions(kind,entity_id,title,snapshot,actor)
    VALUES(revision_kind,entity,p_title,coalesce(p_snapshot,p_data),coalesce(auth.jwt()->>'email','admin'));
  RETURN jsonb_build_object('id',entity,'slug',coalesce(s.slug,d.slug,a.slug),'publishedAt',a.published_at);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_save_content(TEXT,JSONB,TEXT,JSONB) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.admin_save_content(TEXT,JSONB,TEXT,JSONB) TO authenticated;

COMMIT;
