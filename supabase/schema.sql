-- LEO Gym standalone Supabase schema
-- Run this file in the Supabase SQL editor before connecting the app.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'trainer', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  content_en text not null,
  content_ar text,
  type text not null default 'general' check (type in ('general', 'offer', 'event', 'maintenance', 'urgent')),
  is_active boolean not null default true,
  expires_at timestamptz,
  target_audience text not null default 'all' check (target_audience in ('all', 'members', 'visitors')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  hero_image_url text,
  gents_image_url text,
  ladies_image_url text,
  male_trainer_image_url text,
  female_trainer_image_url text,
  gallery_preview_images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  price numeric(10,2) not null default 0,
  duration_months integer not null default 1,
  features_en text[] not null default '{}',
  features_ar text[] not null default '{}',
  is_popular boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  gender text not null default 'all' check (gender in ('all', 'male', 'female')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  short_desc_en text,
  short_desc_ar text,
  image_url text,
  icon text,
  category text check (category in ('strength', 'cardio', 'flexibility', 'group', 'personal')),
  gender text not null default 'all' check (gender in ('all', 'male', 'female')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_programs (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  short_desc_en text,
  short_desc_ar text,
  image_url text,
  icon text,
  target_condition text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text,
  title_en text,
  title_ar text,
  bio_en text,
  bio_ar text,
  specialties_en text[] not null default '{}',
  specialties_ar text[] not null default '{}',
  photo_url text,
  gender text check (gender in ('male', 'female')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  certifications text[] not null default '{}',
  experience_years integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title_en text,
  title_ar text,
  image_url text not null,
  category text check (category in ('facility', 'training', 'transformation', 'event', 'equipment')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text,
  text_en text not null,
  text_ar text,
  photo_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  program_en text,
  program_ar text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  class_name_en text not null,
  class_name_ar text,
  trainer_id uuid references public.trainers(id) on delete set null,
  day_of_week text not null check (day_of_week in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time text not null,
  end_time text not null,
  capacity integer not null default 20,
  gender text not null default 'all' check (gender in ('all', 'male', 'female')),
  location_en text,
  location_ar text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  type text not null default 'general' check (type in ('membership', 'trial', 'general', 'booking', 'complaint', 'upgrade')),
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved', 'closed')),
  plan_interest text,
  source text not null default 'website' check (source in ('website', 'whatsapp', 'walk-in', 'referral', 'social')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  user_email text not null,
  plan_id uuid references public.membership_plans(id) on delete set null,
  plan_name text,
  status text not null default 'pending' check (status in ('active', 'expired', 'pending', 'cancelled', 'frozen')),
  start_date date,
  end_date date,
  amount_paid numeric(10,2),
  payment_method text check (payment_method in ('cash', 'card', 'bank_transfer', 'online')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  user_email text not null,
  class_id uuid references public.class_schedules(id) on delete cascade,
  class_name text,
  date date,
  status text not null default 'pending' check (status in ('confirmed', 'pending', 'cancelled', 'attended', 'no_show')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_site_settings_key on public.site_settings(setting_key);
create index if not exists idx_memberships_user_id on public.memberships(user_id);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_announcements_active on public.announcements(is_active);
create index if not exists idx_programs_active on public.programs(is_active);
create index if not exists idx_health_programs_active on public.health_programs(is_active);
create index if not exists idx_trainers_active on public.trainers(is_active);
create index if not exists idx_gallery_items_active on public.gallery_items(is_active);
create index if not exists idx_testimonials_active on public.testimonials(is_active);
create index if not exists idx_class_schedules_active on public.class_schedules(is_active);

drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_announcements_updated_at on public.announcements;
drop trigger if exists set_site_settings_updated_at on public.site_settings;
drop trigger if exists set_membership_plans_updated_at on public.membership_plans;
drop trigger if exists set_programs_updated_at on public.programs;
drop trigger if exists set_health_programs_updated_at on public.health_programs;
drop trigger if exists set_trainers_updated_at on public.trainers;
drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
drop trigger if exists set_testimonials_updated_at on public.testimonials;
drop trigger if exists set_class_schedules_updated_at on public.class_schedules;
drop trigger if exists set_inquiries_updated_at on public.inquiries;
drop trigger if exists set_memberships_updated_at on public.memberships;
drop trigger if exists set_bookings_updated_at on public.bookings;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_announcements_updated_at before update on public.announcements for each row execute procedure public.set_updated_at();
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute procedure public.set_updated_at();
create trigger set_membership_plans_updated_at before update on public.membership_plans for each row execute procedure public.set_updated_at();
create trigger set_programs_updated_at before update on public.programs for each row execute procedure public.set_updated_at();
create trigger set_health_programs_updated_at before update on public.health_programs for each row execute procedure public.set_updated_at();
create trigger set_trainers_updated_at before update on public.trainers for each row execute procedure public.set_updated_at();
create trigger set_gallery_items_updated_at before update on public.gallery_items for each row execute procedure public.set_updated_at();
create trigger set_testimonials_updated_at before update on public.testimonials for each row execute procedure public.set_updated_at();
create trigger set_class_schedules_updated_at before update on public.class_schedules for each row execute procedure public.set_updated_at();
create trigger set_inquiries_updated_at before update on public.inquiries for each row execute procedure public.set_updated_at();
create trigger set_memberships_updated_at before update on public.memberships for each row execute procedure public.set_updated_at();
create trigger set_bookings_updated_at before update on public.bookings for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;
alter table public.membership_plans enable row level security;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update
set public = excluded.public;
alter table public.programs enable row level security;
alter table public.health_programs enable row level security;
alter table public.trainers enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.class_schedules enable row level security;
alter table public.inquiries enable row level security;
alter table public.memberships enable row level security;
alter table public.bookings enable row level security;

-- Profiles
drop policy if exists "profiles select own or admin" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own or admin" on public.profiles;

create policy "profiles select own or admin" on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy "profiles insert own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles update own or admin" on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- Public content
drop policy if exists "public read announcements" on public.announcements;
drop policy if exists "admin manage announcements" on public.announcements;
drop policy if exists "public read site settings" on public.site_settings;
drop policy if exists "admin manage site settings" on public.site_settings;
drop policy if exists "public read site media objects" on storage.objects;
drop policy if exists "admin insert site media objects" on storage.objects;
drop policy if exists "admin update site media objects" on storage.objects;
drop policy if exists "admin delete site media objects" on storage.objects;
drop policy if exists "public read plans" on public.membership_plans;
drop policy if exists "admin manage plans" on public.membership_plans;
drop policy if exists "public read programs" on public.programs;
drop policy if exists "admin manage programs" on public.programs;
drop policy if exists "public read health programs" on public.health_programs;
drop policy if exists "admin manage health programs" on public.health_programs;
drop policy if exists "public read trainers" on public.trainers;
drop policy if exists "admin manage trainers" on public.trainers;
drop policy if exists "public read gallery items" on public.gallery_items;
drop policy if exists "admin manage gallery items" on public.gallery_items;
drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "admin manage testimonials" on public.testimonials;
drop policy if exists "public read class schedules" on public.class_schedules;
drop policy if exists "admin manage class schedules" on public.class_schedules;

drop policy if exists "public create inquiries" on public.inquiries;
drop policy if exists "admin manage inquiries" on public.inquiries;

drop policy if exists "members read own memberships" on public.memberships;
drop policy if exists "admin manage memberships" on public.memberships;

drop policy if exists "members read own bookings" on public.bookings;
drop policy if exists "members insert own bookings" on public.bookings;
drop policy if exists "members update own bookings" on public.bookings;
drop policy if exists "admin delete bookings" on public.bookings;

create policy "public read announcements" on public.announcements
for select using (is_active = true or public.is_admin());
create policy "admin manage announcements" on public.announcements
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read site settings" on public.site_settings
for select using (true);
create policy "admin manage site settings" on public.site_settings
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read site media objects" on storage.objects
for select to public
using (bucket_id = 'site-media');
create policy "admin insert site media objects" on storage.objects
for insert to authenticated
with check (bucket_id = 'site-media' and public.is_admin());
create policy "admin update site media objects" on storage.objects
for update to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());
create policy "admin delete site media objects" on storage.objects
for delete to authenticated
using (bucket_id = 'site-media' and public.is_admin());

create policy "public read plans" on public.membership_plans
for select using (is_active = true or public.is_admin());
create policy "admin manage plans" on public.membership_plans
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read programs" on public.programs
for select using (is_active = true or public.is_admin());
create policy "admin manage programs" on public.programs
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read health programs" on public.health_programs
for select using (is_active = true or public.is_admin());
create policy "admin manage health programs" on public.health_programs
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read trainers" on public.trainers
for select using (is_active = true or public.is_admin());
create policy "admin manage trainers" on public.trainers
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read gallery items" on public.gallery_items
for select using (is_active = true or public.is_admin());
create policy "admin manage gallery items" on public.gallery_items
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read testimonials" on public.testimonials
for select using (is_active = true or public.is_admin());
create policy "admin manage testimonials" on public.testimonials
for all using (public.is_admin()) with check (public.is_admin());

create policy "public read class schedules" on public.class_schedules
for select using (is_active = true or public.is_admin());
create policy "admin manage class schedules" on public.class_schedules
for all using (public.is_admin()) with check (public.is_admin());

-- Inquiries
create policy "public create inquiries" on public.inquiries
for insert with check (true);
create policy "admin manage inquiries" on public.inquiries
for all using (public.is_admin()) with check (public.is_admin());

-- Memberships
create policy "members read own memberships" on public.memberships
for select using (user_id = auth.uid() or public.is_admin());
create policy "admin manage memberships" on public.memberships
for all using (public.is_admin()) with check (public.is_admin());

-- Bookings
create policy "members read own bookings" on public.bookings
for select using (user_id = auth.uid() or public.is_admin());
create policy "members insert own bookings" on public.bookings
for insert with check (user_id = auth.uid() or public.is_admin());
create policy "members update own bookings" on public.bookings
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
create policy "admin delete bookings" on public.bookings
for delete using (public.is_admin());
