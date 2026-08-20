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
