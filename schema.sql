-- ═══════════════════════════════════════════════
-- Blacklist.cl — PostgreSQL Schema (Supabase)
-- NFS Most Wanted: Garage / Blacklist / Bounty
-- ═══════════════════════════════════════════════

-- ─── EXTENSIONS ───
create extension if not exists "pgcrypto";

-- ─── 1. PROFILES (extends Supabase auth.users) ───
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  display_name text,
  avatar_url  text,
  bio         text,
  bounty      integer not null default 0,
  plan_tier   text not null default 'free' check (plan_tier in ('free', 'pro', 'workshop')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_profiles_bounty on public.profiles(bounty desc);
create index idx_profiles_username on public.profiles(username);

-- ─── 2. VEHICLES ───
create table if not exists public.vehicles (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  name        text not null,                                   -- ej: "Proyecto Alba"
  make        text not null,                                   -- ej: "Mazda"
  model       text not null,                                   -- ej: "RX-7 FD3S"
  year        integer,
  photos      text[] default '{}',                             -- Cloudinary URLs
  specs       jsonb default '{}',                              -- { power: 350, torque: 420, weight: 1280 }
  description text,
  respect_count integer not null default 0,
  is_featured boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_vehicles_profile on public.vehicles(profile_id);
create index idx_vehicles_respect on public.vehicles(respect_count desc);
create index idx_vehicles_featured on public.vehicles(is_featured) where is_featured = true;

-- ─── 3. MODIFICATIONS ───
create type mod_category as enum (
  'engine', 'suspension', 'exhaust', 'brakes',
  'wheels', 'body', 'interior', 'electronics', 'other'
);

create table if not exists public.modifications (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.vehicles(id) on delete cascade,
  category    mod_category not null,
  name        text not null,                                   -- ej: "Downpipe 3\" c/catless"
  brand       text,
  description text,
  workshop_id uuid,                                            -- opcional: taller que lo instaló
  created_at  timestamptz not null default now()
);

create index idx_mods_vehicle on public.modifications(vehicle_id);
create index idx_mods_category on public.modifications(category);

-- ─── 4. WORKSHOPS ───
create table if not exists public.workshops (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid unique references public.profiles(id) on delete set null,
  name         text not null,
  slug         text unique not null,
  description  text,
  logo_url     text,
  region       text not null,                                  -- ej: "Metropolitana"
  commune      text,                                           -- ej: "Ñuñoa"
  specialties  text[] default '{}',                             -- ej: ["repro", "escape", "suspensión"]
  verified     boolean not null default false,
  contact      jsonb default '{}',                             -- { instagram, whatsapp, web }
  rating_avg   numeric(3,2) default 0,
  rating_count integer default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_workshops_region on public.workshops(region);
create index idx_workshops_verified on public.workshops(verified) where verified = true;
create index idx_workshops_slug on public.workshops(slug);

-- ─── 5. REVIEWS (de proyectos a talleres) ───
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.vehicles(id) on delete cascade,
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  rating      integer not null check (rating >= 1 and rating <= 5),
  content     text,
  bounty_earned integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_reviews_workshop on public.reviews(workshop_id);
create index idx_reviews_profile on public.reviews(profile_id);
create unique index idx_reviews_unique on public.reviews(vehicle_id, workshop_id);

-- ─── 6. VOTES (Respeto) ───
create table if not exists public.votes (
  id          uuid primary key default gen_random_uuid(),
  vehicle_id  uuid not null references public.vehicles(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(vehicle_id, profile_id)
);

create index idx_votes_vehicle on public.votes(vehicle_id);

-- ─── 7. BOUNTY LOG ───
create type bounty_action as enum (
  'publish_vehicle', 'add_photo', 'add_mod',
  'review_workshop', 'receive_respect', 'bonus'
);

create table if not exists public.bounty_log (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  amount      integer not null,
  action      bounty_action not null,
  reference_id uuid,                                           -- id del recurso asociado
  description text,
  created_at  timestamptz not null default now()
);

create index idx_bounty_profile on public.bounty_log(profile_id);

-- ─── 8. SUBSCRIPTIONS ───
create type plan_type as enum ('pro', 'workshop');

create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  plan        plan_type not null,
  status      text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  stripe_id   text,
  current_period_start timestamptz not null default now(),
  current_period_end   timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_subs_profile on public.subscriptions(profile_id);
create index idx_subs_active on public.subscriptions(profile_id) where status = 'active';

-- ─── HELPER: update updated_at ───
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.update_updated_at();

create trigger trg_workshops_updated_at
  before update on public.workshops
  for each row execute function public.update_updated_at();

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();

-- ─── BOUNTY TRIGGERS ───
-- Auto-update profile.bounty when bounty_log changes
create or replace function public.sync_bounty()
returns trigger as $$
begin
  update public.profiles
  set bounty = (select coalesce(sum(amount), 0) from public.bounty_log where profile_id = new.profile_id)
  where id = new.profile_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_bounty_sync
  after insert on public.bounty_log
  for each row execute function public.sync_bounty();

-- Auto-update vehicle respect_count
create or replace function public.sync_respect()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.vehicles set respect_count = respect_count + 1 where id = new.vehicle_id;
  elsif tg_op = 'DELETE' then
    update public.vehicles set respect_count = respect_count - 1 where id = old.vehicle_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger trg_votes_insert
  after insert on public.votes
  for each row execute function public.sync_respect();

create trigger trg_votes_delete
  after delete on public.votes
  for each row execute function public.sync_respect();

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.modifications enable row level security;
alter table public.workshops enable row level security;
alter table public.reviews enable row level security;
alter table public.votes enable row level security;
alter table public.bounty_log enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: public read, own write
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Vehicles: public read, owner write
create policy "Vehicles are publicly readable"
  on public.vehicles for select using (true);

create policy "Users can insert own vehicles"
  on public.vehicles for insert with check (auth.uid() = profile_id);

create policy "Users can update own vehicles"
  on public.vehicles for update using (auth.uid() = profile_id);

create policy "Users can delete own vehicles"
  on public.vehicles for delete using (auth.uid() = profile_id);

-- Workshops: public read, owner write
create policy "Workshops are publicly readable"
  on public.workshops for select using (true);

create policy "Workshop owners can update"
  on public.workshops for update using (auth.uid() = owner_id);

-- Votes: authenticated users insert/delete own
create policy "Authenticated users can vote"
  on public.votes for insert with check (auth.uid() = profile_id);

create policy "Users can delete own votes"
  on public.votes for delete using (auth.uid() = profile_id);
