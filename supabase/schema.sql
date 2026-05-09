create extension if not exists "pgcrypto";

create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  school text not null,
  major text not null,
  medium text not null,
  bio text not null,
  portfolio_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  stripe_account_id text,
  slug text unique,
  created_at timestamptz not null default now()
);

create table if not exists artworks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references artists(id) on delete cascade,
  title text not null,
  description text not null,
  price integer not null check (price > 0),
  printful_product_id text,
  image_url text not null,
  curator_note text,
  medium text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks(id) on delete restrict,
  buyer_email text not null,
  amount integer not null check (amount > 0),
  stripe_payment_id text,
  printful_order_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_artists_status on artists(status);
create index if not exists idx_artworks_status on artworks(status);
create index if not exists idx_orders_status on orders(status);
