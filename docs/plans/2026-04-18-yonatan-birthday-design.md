# Yonatan Birthday Site — Design

**Date:** 2026-04-18
**Event:** Yonatan's 3rd birthday, Wed 22 April 2026, 10:00 AM, אצל דודה שחר, החליל 3, הרצליה.

## Goal
Hebrew-language (RTL) birthday celebration site for Yonatan, with:
- Landing page: hero + countdown + blessing form + sloth-fact generator + mission-details card + blessings feed + photo album + story timeline.
- `/invitation`: formal invite card with floating emoji animation + countdown.

Theme: sloth-pilot "rescue mission" (עצלן טייס, יחידת חילוץ).

## Stack
- Next.js 15 App Router + TypeScript.
- Tailwind CSS + shadcn/ui (Radix primitives).
- Supabase Postgres (blessings table) + Supabase Storage (bucket `blessings-media`).
- Deploy: Vercel.

## Data model
```sql
create table blessings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  media_url text,
  media_type text check (media_type in ('image','video')),
  created_at timestamptz not null default now(),
  approved boolean not null default true
);
create index on blessings (created_at desc);
```
RLS: anon SELECT where approved = true. INSERT only via server route (service-role key).

## Storage
- Bucket `blessings-media`, public read.
- Max 25 MB per upload. Accept `image/*`, `video/mp4`, `video/webm`.

## API
- `POST /api/blessings` — multipart form: name, message, optional file. Validates, uploads to storage, inserts row. Honeypot field + 1/min/IP rate limit (in-memory LRU).
- `GET /api/blessings` — lists approved, newest first.
- `GET /api/facts` — picks random fact from bundled JSON (~20 Hebrew facts).

## Content
- Photos in `public/photos/01.jpeg` … `13.jpeg`, captioned in Hebrew to match live site (supermen, rain adventurer, ocean explorer, etc.).
- Story timeline: 5 milestones (2023 birth, spring 2024 first steps, summer 2024 first words, 2025 age-2, 2026 age-3).
- Mission card (main page): 22 באפריל / 10:00 / הבסיס של יונתן / טייסים ועצלנים.
- Invitation card: full address + dress code.

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Out of scope
- Admin moderation UI (approved=true by default; can toggle in Supabase dashboard).
- Email notifications.
- Custom illustrations (placeholder SVG for now; user swaps later).
