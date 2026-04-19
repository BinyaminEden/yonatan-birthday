-- Run in Supabase SQL editor.
-- Adds a separate table for party-day album uploads (photos/videos) that
-- is distinct from blessings — no required name/message.

create table if not exists public.album_items (
  id uuid primary key default gen_random_uuid(),
  uploader_name text,
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  created_at timestamptz not null default now(),
  approved boolean not null default true
);

create index if not exists album_items_created_at_desc
  on public.album_items (created_at desc);

alter table public.album_items enable row level security;

drop policy if exists "public read approved" on public.album_items;
create policy "public read approved"
  on public.album_items
  for select
  to anon, authenticated
  using (approved = true);

-- Inserts go through the server route using the service role key.
