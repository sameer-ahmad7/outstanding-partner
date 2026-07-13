# RevenueCat Web Billing + Stripe — setup guide (Phase 2 prerequisite)

Goal: let people subscribe on the **website** with a card (Stripe), with the subscription
**synced across web + iPhone + Android** and a self-serve "Manage subscription" link. We do
this with **RevenueCat Web Billing** (RevenueCat's own hosted checkout, powered by Stripe) —
NOT the legacy "Stripe" import. Web Billing gives us the hosted checkout, the management URL,
and the `@revenuecat/purchases-js` SDK, which is what the app uses.

When this is done, send the developer the **`rcb_` Web Billing public API key** and confirm
the offering has the two web products — then the code side gets built + tested.

---

## Part A — Stripe account (the payment processor)

1. **Create / sign in** at https://dashboard.stripe.com.
2. **Activate the account** (required for live payments): Business details, address, tax ID
   (if a company), a **bank account** for payouts, and **identity verification**.
   - You can start entirely in **Test mode** (toggle top-right) and flip to live later —
     recommended so we can test checkout with test cards before real money moves.
3. You do **not** need to manually create products in Stripe — RevenueCat Web Billing creates
   the Stripe prices for you when you create products in RevenueCat (Part C). Just make sure
   the Stripe account exists and (for live) is activated.

*(That's all on the Stripe side for now — the connection happens from RevenueCat in Part B.)*

---

## Part B — Connect Stripe to RevenueCat (create the Web Billing app)

1. Go to https://app.revenuecat.com → open the **Outstanding Partner** project.
2. **Project settings → Apps** (a.k.a. Platforms) → **+ New** → choose **Web Billing**
   (may be shown as "RevenueCat Billing" / "Web").
   - Name it: **Outstanding Partner Web**.
3. In the Web Billing app setup, **Connect Stripe**:
   - Click **Connect with Stripe** → you'll be sent to Stripe to **authorize** → pick the
     Stripe account from Part A → approve. You'll land back in RevenueCat, connected.
4. **Configure the hosted checkout / store branding:**
   - Store/app name: **Outstanding Partner**
   - Support email: **support@outstandingpartner.app**
   - Logo: the compass icon (`assets/icon.png`), brand color `#C0392B`.
   - **Return URLs** (where the customer goes after checkout):
     - Success: `https://outstandingpartner.app/app`
     - Cancel: `https://outstandingpartner.app/app`
5. (Optional but recommended) Enable **Stripe Tax** later if you need tax collection — skip
   for now.

---

## Part C — Create the web products in RevenueCat

1. RevenueCat → **Products** → **+ New product** → select the **Outstanding Partner Web** app.
2. Create **two** products (RevenueCat creates the matching Stripe prices automatically):

   | Product | Identifier (suggested) | Price | Billing | Free trial |
   |---|---|---|---|---|
   | Monthly | `op_web_monthly` | **$21.99** | Monthly, auto-renew | **7 days** |
   | Yearly  | `op_web_yearly`  | **$224.99** | Yearly, auto-renew | **7 days** |

   - Currency: **USD**.
   - Set the **7-day free trial** as the intro offer on each.

---

## Part D — Attach to the SAME entitlement (this is what unifies platforms)

1. RevenueCat → **Entitlements** → open **`premium`** (the same entitlement the iOS/Android
   products already use — do **not** make a new one).
2. **Attach** both web products (`op_web_monthly`, `op_web_yearly`) to `premium`.
   - Result: a subscription bought on web grants the same `premium` entitlement as a mobile
     purchase → access is unified everywhere.

---

## Part E — Add them to the current Offering

1. RevenueCat → **Offerings** → open your **current** offering (the one marked "Current";
   the app reads `offerings.current`).
2. Add/confirm packages **Monthly** and **Annual**, with the **web products** attached for the
   web app. RevenueCat serves the right product per platform automatically, so the same
   offering works for iOS, Android, and Web.
3. Make sure the offering is set as **Current**.

---

## Part F — Get the Web Billing public API key → send to developer

1. RevenueCat → **Project settings → API keys**.
2. Copy the **Web Billing public API key** — it starts with **`rcb_…`**.
3. **Send it to the developer.** It goes in `.env` as `VITE_REVENUECAT_WEB_API_KEY`
   (public key, safe in the client).

---

## Part G — Test mode (before going live)

- Keep **Stripe in Test mode** while we build. RevenueCat Web Billing uses Stripe test mode,
  so we can run the full flow with test cards (e.g. `4242 4242 4242 4242`, any future expiry,
  any CVC) — no real charges.
- Once verified, activate Stripe (live) and flip the Web Billing app to production.

---

## What the developer does after you send the `rcb_` key (the code side)

- Install `@revenuecat/purchases-js`; add `VITE_REVENUECAT_WEB_API_KEY` to `.env`.
- Configure it with **`app_user_id` = the Supabase user id** (identical to native → the same
  RevenueCat customer across web + iPhone + Android → automatic cross-platform sync).
- Wire the web paywall's purchase button to the **RevenueCat Web Billing checkout**.
- Wire "Manage subscription" to the RevenueCat **management URL** (Stripe customer portal on
  web; native store page on mobile).
- Build, deploy to `/app`, and **test end-to-end in Stripe test mode**: subscribe on web →
  `premium` unlocks in the web app AND on the same account on mobile; cancel via the
  management URL; verify entitlement.

---

## Checklist to hand back to the developer
- [ ] Stripe connected to RevenueCat Web Billing (Part B)
- [ ] Web products created — Monthly $21.99 / Yearly $224.99, 7-day trial (Part C)
- [ ] Both attached to the **`premium`** entitlement (Part D)
- [ ] Both in the **current** offering as Monthly/Annual packages (Part E)
- [ ] **`rcb_` Web Billing public API key** sent to developer (Part F)

Common sticking points: forgetting to attach products to the **current** offering (the app
would see an empty offering), or attaching to a **new** entitlement instead of `premium`
(access wouldn't unify with mobile). If the offering looks empty or entitlement doesn't
resolve, send a screenshot of the Offerings + Entitlements pages and I'll pinpoint it.
