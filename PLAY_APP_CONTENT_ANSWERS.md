# Google Play — Store Listing Text + App Content Answers

Fill-in-the-blank answers for every item on the Play Console "Set up your app" checklist,
plus the Android store listing text adapted from the iOS App Store description.

> App: Outstanding Partner · Package `com.outstandingpartner.app` · Category: **Lifestyle**

---

## A. Store listing text  (Grow → Store presence → Main store listing)

### App name (30 char max)
```
Outstanding Partner
```

### Short description (80 char max)
```
Be the partner she brags about — daily missions, texts & date ideas for him.
```

### Full description (4000 char max)  ← Android version (Apple wording removed)
```
Most men love their partner. Very few know how to show it consistently.

Outstanding Partner is the daily system for husbands and boyfriends who want to become the partner their woman can't stop talking about.

Built on relationship science and cycle psychology, this app gives you exactly what to do, what to say, and when to do it. Every single day.

WHAT MAKES THIS DIFFERENT
Every other relationship app requires both partners to download it. Outstanding Partner is built exclusively for him. She never sees it. She just feels the difference.

YOUR DAILY SYSTEM
DAILY MISSION: One specific, actionable task matched to where she is in her cycle and what she needs today.
DAILY TEXT: A ready-to-send message tailored to her current emotional phase. 190+ texts that rotate so you never repeat yourself.
WEEKLY ACTIVITY: A new at-home activity every Monday (60 total).
MONTHLY DATE: A new date idea every month for every budget (100 total).

HER CYCLE CHANGES EVERYTHING
Women move through four distinct emotional phases every 28 days. Outstanding Partner adjusts your missions, texts, and activities to match:
Menstrual Phase: Comfort and zero pressure
Follicular Phase: Open, energized, receptive to plans
Ovulation Phase: Pursuit, attention, connection
Luteal Phase: Patience, service, emotional safety

THE 30/60/90-DAY CHALLENGE
90 daily missions across 4 levels. Men report their partners notice a fundamental shift by Day 14. By Day 90, you are a completely transformed partner.
Level 1: Foundation (Days 1-30)
Level 2: Advanced Partner (Days 31-60)
Level 3: Master Partner (Days 61-90)
Level 4: Lifelong Partner (Monthly missions, forever)

KNOW HER LIKE NEVER BEFORE
Build a complete profile of her favorites, love language, and important dates with 21-day advance reminders.
She Said Journal: Capture everything she mentions in passing. When you act on a passing comment weeks later, she knows you were listening.

WHAT'S INSIDE
190+ phase-matched text messages
60 cycle-matched at-home activities
100 date ideas for every budget
30/60/90-Day Partner Challenge
Full cycle tracker
Anniversary & birthday reminders
"She Said" capture journal
Brain chemistry insights
Seasonal campaigns (Valentine's, Christmas, etc.)
New content added monthly

WHO THIS IS FOR
Outstanding Partner is for men who are serious about stepping up. If you've ever thought, "I just don't know what she needs" - this app answers that question every single morning.

____________________

Outstanding Partner is an auto-renewable subscription.
- Monthly: $21.99/month, with a 7-day free trial
- Yearly: $224.99/year, with a 7-day free trial
Payment is charged to your Google Play account at confirmation of purchase. Your subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage or cancel anytime in your Google Play subscriptions.

Privacy Policy: https://outstandingpartner.app/privacy
Terms of Use: https://outstandingpartner.app/terms
```

> Changes from iOS: removed "charged to your Apple ID / Apple ID account settings" → Google Play
> wording; replaced the Apple EULA link with your own Terms page. Everything else is identical.

---

## B. App content checklist (each item on the Dashboard)

### 1. Privacy policy
```
https://outstandingpartner.app/privacy
```

### 2. Sign in details / App access  ← IMPORTANT, easy to fail review on
The app requires an account, and premium is gated — so the reviewer needs working credentials.
- Choose **"All or some functionality is restricted"**.
- Add an instruction with a **demo account** (see Section D — create one and grant it lifetime so no
  payment is needed and the reviewer sees full premium).
- Name: `Full app access` · Provide the email + password of the demo account. No OTP/2FA.

### 3. Ads
- **Does your app contain ads?** → **No.** (You run ads on Meta to promote the app; the app shows none.)

### 4. Content rating → see Section C.

### 5. Target audience and content
- **Target age group:** **18+** only (do NOT tick under-18 bands — avoids Families policy).
- **Appeal to children?** → No.
- **Store presence / ads to children?** → No.

### 6. Data safety → see Section E.

### 7. Government apps → **No**.

### 8. Financial features → **No** (no loans, crypto, banking, etc.).

### 9. Health apps → declare **Period tracking**
- The **Health features** form asks about health *features* (not just Health Connect). Your app
  has a menstrual-cycle tracker → tick **"Period tracking"** under Health and fitness. Tick **nothing
  else** (no fitness/nutrition/sleep/stress; no Medical items).
- **Health Connect?** → **No** (the app does not use the Health Connect API).
- **Regional requirements** (step 2) → not a medical device, no medical advice, complies with the
  privacy policy (which covers cycle data + deletion).
- ⚠️ Declaring Period tracking means Google's **health-data policy** applies: **health/cycle data must
  NOT be shared for advertising.** This is already satisfied — in Data safety the cycle data is
  "Health info → Collected, NOT shared." Keep it that way; only User IDs / Purchase history /
  App interactions / Advertising ID are shared with Meta.

### 10. Select app category and contact details
- **App category:** **Lifestyle** (primary). (Alt: Dating — but Lifestyle fits better and avoids Dating-category policies.)
- **Contact email:** a support email (e.g. support@outstandingpartner.app)
- **Website:** https://outstandingpartner.app · Phone: optional.

---

## C. Content rating questionnaire (IARC)

- **Category:** "Reference, News, or Educational" **or** "Utility, Productivity, Communication, or Other" — pick **Other/Utility** (this is a lifestyle/self-improvement tool, not a game).
- Answer the content questions honestly — for this app they're essentially all **No**:
  - Violence / scary content → No
  - Sexual content / nudity → **No explicit content.** (It's relationship advice with mild romantic themes; there's no explicit sexual material. If a "mild suggestive/romantic references" question appears, answer truthfully — it may yield a Teen rating, which is fine.)
  - Profanity → No
  - Controlled substances (drugs/alcohol/tobacco) → No
  - Gambling / simulated gambling → No
  - User-generated content shared with others → No (notes are private to the user)
- Submit → generates official ratings (likely **Everyone/Teen**). Enter your email for the IARC certificate.

---

## D. Demo/review account (do this before "App access")

The reviewer must reach full functionality without paying. Reuse the free-forever mechanism:

1. In the app (web `outstandingpartner.app/app` or a build), **sign up** a demo account, e.g.
   `review@outstandingpartner.app` with a strong password, and **verify its email**.
2. Grant it lifetime premium in **Supabase → SQL Editor** (same mechanism as our VIP grants):
   ```sql
   insert into public.lifetime_grants (email, note)
   values (lower('review@outstandingpartner.app'), 'Play review')
   on conflict (email) do nothing;

   insert into public.user_subscriptions (user_id, lifetime, entitlement, is_active)
   select id, true, 'premium', true from auth.users
   where email = lower('review@outstandingpartner.app')
   on conflict (user_id) do update set lifetime = true, is_active = true, updated_at = now();
   ```
3. Put those credentials in **App access** (Section B.2). Now the reviewer signs in and sees everything.

---

## E. Data safety wizard (5 steps)

**Step 1 Overview** → continue.
**Step 2 Data collection and security:**
- Does your app collect or share user data? → **Yes**
- Is all data encrypted in transit? → **Yes**
- Do you provide a way to request data deletion? → **Yes** (in-app account deletion) + give the app/URL.

**Step 3 Data types** — tick these (then set purpose + collected/shared in step 4):

| Category → Type | Collected | Shared |
|---|---|---|
| Personal info → **Email address** | ✅ | — |
| Personal info → **User IDs** | ✅ | ✅ (Meta) |
| Personal info → **Name** (if collected) | ✅ | — |
| Financial info → **Purchase history** | ✅ | ✅ (Meta) |
| Health & fitness → **Health info** (menstrual cycle) | ✅ | — |
| App activity → **App interactions** | ✅ | ✅ (Meta) |
| App activity → **Other user-generated content** (notes) | ✅ | — |
| App info & performance → **Crash logs** | ✅ | — |
| App info & performance → **Diagnostics** | ✅ | — |
| Device or other IDs → **Device or other IDs** (advertising ID) | ✅ | ✅ (Meta) |

**Step 4 Data usage and handling** — for each: mark Collected/Shared as above, and purposes:
- Email → App functionality, Account management
- User IDs / Advertising ID / Purchase history / App interactions → Analytics, **Advertising or marketing** (these are the Meta-shared ones)
- Health info (cycle) / User notes → **App functionality** only (not shared)
- Crash logs / Diagnostics → Analytics
- For each type: "Is this data required or optional?" → mostly Required; data processed **not** ephemeral.

**Step 5 Preview** → review → **Save**.

---

## Order to do it in
1. Store listing text (A) + assets (developer)
2. Privacy policy (B1)
3. Content rating (C)
4. Target audience (B5), Ads (B3), Government/Financial/Health (B7-9)
5. Demo account (D) → App access (B2)
6. Data safety (E)
7. App category + contact (B10)
→ then the release (see PLAY_STORE_DEVELOPER_GUIDE.md).
