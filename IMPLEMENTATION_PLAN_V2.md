# Implementation Plan v2 — Conversion Rework
**Agreed with client 2026-08-19.** Four workstreams. Driven by the funnel data below.

## Why we're doing this — the numbers that triggered it
Measured 2026-08-19 (RevenueCat + Supabase `auth.users`):

| Funnel stage | Count | Drop |
|---|---|---|
| Opened the app (RC "new customers") | **47** | — |
| Created an account | **20** | **−57%** ← biggest leak |
| Verified email | **19** | −5% (healthy — NOT the problem) |
| Reached paywall | **19** | — |
| Started a trial | **0** | **−100%** ← second leak |

Two confirmed causes already fixed & shipped (v1.0.3):
- Paywall defaulted to the **$224.99/yr** plan, so "Start 7-Day Free Trial" opened a $224.99 sheet.
- Paywall showed hardcoded fallback prices, so a broken offering still *looked* fine.

Remaining leak = the **hard signup wall** (27 people) → workstreams below.

---

# WS1 — Apple & Google Sign-In (web + iOS + Android)

**Goal:** kill the email+password friction at signup. Currently `auth.service.js` only uses
`signInWithPassword` / `signUp` — there is **no social auth at all**.

### Approach
Supabase supports both. Two different code paths:
- **Web** (`/app`): `supabase.auth.signInWithOAuth({ provider: 'apple' | 'google' })` — redirect flow.
- **Native** (iOS/Android): get a native ID token, then
  `supabase.auth.signInWithIdToken({ provider, token })`. Native token avoids the ugly
  in-app-browser round trip and is what Apple expects.

Plugins: `@capacitor-community/apple-sign-in` (iOS) + `@codetrix-studio/capacitor-google-auth`
(or Firebase Auth plugin, but that introduces a second identity system — avoid).

### ⚠️ Gotchas (these are the ones that bite)
1. **Apple Guideline 4.8** — if you offer Google sign-in on iOS you **must** also offer Sign in
   with Apple. Non-negotiable, causes rejection.
2. **Apple Hide My Email** — users can sign up with a `@privaterelay.appleid.com` relay address.
   Real email is only returned on the **first** authorization, never again. Capture it then or
   lose it forever.
3. **Account linking / duplicate users.** If someone signed up with `bob@x.com` + password, then
   later taps "Continue with Google" as `bob@x.com`, Supabase may create a **separate user id**
   depending on config. That matters enormously here because:
   > **RevenueCat `app_user_id` = Supabase user id.** A new user id = a different RevenueCat
   > customer = **their subscription appears to vanish.**
   Decide up front: enable identity linking, or detect + merge. Must be tested with a paying account.
4. **Android SHA-1s** — Google OAuth needs the SHA-1 of **both** the debug key *and* the Play App
   Signing key. Miss the release one and social login works in testing, fails in production.

### Config needed
- Apple: Services ID, Team ID, Key ID + `.p8` key → Supabase Auth providers
- Google: **three** OAuth client IDs (Web, iOS, Android) → Supabase + native plugin config
- Supabase → Authentication → Providers → enable Apple + Google, add redirect URLs

---

# WS2 — New pricing: $14.99/mo, 1-month free trial, no annual

**Change:** `$21.99/mo + $224.99/yr, 7-day trial` → **`$14.99/mo, 1-month free trial`. Annual removed.**

### ⚠️ Do NOT delete the annual product
There is **1 active subscriber** on the old plan. Deleting or deactivating the product breaks
their subscription and their access. Instead:
- **Remove the annual package from the RevenueCat `default` offering** (stops it being *offered*)
- **Leave the product alive** in App Store Connect / Play / RC so the existing subscriber renews normally
- Same for the old $21.99 monthly — keep it alive, stop offering it

### ⚠️ Introductory-offer eligibility (important, will surprise the client)
Apple and Google allow **one introductory offer per subscription group, per account, ever**.
Anyone who already consumed the 7-day trial **cannot** receive the 1-month trial. New users get it;
some existing users won't. Our paywall already handles this correctly — `trialOf()` only promises a
trial when the store actually reports one (built 2026-08-18), so those users just see
"Subscribe →" with no false promise.

### Store work
| Platform | Action |
|---|---|
| App Store Connect | New subscription `com.outstandingpartner.app.monthly2` @ $14.99 in the **same subscription group**; Introductory Offer = **Free, 1 month**, new subscribers |
| Google Play | New subscription `com.outstandingpartner.app.monthly2`, base plan `monthly` @ $14.99, offer = **Free trial, 1 month**, eligibility *new customer acquisition* |
| RevenueCat Billing (web) | New web product @ $14.99 with 1-month trial |
| RevenueCat | Attach all three to `premium` entitlement → put in `default` offering's `$rc_monthly` package → **remove the `$rc_annual` package** |

*(Creating new product IDs rather than repricing keeps the old plan clean for the existing
subscriber and avoids ambiguity in reporting.)*

### App code
- `Paywall.jsx` — drop the two-card selector, render a **single plan**. `selectedPlan` state and
  the annual branch in `chosen` become dead → remove.
- `trialOf()` already renders any unit, so "1-month free" displays correctly with no change ✅
- Update the legal blurb + App Store / Play descriptions ($21.99 → $14.99, 7 days → 1 month)
- Landing page `web-legal/index.html` — "7 days free" appears in the hero, download section and
  footer micro-copy; update all of them + the ad copy in `META_AD_CAMPAIGN_DRAFT.md`

---

# WS3 — Freemium: show value before asking for anything

**The fix for the 27-person leak.** Currently `AppShell.jsx` has two hard gates:
```js
const showAuth = passwordRecovery || !authUser || !emailVerified;   // wall 1
{!showAuth && subscriptionReady && !subscribed && <Paywall/>}        // wall 2
```
Both must become soft.

### Agreed tiering
| Free — no account | Free — with account | Paid |
|---|---|---|
| Today's mission | Save progress & streak | All 190+ texts |
| One daily text | Cycle tracker | All 60 activities · 100 date ideas |
| A few date ideas | "She Said" journal | 30/60/90-day challenge |
| | | Anniversary & birthday reminders |

### Build
1. Let the app render with **no** `authUser` — anonymous mode, state in local storage only.
2. Replace the blocking paywall with **contextual upgrade prompts** at each locked feature.
3. **Migrate anonymous local state → the account on signup** (don't lose their streak — that's the
   moment they're most likely to bail).
4. Keep `/app` web behaviour identical.

### ⚠️ Measurement warning
Showing content first means the paywall is seen *later*, so **trial-starts per paywall-view will
look worse** even if the business improves. Track **trials per install**, not per paywall view.
Agree this with the client before the numbers land or it will look like a regression.

---

# WS4 — Reviews section on the website

**Client wants App Store + Play reviews fetched onto outstandingpartner.app.**

### Reality check (verified 2026-08-19)
- **App Store: 0 ratings, 0 reviews.** **Play: none.** The section will be **empty at launch.**
- **Never fabricate reviews.** Beyond being dishonest, the FTC fines businesses for fake
  testimonials. Real reviews only.

### Feasibility differs sharply by store
| Store | Method | Status |
|---|---|---|
| **Apple** | Public RSS: `itunes.apple.com/us/rss/customerreviews/id=6778456225/sortBy=mostRecent/json` | ✅ **Works today**, no auth (verified HTTP 200) |
| **Google Play** | **No public API.** Requires Play Developer API `reviews.list` + service account | ⚠️ Server-side only, and **only returns the last ~7 days** |

Because of the Play 7-day window, reviews **must be polled and stored** or they disappear.

### Architecture
1. Supabase table `app_reviews(id, store, author, rating, title, body, posted_at, fetched_at)`
2. Scheduled **Edge Function** (daily) → pulls Apple RSS + Play Developer API → upserts
3. Website fetches from Supabase (avoids CORS + store rate limits), renders newest N with 4★+ filter
4. Section hidden entirely while the table is empty — no empty state, no placeholders

### Getting reviews in the first place
None of this matters with zero reviews. Add an **in-app rating prompt** (`@capacitor-community/in-app-review`)
after a positive moment — e.g. completing 3 daily missions. That's what actually generates them.

---

# Sequencing

| Order | Workstream | Why this order |
|---|---|---|
| 1 | **WS1 Apple/Google sign-in** | Biggest leak, smallest build. Ship first, measure. |
| 2 | **WS2 Pricing** | Store products need review lead time — start the store side in parallel with WS1 |
| 3 | **WS3 Freemium** | Largest change; benefits from WS1 already reducing friction |
| 4 | **WS4 Reviews** | Zero reviews exist — genuinely lowest value until there are some |

Ship WS1+WS2 together in one release, WS3 in the next, WS4 whenever.

**Do not ship WS1, WS2 and WS3 simultaneously** — if conversion moves we won't know which change did it.

---

# Needed from the client

| Item | For |
|---|---|
| Apple: Services ID, Team ID, Key ID + `.p8` | WS1 |
| Google: OAuth consent screen + 3 client IDs (or grant me Cloud Console access) | WS1 |
| Confirm: keep the existing $21.99 subscriber on their old plan (recommended) | WS2 |
| Confirm free/paid tiering table above | WS3 |
| Play Developer API service account JSON (may already exist for RevenueCat) | WS4 |

Everything else I can do with existing access.

---

# Open risks
1. **Social login + existing paying users** — identity linking could orphan a RevenueCat customer.
   Must be tested with a real paying account before release. (WS1 gotcha 3)
2. **Trial eligibility** — users who used the 7-day trial get no 1-month trial. Expect confused
   support emails; the paywall handles it honestly but the client should know.
3. **Metric optics** — WS3 makes paywall-view conversion look worse. Agree the denominator first.
4. **Ads are still paused** and should stay paused until WS1+WS2 ship and a real purchase is verified.

---

# DECISIONS — signed off 2026-08-19

### 1. Annual: confirmed — hide from new users, keep the product alive ✅
Agreed and this is exactly the right mechanism. Renewals are handled by Apple/Google **against the
product**, not the offering; the offering only controls what the app *displays*. So removing the
package from the RC `default` offering hides it from everyone new while existing subscribers keep
renewing untouched.

⚠️ **Applies to BOTH legacy products, not just annual.** RevenueCat shows 1 active subscription at
**$19 MRR**, which is ~$21.99 minus the ~15% store cut — i.e. the existing subscriber is almost
certainly on the **$21.99 monthly**, not annual. So:
- Keep alive (do not delete/deactivate): `…app.monthly` ($21.99) **and** `…app.yearly` ($224.99)
- Remove **both** from the `default` offering
- Offer only the new `…app.monthly2` ($14.99, 1-month trial)

### 2. Trial eligibility: acknowledged ✅
Users who consumed the 7-day trial get no 1-month trial. Paywall already degrades honestly to
"Subscribe →" via `trialOf()`. No code change. Expect occasional support questions.

### 3. Keep email/password **alongside** Apple + Google ✅ — ⚠️ raises the linking risk
Supporting both is correct for accessibility, but it makes **account linking the single biggest
technical risk in WS1**, because the collision case is now guaranteed to occur:

> User signs up `bob@x.com` + password → later taps "Continue with Google" as `bob@x.com`.
> If Supabase mints a **new user id**, then because **RevenueCat `app_user_id` = Supabase user id**,
> that paying user's subscription **appears to vanish**. They will email support saying they were
> charged and lost access.

**Required before release:**
- Enable identity linking in Supabase Auth so a verified matching email attaches to the existing user
- Test the exact sequence above **with a real paying test account** on iOS and Android
- Add a fallback path: if entitlement is missing after login, call `restorePurchases()` automatically

### 4. Reviews: Apple feed only — ✅ and now much simpler
Dropping Google Play removes the whole server-side burden. **Verified the Apple RSS feed returns
`access-control-allow-origin: *`**, so the website can fetch it **directly from the browser**:

- ❌ No Supabase table, no Edge Function, no cron, no Play service account
- ✅ Small script on `web-legal/index.html`: fetch → filter 4★+ → render → hide section if empty
- Endpoint: `https://itunes.apple.com/us/rss/customerreviews/id=6778456225/sortBy=mostRecent/json`

Scope drops from ~a day of backend work to roughly an afternoon.

**Two things the client should know:**
- It will show **iPhone reviews only** — Android reviews will never appear (no public Play API).
- There are still **0 reviews**, so it stays hidden until real ones exist. The in-app rating prompt
  is what will actually produce them — that's the higher-value half of WS4.

### 5. Metric = trials per install ✅
Agreed up front so WS3 isn't misread as a regression.


---

# ⚠️ WS2 REWRITTEN — 2026-08-21: one-time $14.99, NOT a subscription

**Client decision:** *"I am moving away from subscription model. Please make it a 1 time price of
$14.99."* This supersedes the "$14.99/mo + 1-month trial" decision recorded above.

## 🔴 The consequence that changes an earlier decision: THE FREE TRIAL IS NO LONGER POSSIBLE

Free trials and introductory offers are a **subscription-only feature** on both Apple and Google.
A **non-consumable / one-time product cannot have a free trial** — there is no store mechanism for it.

So the "1 month free" agreed the day before **cannot ship** alongside a one-time price. Pick one:
- **One-time $14.99, no trial** ← current instruction
- Subscription $14.99/mo with 1-month free ← the previous instruction

**This makes WS3 (freemium) essential rather than optional.** With no store trial, letting people use
part of the app for free is now the *only* way anyone can try before buying. Given the funnel data
(27 of 47 left at the signup wall), shipping a one-time paywall with **no** free tier would likely
convert worse than what we have now. **WS3 should ship in the same release as WS2, not after it.**

## Product changes

| Platform | Old | New |
|---|---|---|
| App Store | Auto-renewable subscription | **Non-Consumable IAP** `com.outstandingpartner.app.lifetime` @ $14.99 |
| Google Play | Subscription | **One-time product** (in-app product) `com.outstandingpartner.app.lifetime` @ $14.99 |
| RevenueCat | monthly/annual packages | non-subscription product → `premium` entitlement (grants **lifetime**) |
| Web | RC Billing subscription | ⚠️ see open question below |

⚠️ **Still keep the old subscription products alive** — the existing $21.99/mo subscriber must keep
renewing. Remove them from the offering only. (Unchanged from the earlier decision.)

## Code changes required (more than the subscription swap needed)

1. **`packageType` handling — this WILL break.** RevenueCat reports non-subscription products as
   `LIFETIME` (or `CUSTOM`), never `MONTHLY`/`ANNUAL`. `Paywall.jsx:15-16` looks only for
   MONTHLY/ANNUAL, so **the paywall would find no package and show "Plans couldn't be loaded."**
   → find the lifetime package instead; drop the two-card selector entirely.
2. **Delete the trial machinery** — `trialOf()`, `chosenTrial()`, the "$0 due today" line, and the
   "7-day free trial" copy. None of it applies. (Keep the code pattern in git history in case they
   revert to subscriptions.)
3. ⚠️ **Replace the auto-renew legal text.** `Paywall.jsx:119` currently states *"Subscriptions
   auto-renew unless turned off at least 24 hours before…"*. For a one-time purchase that is
   **factually wrong** and an App Review risk. Replace with one-time wording:
   *"One-time purchase. Pay once, keep full access forever."*
4. **"Restore Purchases" becomes critical, not optional.** It's the only way a user recovers access
   after reinstalling or changing device. Already present — must be tested explicitly.
5. `selectedPlan` state in `AppStateProvider.jsx` becomes dead → remove.

## Store metadata that becomes WRONG the moment this ships
- **App Store description** currently ends with the auto-renewable subscription block ($21.99/mo,
  $224.99/yr, 7-day trial, auto-renew terms). Must be rewritten to one-time $14.99 or it is
  misleading → rejection risk.
- **Play description** — same.
- **Landing page** (`web-legal/index.html`) — "7 days free", "$21.99/month after trial", the hero
  and download-section micro-copy.
- **Meta ad copy** (`META_AD_CAMPAIGN_DRAFT.md`) — all three ads say "7 days free".

## ❓ Open question — web payments
RevenueCat **Web Billing is subscription-oriented**; one-time product support needs verifying before
we promise it. Options if unsupported:
- (a) keep the web app on a subscription and sell one-time only in the apps (inconsistent pricing — poor)
- (b) plain **Stripe Checkout** one-time payment, then grant the entitlement via RevenueCat's REST API
- (c) drop web purchasing; web becomes companion-only for people who bought in-app
**Must confirm before quoting a date for the web side.**

## Revenue note (raised once, client has reaffirmed — proceeding)
$14.99 once vs $21.99/month recurring means each customer pays roughly **1.5 months' worth, ever**,
with no renewal. Sustainable only if acquisition cost stays well under ~$15 — which at the current
$3–10 cost-per-install is plausible but leaves thin margin. Flagged, decision is the client's.


---

# ⚠️ WS2 REWRITTEN AGAIN — 2026-08-21 (v4): $8.99/mo sub + $8.99 one-time cycle unlock

**Client decision:** back to subscriptions, *"$8.99 subscription with 1 month free trial"*, **monthly
only**, trialling the model for **3 months**. **Plus** a separate **$8.99 one-time purchase to unlock
the menstrual cycle feature.** Supersedes the one-time-$14.99 decision above.

✅ **The 1-month free trial is possible again** — trials are a subscription feature, and the main
product is a subscription once more.

## 🔴 This introduces a SECOND entitlement — a real architecture change

The codebase assumes exactly **one** entitlement today:
`revenuecat.service.js:4` and `revenuecatWeb.service.js:6` → `ENTITLEMENT_ID = 'premium'`, and every
access check reads only that. A separate paid cycle unlock means **two independent entitlements**:

| Entitlement | Granted by | Unlocks |
|---|---|---|
| `premium` | $8.99/mo subscription | everything |
| `cycle` | $8.99 one-time **and** (see Q1) the subscription | menstrual cycle tracker |

Work: parameterise both RC services by entitlement, expose `hasPremium` / `hasCycle` separately from
`useSubscription`, and gate the cycle UI on `hasPremium || hasCycle`.

## ❓ Q1 — Does the subscription include the cycle tracker? **NEEDS AN ANSWER BEFORE BUILD**
Two readings of the instruction, very different outcomes:
- **(a) Subscription includes cycle** — the $8.99 one-time is an *alternative* for people who only
  want the tracker. ← **strongly recommended**
- **(b) Cycle is an add-on even for subscribers** — a paying subscriber is asked for another $8.99.
  This reads as a bait-and-switch, will generate refund requests and 1-star reviews.

Assume **(a)** unless told otherwise: attach the subscription product to **both** entitlements in
RevenueCat so subscribers get cycle automatically.

## ❓ Q2 — The two prices are identical, which makes the one-time hard to justify
$8.99/month for **everything** (with a free first month) versus $8.99 once for **one feature**.
A rational user compares them and takes the subscription every time — same price, more features,
first month free, cancel anytime. The one-time may simply never sell.

Options worth putting to the client:
- Price the cycle unlock **below** the subscription (e.g. $4.99) so it reads as the cheaper entry point
- Or price it **above** one month (e.g. $19.99) framed as "pay once, keep it forever"
- Or drop it and keep one simple product

Not a blocker — buildable as specified — but the client should decide knowingly.

## Products to create
| Platform | Product | Type | Price |
|---|---|---|---|
| App Store | `com.outstandingpartner.app.monthly899` | Auto-renewable sub, same subscription group | $8.99/mo + **1-month free intro offer** |
| App Store | `com.outstandingpartner.app.cycle` | **Non-Consumable** | $8.99 |
| Play | `com.outstandingpartner.app.monthly899` | Subscription, base plan `monthly` | $8.99/mo + **1-month free trial**, new-customer eligibility |
| Play | `com.outstandingpartner.app.cycle` | **One-time product** | $8.99 |
| RC Billing (web) | new $8.99/mo product | subscription | + 1-month trial |

⚠️ **Keep the old $21.99 monthly and $224.99 annual alive** (1 existing subscriber). Remove from the
offering only. **Unchanged across all four pricing revisions.**

⚠️ **Trial eligibility, again:** anyone who used the 7-day trial cannot get the 1-month trial —
same subscription group, one intro offer per account ever. `trialOf()` already degrades honestly.

## Code changes
1. **Keep** `trialOf()` / `chosenTrial()` / "$0 due today" — a subscription trial is back in play.
   (The v3 plan said delete them. Do **not**.)
2. **Remove the annual card**; paywall becomes a single $8.99/mo plan. `selectedPlan` → dead.
3. **Two entitlements** — see above. Biggest piece of work in WS2.
4. **New purchase point for the cycle unlock**, placed at the cycle feature itself, not on the main
   paywall (contextual upsell converts far better than a second option on the wall).
5. Auto-renew legal text at `Paywall.jsx:119` is **correct again** for the subscription — but the
   cycle purchase needs its own one-time wording next to its button.
6. Update store descriptions, landing page, and all three Meta ads ($21.99/7-day → $8.99/1-month).

## ⚠️ Housekeeping note — product sprawl
This is the **fourth** pricing model in three days ($21.99+$224.99 → $14.99/mo → $14.99 one-time →
$8.99/mo + $8.99 cycle). Store products **cannot be deleted** once created, only deactivated, and each
revision leaves permanent clutter in App Store Connect / Play / RevenueCat. Recommend we **hold this
model for the agreed 3 months** before changing again — and create the products only once Q1/Q2 are
settled, so we don't add another unused pair.

---

# ✅ WS2 + WS3 IMPLEMENTED — 2026-08-24

Final model (supersedes every earlier variant above): **$8.99/month, first month free, monthly
only, one entitlement (`premium`). No annual for new users. No separate cycle purchase.**

## What shipped (commit `ceea3aa`)

**The two hard gates are gone.** This was the whole point — 27 of 47 users left at the signup
wall and 0 of 19 converted on the paywall, because both were walls in front of an app nobody had
seen yet.

| Before | After |
|---|---|
| `showAuth = !authUser \|\| !emailVerified` — signup wall on launch | `showAuth = passwordRecovery \|\| authIntent \|\| (authUser && !emailVerified)` — opens only when asked for |
| Paywall rendered for every non-subscriber on launch | Paywall opens from `requirePremium()`, dismissible |
| Onboarding required `subscribed` | Onboarding shows to everyone |

**Access tiers** (`AppStateProvider.jsx`): `accessTier` = `anon` | `account` | `premium`, from
`hasAccount` + `isPremium`. Two helpers do all the gating — `requireAccount(screen)` opens
signup, `requirePremium()` opens signup for anon users and the paywall for signed-in ones.
Overlays auto-close via effects when `hasAccount` / `isPremium` flips true.

**Anonymous → account migration needs no code.** State was already localStorage-backed, and
`useCloudSync` seeds the remote row from the local snapshot when the remote is empty. Work done
before signing up uploads as-is on first login.

**Gating applied** (against `FEATURE_TIERING_FINAL.md`):

| Surface | Free | Premium |
|---|---|---|
| Today — cycle card | day + phase + one-line tip | `whatSheNeeds` playbook |
| Texts | 1/day | full 190+ library |
| Activities / date ideas | 3 + 3 | all 60 + 100 |
| Profile → Cycle | "Right Now" hero + read-only Phase Schedule | 28-day map, next-period prediction, week-ahead outlook |
| Profile → Game Plan | — | ✅ |
| Log (streak/history) | account required | |
| Remind ("She Said") | account required | |

**Paywall rewritten** — single $8.99 plan, no plan picker, dismissible, with a "what you unlock"
list. `selectedPlan` is now vestigial.

## Two bugs found and fixed on the way

- `PremiumGate` advertised a **$21.99 → $49.99 two-tier upgrade that does not exist**, and its
  `onUpgrade` called `setSubscribed(false)`. Under the old always-on wall that bounced you to the
  paywall; under the new model it would have **stripped a paying subscriber's access**.
- The signup screen sold *"Start your 7-day free trial — then $21.99/month"*. Signup grants no
  trial and takes no payment. Now: *"Create your free account."*

## Verified

Build clean, no console errors. Walked the anonymous flow in the browser: lands in onboarding
(not a wall) → Today shows day/phase/tip with the playbook locked → tapping a lock opens signup
→ ✕ dismisses it. Premium view re-checked under `VITE_DEV_AUTH_BYPASS` — the 28-day map,
prediction and week-ahead all still render.

## Still open

- **Store consoles** — see `PRICING_STORE_SETUP.md` (Apple, Play, RevenueCat, in that order).
- **WS4 reviews section** — Apple RSS only, hidden while empty.
- **WS1** — social login console setup, then the mandatory identity-linking test with a real
  paying account.
- Store listings, landing page and the three Meta ad creatives still quote $21.99 / 7 days.
- Mobile rebuild — the freemium change needs a build to reach phones.
