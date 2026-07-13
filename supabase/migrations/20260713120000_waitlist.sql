-- Android waitlist for the marketing site. Public form (anon) inserts an email;
-- the list is private (no anon SELECT). Emails are normalized to lowercase.

create table if not exists public.waitlist (
  email      text primary key,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Anyone (anon) may INSERT; nobody may read/update/delete via the API (no other policies).
grant insert on public.waitlist to anon, authenticated;

drop policy if exists waitlist_anon_insert on public.waitlist;
create policy waitlist_anon_insert on public.waitlist
  for insert to anon, authenticated
  with check (true);

-- Normalize the email to lowercase/trimmed on write (defensive; the form also lowercases).
create or replace function public.normalize_waitlist_email()
returns trigger language plpgsql as $$
begin
  new.email := lower(trim(new.email));
  return new;
end; $$;

drop trigger if exists trg_waitlist_lower on public.waitlist;
create trigger trg_waitlist_lower
  before insert or update on public.waitlist
  for each row execute function public.normalize_waitlist_email();
