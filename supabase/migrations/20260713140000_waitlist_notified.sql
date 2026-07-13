-- Track which waitlist subscribers have already received the "we're live on Android"
-- launch email, so the broadcast can be run (and re-run) without double-emailing.
alter table public.waitlist add column if not exists notified_at timestamptz;
create index if not exists waitlist_unnotified_idx on public.waitlist (created_at) where notified_at is null;
