-- The placeholder article "test-bai-viet" was published and listed in the sitemap; keep it as a draft instead of deleting it.
UPDATE articles SET status = 'draft', updated_at = NOW() WHERE slug = 'test-bai-viet' AND status = 'published';
