# יונתן בן 3 🦥✈️ — birthday site

Hebrew-language (RTL) celebration site for Yonatan's 3rd birthday (Wed 22 Apr 2026, 10:00, אצל דודה שחר, החליל 3, הרצליה).

## What's in it

- `/` — hero + countdown + blessing form + sloth-fact generator + mission details + blessings feed + photo album + story timeline.
- `/invitation` — formal invite card with floating emoji animation + countdown.
- `POST /api/blessings`, `GET /api/blessings` — blessing submission + listing.
- `GET /api/facts` — random Yonatan-sloth fact.

Stack: Next.js 16, TypeScript, Tailwind v4, Radix via shadcn patterns, Supabase (Postgres + Storage), Rubik Google font.

---

## 1. Supabase setup (5 min)

1. Create a project at https://supabase.com/dashboard (free tier is fine).
2. In the project → **SQL Editor**, paste `supabase/migrations/001_blessings.sql` and run it. That creates:
   - `public.blessings` table + index + RLS policy.
   - `blessings-media` public storage bucket + read policy.
3. Project Settings → **API**. Copy these three values into a `.env.local` file in the `web/` directory (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...      # KEEP SECRET — server only
```

## 2. Run locally

```bash
cd web
npm install            # first time only
npm run dev            # → http://localhost:3000
```

## 3. Deploy to Vercel

```bash
npx vercel              # link project (first time)
npx vercel --prod       # deploy
```

In the Vercel dashboard, add the three env vars from step 1 (Production + Preview).

## 4. Day-of moderation

Blessings default to `approved = true`, so they're public immediately. To hide one:
- Supabase dashboard → Table Editor → `blessings` → toggle `approved` to false.
- The feed refetches on every visit (`revalidate = 0`).

---

## Content knobs

- `src/lib/constants.ts` — date, time, location, dress code.
- `src/lib/photos.ts` — photo list + captions. Files live in `public/photos/`.
- `src/lib/story.ts` — 5-milestone timeline.
- `src/lib/facts.ts` — Yonatan-sloth facts.
- `src/components/sloth-pilot.tsx` — SVG mascot (swap for a custom PNG later).

## File layout

```
web/
  src/
    app/
      layout.tsx            # RTL + Rubik font
      page.tsx              # main landing
      invitation/page.tsx   # /invitation
      api/
        blessings/route.ts  # POST + GET
        facts/route.ts      # GET random
    components/             # hero, countdown, forms, album, timeline, footer, floating-emojis, sloth-pilot
    lib/                    # supabase clients, rate-limit, constants, photos, story, facts
  public/photos/            # 01.jpeg … 13.jpeg
  supabase/migrations/      # 001_blessings.sql
```
