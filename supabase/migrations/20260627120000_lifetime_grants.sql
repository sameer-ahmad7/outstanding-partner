-- Free-forever (lifetime) access granted by ADMIN, by email — works whether or not
-- the person has signed up yet. Replaces the removed in-app redeem-code field
-- (removed for App Store Guideline 3.1.1 compliance: no non-IAP unlock in the app).
--
-- user_subscriptions.user_id is FK'd to auth.users(id), so we can't pre-create a row
-- for a non-existent user. Instead we keep an email-keyed pre-grant list and a signup
-- trigger that materializes the grant into user_subscriptions the moment that email
-- registers. The per-person grant query (below, run by admin) also applies it
-- immediately if the user already exists.

-- 1) Email-keyed pre-grant list (admin-only; RLS on, no policies → only SECURITY
--    DEFINER functions / service role can touch it; clients cannot read or write).
create table if not exists public.lifetime_grants (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.lifetime_grants enable row level security;

-- 2) When a NEW user signs up, auto-apply any pending grant for their email.
create or replace function public.apply_lifetime_grant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.lifetime_grants g where g.email = lower(new.email)) then
    insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
    values (new.id, true, 'premium', true)
    on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_apply_lifetime on auth.users;
create trigger on_auth_user_created_apply_lifetime
  after insert on auth.users
  for each row execute function public.apply_lifetime_grant();

-- ── ADMIN: grant free-forever to one email (run in Supabase SQL Editor) ──────────
-- Works pre- or post-signup. Replace the email.
--
--   insert into public.lifetime_grants (email, note)
--   values (lower('person@email.com'), 'VIP')
--   on conflict (email) do nothing;
--
--   insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
--   select id, true, 'premium', true from auth.users where email = lower('person@email.com')
--   on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
