-- Outstanding Partner — initial schema
-- Tables: profiles, user_app_state, user_subscriptions
-- Security: Row Level Security so each user can only access their own rows.

-- ────────────────────────────────────────────────────────────────────────────
-- Helper: keep updated_at fresh
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- profiles
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- user_app_state  (single JSONB document per user — full app snapshot)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_app_state_updated_at on public.user_app_state;
create trigger trg_user_app_state_updated_at
  before update on public.user_app_state
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- user_subscriptions  (mirror of RevenueCat entitlement; written by trusted side)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revenuecat_app_user_id text,
  entitlement text,
  is_active boolean not null default false,
  product_id text,
  store text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_subscriptions_updated_at on public.user_subscriptions;
create trigger trg_user_subscriptions_updated_at
  before update on public.user_subscriptions
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.user_app_state      enable row level security;
alter table public.user_subscriptions  enable row level security;

-- profiles: full self-management
drop policy if exists "profiles_self_all" on public.profiles;
create policy "profiles_self_all"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_app_state: full self-management
drop policy if exists "user_app_state_self_all" on public.user_app_state;
create policy "user_app_state_self_all"
  on public.user_app_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_subscriptions: users may READ their own; writes happen via service role / webhook
drop policy if exists "user_subscriptions_self_select" on public.user_subscriptions;
create policy "user_subscriptions_self_select"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- Auto-provision profile + app_state rows when a new auth user signs up
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', ''))
  on conflict (id) do nothing;

  insert into public.user_app_state (user_id, data)
  values (new.id, '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
