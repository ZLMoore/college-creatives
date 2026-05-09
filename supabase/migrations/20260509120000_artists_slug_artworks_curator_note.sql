-- Run in Supabase SQL editor or via migration tooling.
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS curator_note text;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS slug text UNIQUE;
