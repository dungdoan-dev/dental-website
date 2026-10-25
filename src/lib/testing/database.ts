import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

export const migration = (name: string) => readFileSync(new URL(`../../../supabase/migrations/${name}`, import.meta.url), "utf8");

export async function testDatabase() {
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.jwt() RETURNS JSONB LANGUAGE SQL STABLE AS $$
      SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::JSONB;
    $$;
    GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;
    CREATE FUNCTION public.is_admin_user() RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
      SELECT coalesce(auth.jwt()->'app_metadata'->>'role'='admin',false);
    $$;
  `);
  await db.exec(migration("20261006000000_init.sql").split("-- SECTION 4:")[0]);
  await db.exec(`
    ALTER TABLE doctors ADD COLUMN degree TEXT NOT NULL DEFAULT '';
    ALTER TABLE doctors ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE doctors DROP COLUMN specialty;
    ALTER TABLE services ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE articles ADD COLUMN status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft','published'));
    CREATE TABLE site_content(key TEXT PRIMARY KEY, content JSONB NOT NULL);
    CREATE TABLE admin_content_revisions(id BIGSERIAL PRIMARY KEY,kind TEXT NOT NULL,entity_id TEXT NOT NULL,title TEXT NOT NULL,snapshot JSONB NOT NULL,actor TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
    GRANT ALL ON SCHEMA public TO service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role,authenticated;
    GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role,authenticated;
    GRANT INSERT ON appointments TO anon;
    INSERT INTO clinics(id,name,slug,label,badge,address,phone,image,description,working_hours,accent)
    VALUES('clinic-test','Test clinic','clinic-test','Test','','Test address','+84912345678','/images/test.jpg','','08:00–20:00','blue');
  `);
  return db;
}
