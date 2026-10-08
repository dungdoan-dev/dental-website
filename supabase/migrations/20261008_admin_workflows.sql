-- Apply after the existing content migrations. Additive; preserves existing articles.
BEGIN;

DO $$ BEGIN
  CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE articles ADD COLUMN IF NOT EXISTS status "ArticleStatus" NOT NULL DEFAULT 'published';
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);

CREATE TABLE IF NOT EXISTS admin_content_revisions (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  actor TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS admin_content_revisions_created_at_idx ON admin_content_revisions(created_at DESC);

CREATE TABLE IF NOT EXISTS admin_login_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL CHECK (attempts > 0),
  reset_at TIMESTAMPTZ NOT NULL
);

-- Internal admin data is never readable/writable through public Supabase API roles.
ALTER TABLE admin_content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_login_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON admin_content_revisions, admin_login_limits FROM anon, authenticated;
REVOKE ALL ON SEQUENCE admin_content_revisions_id_seq FROM anon, authenticated;

-- Public API reads must also hide drafts. Prisma server connections enforce the same filter.
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read" ON articles;
DROP POLICY IF EXISTS "articles_public_read" ON articles;
CREATE POLICY "articles_public_read" ON articles FOR SELECT TO anon, authenticated USING (status = 'published');

COMMIT;
