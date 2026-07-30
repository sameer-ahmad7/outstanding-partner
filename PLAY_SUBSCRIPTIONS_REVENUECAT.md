# Google Play Subscriptions + RevenueCat Setup

Create the Play subscription products, connect RevenueCat to Play, and add the products to your
existing offering — so Android matches iOS + Web ($21.99/mo, $224.99/yr, 7-day free trial).

> **The app code needs no changes.** It reads price/trial/tier from the RevenueCat offering
> dynamically (no hardcoded IDs). RevenueCat maps Play's `product:baseplan` format to a package —
> the app just sees `packageType MONTHLY/ANNUAL`, `product.priceString`, `product.introPrice`.

**Ordering note:** you must **upload an AAB to a Play track (internal testing) first** — Play won't
activate subscription products until the app has a release with billing. So: build+upload the AAB
(see `PLAY_STORE_DEVELOPER_GUIDE.md`) → then do the steps below.

---

## 1. Create the subscriptions in Play Console

**Monetize → Products → Subscriptions → Create subscription.** Make **two**, mirroring iOS:

### Monthly
- **Product ID:** `com.outstandingpartner.app.monthly`  *(permanent, can't change later)*
- **Name:** `Outstanding Partner Monthly`
- **Base plan:** ID `monthly` · **Auto-renewing** · Billing period **Monthly** · Price **$21.99**
- **Offer (free trial):** on the `monthly` base plan → **Add offer** → type **Free trial** →
  eligibility **New customers** → duration **1 week** → price **Free**.
- Full reference RevenueCat uses: **`com.outstandingpartner.app.monthly:monthly`**

### Yearly
- **Product ID:** `com.outstandingpartner.app.yearly`
- **Name:** `Outstanding Partner Yearly`
- **Base plan:** ID `yearly` · **Auto-renewing** · Billing period **Yearly** · Price **$224.99**
- **Offer (free trial):** on `yearly` base plan → **Add offer** → **Free trial** → **New customers** →
  **1 week** → Free.
- Full reference: **`com.outstandingpartner.app.yearly:yearly`**

**Activate** each base plan + offer (they must be Active, not draft). Set prices for the countries
you'll sell in (start with your primary markets; Play converts from USD if you use the pricing template).

> Product IDs are lowercase, permanent, and can't be reused if deleted — type them carefully.

---

## 2. Connect RevenueCat to Google Play (service account)

RevenueCat needs a Google service account to validate purchases + read product info.

1. **Google Cloud Console** (the project linked to Play — usually auto-created):
   - APIs & Services → **Enable** the **Google Play Android Developer API**.
   - IAM & Admin → Service Accounts → **Create service account** (name `revenuecat`) → **Create key →
     JSON** → download the JSON.
2. **Play Console → Users and permissions → Invite new users:**
   - Add the service account's email (looks like `revenuecat@…​.iam.gserviceaccount.com`).
   - Grant account permissions: **View financial data, orders, and cancellation survey responses** +
     **Manage orders and subscriptions**.
3. **RevenueCat → Project settings → your Android app** (create the Android app in RC if it doesn't
   exist: Apps → New → Google Play, package `com.outstandingpartner.app`):
   - **Service Account credentials JSON** → upload the JSON from step 1.
   - RC shows "valid" once Google grants propagate (can take up to ~36 h for a brand-new service
     account, usually much faster).
4. Grab the Android **public SDK key** (`goog_…`) from RC → App → API keys → put it in `.env` as
   `VITE_REVENUECAT_ANDROID_API_KEY` (the app already reads this).

---

## 3. Add the Play products to RevenueCat

**RevenueCat → Product catalog → Products → New → Google Play:**
- Add **`com.outstandingpartner.app.monthly:monthly`** → attach entitlement **`premium`**.
- Add **`com.outstandingpartner.app.yearly:yearly`** → attach entitlement **`premium`**.

*(Enter them in `subscriptionId:basePlanId` form. RC auto-detects the base plan + the free-trial offer.)*

---

## 4. Add them to your existing offering

**RevenueCat → Product catalog → Offerings → `default`** (the current offering iOS/Web use):
- Open the **Monthly** package (`$rc_monthly`) → **Add product** → select the Google
  `…monthly:monthly` product (each package holds one product per platform: App Store + Play + Web).
- Open the **Annual** package (`$rc_annual`) → add the Google `…yearly:yearly` product.

Now the **same offering** returns the App Store product on iOS, the Play product on Android, and the
Web product on web — all under the same `premium` entitlement, so cross-platform sync keeps working.

---

## 5. Test on Android (no real charge)

1. **Play Console → License testing** (Setup → License testing, or Settings) → add tester Gmail
   accounts → they get **sandbox purchases** (no charge, accelerated renewals).
2. Install the app from the **Internal testing** track (opt-in link) with a license-tester account.
3. Open the paywall → it should show **$21.99 / $224.99 + "1-week free trial"** (pulled from RC).
4. Subscribe → premium unlocks → verify in RevenueCat → Customers.
5. Confirm cross-platform: same account signed in on web/iOS shows premium too.

---

## Price / trial parity checklist (must match across platforms)
| | Monthly | Yearly | Trial |
|---|---|---|---|
| App Store | $21.99 | $224.99 | 7 days |
| Google Play | $21.99 | $224.99 | 1 week |
| Web (Stripe) | $21.99 | $224.99 | 1 week |

If the Android paywall shows the fallback `$21.99 / $224.99` and "7-day free trial" **generically**
(not from the store), the offering isn't wired yet — recheck steps 3–4 and that the base plans +
offers are **Active**. If the price shows but the **trial doesn't**, the free-trial **offer** isn't
set to **New customers / eligible** — fix that on the base plan.

## Why no app code change
The paywall (`src/components/paywall/Paywall.jsx`) + `useSubscription.js` read `packageType`,
`product.priceString`, and `product.introPrice` from whatever RC returns. RC normalizes Play's
`product:baseplan` to `packageType MONTHLY/ANNUAL` and surfaces the trial as `introPrice`. So the
Play `:base_plan` suffix, the trial, and the price are all handled — no hardcoded IDs, nothing to change.
