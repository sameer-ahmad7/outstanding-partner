-- Make lifetime-grant email matching fully case-insensitive & self-normalizing,
-- so a case slip can never cause a missed free-forever grant.
--
-- 1) Normalize lifetime_grants.email to lowercase on every insert/update (no more
--    reliance on the caller remembering lower()).
-- 2) The signup trigger compares lower() on BOTH sides.
-- (user_subscriptions has no email column — it's keyed by user_id — so nothing to change there.)

-- 1) Auto-lowercase stored grant emails
create or replace function public.normalize_lifetime_grant_email()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(new.email);
  return new;
end;
$$;

drop trigger if exists trg_lifetime_grants_lowercase on public.lifetime_grants;
create trigger trg_lifetime_grants_lowercase
  before insert or update on public.lifetime_grants
  for each row execute function public.normalize_lifetime_grant_email();

-- Normalize any existing rows (idempotent)
update public.lifetime_grants set email = lower(email) where email <> lower(email);

-- 2) Harden the signup apply-trigger to lower() both sides
create or replace function public.apply_lifetime_grant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.lifetime_grants g where lower(g.email) = lower(new.email)) then
    insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
    values (new.id, true, 'premium', true)
    on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
  end if;
  return new;
end;
$$;
