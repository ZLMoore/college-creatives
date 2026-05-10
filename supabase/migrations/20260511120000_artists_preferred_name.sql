-- Optional display name from artist applications.
ALTER TABLE artists ADD COLUMN IF NOT EXISTS preferred_name text;
