# Apple resubmission — what changed & what to do

This addresses the two rejection items (Guideline 3.1.2 Terms link, Guideline 3.1.1 non-IAP unlock).

## What changed in the app
1. **Terms of Use link is now functional in-app.** The paywall "Terms of Use" link now opens reliably inside the app (via the native browser), instead of a `window.open` that didn't open in the iOS WebView. It points to Apple's standard EULA: `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`. The paywall already shows the subscription title (Monthly / Yearly), length, price ($21.99/mo, $224.99/yr), 7-day free trial, auto-renew terms, Privacy Policy, and Restore Purchases.
2. **Removed the in-app code-redemption field.** The "Have a code? → Redeem" box that unlocked access outside In-App Purchase is gone. The only way to get paid access in the app is now In-App Purchase / Restore. (Free access for specific people is granted by us server-side — not via any in-app mechanism.)

---

## 1) App Store Connect — Description (paste this)

> Most men love their partner. Very few know how to show it consistently.
>
> Outstanding Partner is the daily system for husbands and boyfriends who want to become the partner their woman can't stop talking about.
>
> Built on relationship science and cycle psychology, this app gives you exactly what to do, what to say, and when to do it. Every single day.
>
> WHAT MAKES THIS DIFFERENT
> Every other relationship app requires both partners to download it. Outstanding Partner is built exclusively for him. She never sees it. She just feels the difference.
>
> YOUR DAILY SYSTEM
>
> DAILY MISSION: One specific, actionable task matched to where she is in her cycle and what she needs today.
>
> DAILY TEXT: A ready-to-send message tailored to her current emotional phase. 190+ texts that rotate so you never repeat yourself.
>
> WEEKLY ACTIVITY: A new at-home activity every Monday (60 total).
>
> MONTHLY DATE: A new date idea every month for every budget (100 total).
>
> HER CYCLE CHANGES EVERYTHING
> Women move through four distinct emotional phases every 28 days. Outstanding Partner tracks her cycle and adjusts your missions, texts, and activities to match:
>
> Menstrual Phase: Comfort and zero pressure
>
> Follicular Phase: Open, energized, receptive to plans
>
> Ovulation Phase: Pursuit, attention, connection
>
> Luteal Phase: Patience, service, emotional safety
>
> THE 30/60/90-DAY CHALLENGE
> 90 daily missions across 4 levels. Men report their partners notice a fundamental shift by Day 14. By Day 90, you are a completely transformed partner.
>
> Level 1: Foundation (Days 1-30)
>
> Level 2: Advanced Partner (Days 31-60)
>
> Level 3: Master Partner (Days 61-90)
>
> Level 4: Lifelong Partner (Monthly missions, forever)
>
> KNOW HER LIKE NEVER BEFORE
> Build a complete profile of her favorites, love language, and important dates with 21-day advance reminders.
>
> She Said Journal: Capture everything she mentions in passing. When you act on a passing comment weeks later, she knows you were listening.
>
> WHAT'S INSIDE
>
> 190+ phase-matched text messages
>
> 60 cycle-matched at-home activities
>
> 100 date ideas for every budget
>
> 30/60/90-Day Partner Challenge
>
> Full menstrual cycle tracker
>
> Anniversary & birthday reminders
>
> "She Said" capture journal
>
> Brain chemistry insights (understand why your actions work)
>
> Seasonal campaigns (Valentine's, Christmas, etc.)
>
> New content added monthly
>
> WHO THIS IS FOR
> Outstanding Partner is for men who are serious about stepping up. If you've ever thought, "I just don't know what she needs" - this app answers that question every single morning.
>
> ____________________
>
> Outstanding Partner is an auto-renewable subscription.
> • Monthly: $21.99/month, with a 7-day free trial
> • Yearly: $224.99/year, with a 7-day free trial
> Payment is charged to your Apple ID at confirmation of purchase. Your subscription automatically renews unless it is cancelled at least 24 hours before the end of the current period. Manage or cancel anytime in your Apple ID account settings.
>
> Privacy Policy: https://outstandingpartner.app/privacy
> Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

**Also confirm:** App Store Connect → App → App Information / Version → **Privacy Policy URL** = `https://outstandingpartner.app/privacy`.

---

## 2) App Review Information → Notes (paste this)

> This build resolves both items from the previous review:
>
> 1) Guideline 3.1.2 — The Terms of Use (EULA) link is now functional in-app. On the subscription screen (shown right after sign-in for non-subscribers), tap "Terms of Use" at the bottom — it opens Apple's standard EULA. The same screen also shows the subscription title (Monthly/Yearly), length, price ($21.99/month, $224.99/year), the 7-day free trial, auto-renewal terms, a Privacy Policy link, and Restore Purchases. The Terms of Use (EULA) and Privacy Policy links are also included in the App Description.
>
> 2) Guideline 3.1.1 — The in-app code-redemption field has been completely removed. The app no longer unlocks any functionality outside of In-App Purchase. Paid access is obtained only via the In-App Purchase subscriptions or Restore Purchases.
>
> The subscription screen appears immediately after creating an account / signing in (a free account is required to sync the user's data). To reach it: sign up with any email, verify, sign in — the subscription screen is shown before the main app.
>
> Demo account (already verified, not subscribed, so the subscription screen is shown):
>   Email: [FILL IN]
>   Password: [FILL IN]

> If you use the demo account above and need to test a purchase, please use the StoreKit sandbox.

*(Create a demo account, make sure it's email-verified and NOT subscribed/lifetime, and fill in the credentials. Apple reviewers expect a working demo account for apps that gate content behind login.)*

---

## 3) Granting free-forever access (server-side, by email)

The in-app redeem code is gone. To give someone free-forever access, run SQL in **Supabase → SQL Editor**. This works whether or not they've signed up yet.

### One-time setup (run ONCE) — creates the pre-grant table + signup trigger
*(Already saved as `supabase/migrations/20260627120000_lifetime_grants.sql` in the repo. Run it once in the SQL Editor.)*

```sql
create table if not exists public.lifetime_grants (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.lifetime_grants enable row level security;

create or replace function public.apply_lifetime_grant()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.lifetime_grants g where g.email = lower(new.email)) then
    insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
    values (new.id, true, 'premium', true)
    on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created_apply_lifetime on auth.users;
create trigger on_auth_user_created_apply_lifetime
  after insert on auth.users
  for each row execute function public.apply_lifetime_grant();
```

### Per-person grant (run for each email you want to make free) — works before OR after they sign up
```sql
insert into public.lifetime_grants (email, note)
values (lower('person@email.com'), 'VIP')
on conflict (email) do nothing;

insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
select id, true, 'premium', true from auth.users where email = lower('person@email.com')
on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
```

- If they already have an account → access applies immediately.
- If they haven't signed up yet → the grant is remembered and applies automatically the moment they register.
- Existing people who redeemed a code before still keep their access (unchanged).

---

## 4) Resubmit checklist
- [ ] Run the one-time setup SQL (section 3) in Supabase.
- [ ] Upload the new build.
- [ ] Paste the updated Description (section 1) + confirm Privacy Policy URL.
- [ ] Create a verified, non-subscribed demo account; fill it into the Review Notes (section 2) and paste them.
- [ ] Attach a screen recording showing: the subscription screen with prices/trial + tapping "Terms of Use" → EULA opens, and that there is no code-redemption field.
- [ ] Submit.
