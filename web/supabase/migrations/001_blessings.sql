-- Run in Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.blessings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  media_url text,
  media_type text check (media_type in ('image','video')),
  created_at timestamptz not null default now(),
  approved boolean not null default true
);

create index if not exists blessings_created_at_desc on public.blessings (created_at desc);

alter table public.blessings enable row level security;

-- Anon can read approved rows only.
drop policy if exists "public read approved" on public.blessings;
create policy "public read approved"
  on public.blessings
  for select
  to anon, authenticated
  using (approved = true);

-- Inserts must go through the server route (service role bypasses RLS).
-- No insert policy for anon/authenticated on purpose.

-- Storage bucket: run in SQL editor or Studio.
insert into storage.buckets (id, name, public)
values ('blessings-media', 'blessings-media', true)
on conflict (id) do nothing;

drop policy if exists "public read blessings-media" on storage.objects;
create policy "public read blessings-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blessings-media');
