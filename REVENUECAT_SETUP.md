# Subscriptions Setup Guide — App Store Connect + RevenueCat

How to create the subscription products and connect them so **Outstanding Partner** unlocks
after purchase. The app is **subscription-only** (hard paywall, no free tier).

## Plan summary

| Plan | Price | Free trial | Suggested product ID |
|------|-------|-----------|----------------------|
| Monthly | **$21.99 / month** | 7 days | `com.outstandingpartner.app.monthly` |
| Yearly  | **$224 / year** | 7 days | `com.outstandingpartner.app.yearly` |

- Entitlement (RevenueCat): **`premium`**
- Offering (RevenueCat): **`default`** with a **Monthly** and an **Annual** package.
- Note on $224: the App Store uses fixed price points — pick the closest tier (often **$223.99**). The app shows the **store's** localized price automatically, so whatever tier you choose is what users see.

---

## Part A — App Store Connect (iOS)

### A1. One-time account setup
1. **Agreements:** App Store Connect → **Business** → sign the **Paid Applications Agreement** and complete **bank + tax** info. (Subscriptions can't go live until this is "Active".)
2. **App record:** Apps → **＋** → New App → bundle id **`com.outstandingpartner.app`**, name **Outstanding Partner**.

### A2. Create the subscription group
1. Your app → **Monetization → Subscriptions** → **Create** a Subscription Group, e.g. **"Outstanding Partner Access"**.
2. A group lets users switch between monthly/yearly without double-paying.

### A3. Create the two subscription products
For **each** (Monthly, then Yearly):
1. Inside the group → **＋ (Create Subscription)**.
2. **Reference Name:** `Monthly` / `Yearly` (internal only).
3. **Product ID:** `com.outstandingpartner.app.monthly` / `…​.yearly` (must match RevenueCat).
4. **Duration:** 1 Month / 1 Year.
5. **Subscription Price:** set $21.99 / closest tier to $224.
6. **Localization (App Store Information):** add a display name + description (e.g. "Full access to Outstanding Partner").
7. **Review Information:** add a screenshot of the paywall + notes.

### A4. Add the 7-day free trial (Introductory Offer)
1. Open each product → **Introductory Offers** → **＋**.
2. Type: **Free**, Duration: **1 week**, Territories: All.
3. (Repeat for both monthly and yearly.)

### A5. Status
New products show **"Ready to Submit"** — they're submitted **with the app's first review** (or you can submit the app and they review together). Sandbox testing works before approval.

---

## Part B — RevenueCat

### B1. Add the iOS app
1. RevenueCat → your **Project** → **＋ New app** → **App Store**.
2. App bundle id: `com.outstandingpartner.app`.
3. **In-App Purchase Key:** in App Store Connect → **Users and Access → Integrations → In-App Purchase** → generate an **In-App Purchase Key**, download the `.p8`, and upload it to RevenueCat (with the Key ID + Issuer ID). This lets RevenueCat validate purchases.

### B2. Import products
1. RevenueCat → **Products** → **＋** → add `com.outstandingpartner.app.monthly` and `…​.yearly` (import from App Store Connect if offered).

### B3. Entitlement
1. **Entitlements** → **＋** → identifier **`premium`**.
2. Attach **both** products to the `premium` entitlement.

### B4. Offering + packages
1. **Offerings** → ensure a **`default`** offering exists and is **Current**.
2. Add packages: **Monthly** → monthly product; **Annual** → yearly product.
   (The app looks up packages by type MONTHLY / ANNUAL.)

### B5. Get the public SDK keys → app
1. RevenueCat → **API keys** → copy the **Apple public key** (`appl_…`) and **Google public key** (`goog_…`).
2. Put them in the app's `.env`:
   ```
   VITE_REVENUECAT_IOS_API_KEY=appl_xxxxxxxx
   VITE_REVENUECAT_ANDROID_API_KEY=goog_xxxxxxxx
   ```
3. Rebuild: `npm run build && npx cap sync`.

> The code already reads these and the `premium` entitlement — no code change needed once the keys are in `.env`.

---

## Part C — Google Play (Android) — when you're ready

1. Play Console → create the app (package `com.outstandingpartner.app`).
2. **Monetize → Subscriptions** → create a subscription with base plans `monthly` ($21.99) and `yearly` ($224), each with a **7-day free trial** offer.
3. RevenueCat → **＋ New app → Play Store**; upload a **Play service-account JSON** (Play Console → API access) so RevenueCat can validate.
4. Add the same products to the `premium` entitlement + `default` offering (Android packages).

---

## Part D — Apple review & compliance (subscription-only apps)

Subscription-gated apps **are allowed**, but reviewers must be able to get in and the paywall must disclose terms. We've already implemented the required pieces; the rest is what **you** do at submission.

**Already in the app ✅**
- Native IAP only (RevenueCat) — no external/Stripe checkout for digital access.
- Paywall shows **price, billing period, 7-day trial, auto-renew disclosure**, **Restore Purchases**, and **Terms of Use + Privacy Policy** links.
- **Account deletion** in-app (Apple Guideline 5.1.1(v)).
- Privacy Policy + Support reachable **without logging in**.
- No third-party social login → **Sign in with Apple not required**.

**What you do for review (to avoid rejection)**
1. **Give reviewers access without paying** — the clean, compliant way:
   - RevenueCat → **Customers** → after the reviewer account signs up once, find that app-user, and **grant a Promotional Entitlement** (`premium`, e.g. 1 month). Then the reviewer logs in and is in.
   - Put the **demo email + password** in **App Review Information → Sign-In required → notes**, and mention "premium access has been granted to this account."
   - (Alternatively, sandbox-test the purchase — but a pre-granted demo account is the most reliable.)
   - ⚠️ Do **not** special-case reviewers in code (different behavior for review violates the guidelines). The promo-entitlement approach is legitimate.
2. **App Privacy "nutrition label"** in App Store Connect: declare email (account), health (cycle) data, and purchases; mark **not used for tracking**, **not sold**.
3. Make sure the **Paid Apps Agreement is Active** and products are at least "Ready to Submit", submitted with the build.

**Common rejection reasons & how we avoid them**
- *"Just a paywall / value unclear"* → onboarding + the paywall's feature framing demonstrate value.
- *"No restore"* → Restore Purchases button present.
- *"Missing terms/auto-renew text"* → present on the paywall.
- *"Can't access app for review"* → promo-entitlement demo account in review notes.

There is **no legitimate way to "bypass" review** — but with the above, a subscription-only app passes routinely.

---

## Part E — Testing the purchase

- **iOS sandbox:** create a **Sandbox Apple ID** (App Store Connect → Users and Access → Sandbox), sign into it on a **real device** (or iOS 18+ simulator), then run the app and tap **Start 7-Day Free Trial**. (Note: the **iOS 17.5 simulator can't run the RevenueCat build** — `SwiftUICore` missing; use iOS 18+ or a device.)
- **Android:** add license testers in Play Console, use an **Internal testing** track.
- After a sandbox purchase, the app's `premium` entitlement activates and the paywall is replaced by the app.

## Quick checklist
- [ ] Paid Apps Agreement active
- [ ] Subscription group + monthly + yearly created, 7-day trial on each
- [ ] RevenueCat iOS app + IAP key uploaded
- [ ] Products → `premium` entitlement → `default` offering (Monthly + Annual)
- [ ] `appl_…` / `goog_…` keys in `.env`, rebuilt
- [ ] Sandbox purchase verified
- [ ] Reviewer demo account + promo entitlement + review notes
