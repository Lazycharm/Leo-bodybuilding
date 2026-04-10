# LEO Body Building Gym

Standalone React/Vite frontend prepared for **Netlify hosting** and **Supabase** for auth, database, and storage-backed content.

## Stack

- `React 18` + `Vite`
- `Supabase` (`Auth`, `Postgres`, `Storage` ready)
- `@tanstack/react-query`
- `Tailwind CSS` + shadcn/ui components

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_STORAGE_BUCKET=leo-gym-media
   ```
3. Open your Supabase project and run `supabase/schema.sql` in the SQL editor.
4. Seed the tables with your gym data and create at least one admin profile.
5. Start the app:
   ```bash
   npm run dev
   ```

## Netlify deployment

This repo already includes:

- `netlify.toml`
- `public/_redirects`

Use these Netlify settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Add the same `VITE_SUPABASE_*` environment variables in the Netlify dashboard before deploying.

## Supabase notes

Recommended content tables are defined in `supabase/schema.sql`:

- `profiles`
- `announcements`
- `membership_plans`
- `memberships`
- `programs`
- `health_programs`
- `trainers`
- `gallery_items`
- `testimonials`
- `class_schedules`
- `bookings`
- `inquiries`

## Manual follow-up

- Create your first admin user in `profiles` by setting `role = 'admin'`
- Seed membership, program, trainer, and gallery data
- If you want managed uploads, create the `leo-gym-media` storage bucket in Supabase
- Review RLS policies in `supabase/schema.sql` before going live

