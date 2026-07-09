# Outstanding Partner — Web Phase (Scope & Definition)

*A plain-English definition of the web build, to review and approve before development starts.*

---

## What we're building

Extend Outstanding Partner from mobile-only to a full **web presence** at **outstandingpartner.app**, built from the **same codebase** as the apps so features stay in sync across iPhone, Android, and web.

It has three public-facing parts plus the app:

1. **Marketing landing page** — a **bright, professional, and welcoming** page ("Be the Partner She Brags About"), built to turn paid Meta (Facebook/Instagram) ad traffic into downloads and web sign-ups. Fast, mobile-first, SEO-ready. **Public — no login.** *(Per your direction, a lighter, more inviting look — not the dark style in the original brief. We'll share 2–3 palette options for approval. The app itself keeps its existing look.)*

2. **Web app** — the full Outstanding Partner app running in a browser: the same daily missions, texts, activities, cycle tracking, challenge, profile, etc. as mobile. Users sign in and their data **syncs across all their devices**. **Login required (same as the mobile app).**

3. **Legal pages (Privacy + Support)** — your existing pages, kept **publicly accessible (no login)** and folded into the web presence.

Payments on the web run through **Stripe** (via RevenueCat), and a subscription bought anywhere — web, iPhone, or Android — **unlocks premium everywhere**.

---

## What it enables

- **Subscribe on the web with a card (Stripe)** — a sign-up path that doesn't depend on the App Store / Play Store.
- **One subscription across all platforms.** Subscribe on web → premium on your phone, and vice-versa. A self-serve "Manage subscription" link lets users update or cancel.
- A **conversion-optimized landing page** purpose-built for your Meta ads.
- **Full Meta ad tracking** — website Pixel + app tracking + server-side — so **Ads Manager** can measure and optimize who installs, starts a trial, and actually subscribes.
- A **"notify me" waitlist** on the landing page for Android while Google Play is pending — emails are stored so you can email everyone the day you launch.

---

## What we need from you

- **Stripe** account (done ✓) — we'll connect it to RevenueCat Web Billing.
- **RevenueCat** access (done ✓).
- **Meta:** the **Pixel/Dataset ID**, **Facebook App ID**, and **Client Token** (in progress).
- **Google Play Console** access (for the Android submission).
- Final **App Store / Google Play listing URLs** for the landing-page buttons (once each is live).

---

## Delivery sequence (phased)

1. **Web app** — the shared app running in the browser with sign-in + cross-device sync.
2. **Web payments** — Stripe via RevenueCat Web Billing, cross-platform premium sync, and the manage-subscription link.
3. **Landing page + waitlist + legal pages** — your content, all public, live on outstandingpartner.app.
4. **Play Store release** — build the signed Android app, complete the Play listing + Data Safety, and publish it **live on Google Play** (internal testing → production). At go-live we email the Android waitlist.
5. **Meta ads (last)** — the tracking (website Pixel + server-side conversions + app SDK), the **Ads Manager campaign setup** (audiences, conversion optimization, app + web campaigns), and **marketing training for you** — a live walkthrough plus a written runbook so you can create, read, and manage campaigns yourself.

Each phase is verified before moving on. (Meta is last because it measures the full funnel — website visit → install → trial → paid — which only exists once everything above is live.)

---

## Notes & assumptions

- **Hosting:** everything stays on your existing setup (Firebase Hosting + the outstandingpartner.app domain) rather than a second host, so there's one place to manage.
- **Store compliance:** the mobile apps keep using Apple/Google in-app purchases; the **Stripe/web pricing lives only on the website** — Apple/Google don't allow linking to outside payment from inside the app (this is the same rule that caused the earlier App Store rejection, so we keep them cleanly separate).
- **Privacy for ads:** adding Meta tracking means the iPhone app must show an **"Allow tracking?"** prompt and we update the App Store / Play privacy labels — included in this phase.
- The attached landing-page HTML is the **structure + copy source of truth** (sections, headlines, the 6 reasons) — but the **colors change to a bright/professional/welcoming palette** per your direction (the attached version is dark). We keep the compass logo, adapt the rest (real store links, Android waitlist, "start on web" option, Pixel, hosted on Firebase), and share palette options for approval.
