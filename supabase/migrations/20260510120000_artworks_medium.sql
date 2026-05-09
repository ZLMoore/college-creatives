-- Run in Supabase SQL editor (project: anebdfwokdfqovlqmmst) or via CLI.
ALTER TABLE artworks ADD COLUMN IF NOT EXISTS medium text;

-- Seeded / common demo titles (exact and pattern matches)
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'The Starry Night';
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'Starry Night Over the Rhône';
UPDATE artworks SET medium = 'Oil Painting' WHERE title ILIKE 'Starry Night Over the Rhone%';
UPDATE artworks SET medium = 'Oil Painting' WHERE title ILIKE '%Sunflowers%';
UPDATE artworks SET medium = 'Pen & Ink' WHERE title ILIKE '%Vitruvian Man%';
UPDATE artworks SET medium = 'Oil Painting' WHERE title ILIKE '%Last Supper%';
UPDATE artworks SET medium = 'Ink Wash' WHERE title ILIKE '%Great Wave%';
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'Composition VIII';

-- Other demo seed titles from lib/seed-artists.ts
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'Self-Portrait with Palette';
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'Mona Lisa';
UPDATE artworks SET medium = 'Oil Painting' WHERE title = 'Creation of Adam';
