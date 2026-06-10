-- Friends & family lifetime access via unique, one-time-use codes.

-- 1) Lifetime flag on the subscription mirror (read-only to clients via existing RLS).
alter table public.user_subscriptions
  add column if not exists lifetime boolean not null default false;

-- 2) Codes table. RLS enabled with NO policies => no direct client access;
--    all redemption happens through the SECURITY DEFINER function below.
create table if not exists public.access_codes (
  code text primary key,
  note text,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.access_codes enable row level security;

-- 3) Atomic, single-use redemption. Returns json {ok:boolean, error?:text}.
create or replace function public.redeem_access_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_claimed text;
begin
  if v_user is null then
    return json_build_object('ok', false, 'error', 'Not signed in');
  end if;
  if p_code is null or length(trim(p_code)) = 0 then
    return json_build_object('ok', false, 'error', 'Enter a code');
  end if;

  -- Atomic claim: only succeeds if the code exists and is unused.
  update public.access_codes
     set redeemed_by = v_user, redeemed_at = now()
   where upper(code) = upper(trim(p_code)) and redeemed_by is null
   returning code into v_claimed;

  if v_claimed is null then
    -- Idempotent: if THIS user already redeemed this exact code, still grant access.
    if not exists (
      select 1 from public.access_codes
       where upper(code) = upper(trim(p_code)) and redeemed_by = v_user
    ) then
      return json_build_object('ok', false, 'error', 'Invalid or already-used code');
    end if;
  end if;

  -- Grant lifetime access on the user's subscription mirror.
  insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
  values (v_user, true, 'premium', true)
  on conflict (user_id)
  do update set lifetime = true, is_active = true, updated_at = now();

  return json_build_object('ok', true);
end;
$$;

grant execute on function public.redeem_access_code(text) to authenticated;

-- 4) Admin helper to generate N unique codes (run in the Supabase SQL editor).
--    Usage:  select code from public.generate_access_codes(20, 'friends batch');
create or replace function public.generate_access_codes(p_count int, p_note text default null)
returns setof public.access_codes
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
  v_code text;
begin
  for i in 1..greatest(p_count, 0) loop
    loop
      v_code := 'OP-' ||
        upper(substr(replace(gen_random_uuid()::text,'-',''),1,4)) || '-' ||
        upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
      exit when not exists (select 1 from public.access_codes where code = v_code);
    end loop;
    insert into public.access_codes (code, note) values (v_code, p_note);
  end loop;
  return query
    select * from public.access_codes
     where note is not distinct from p_note and redeemed_by is null
     order by created_at desc limit p_count;
end;
$$;
revoke all on function public.generate_access_codes(int, text) from anon, authenticated;
