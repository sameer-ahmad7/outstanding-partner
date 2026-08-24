# Store Setup — $8.99/month with the first month free

Everything you need to click through in **App Store Connect**, **Google Play Console** and
**RevenueCat** (both the store products *and* Web Billing / Stripe for the website) to put the
new pricing live. Follow the sections in order — RevenueCat is last because it needs the
products to exist in the stores first.

**The model:** $8.99/month · first month free · monthly only · one entitlement (`premium`).
There is no annual plan for new users and no separate cycle purchase.

---

## 0. Read this before you touch anything

**Three rules that will save you a lot of pain:**

1. **Never delete or deactivate the old products.** `…app.monthly` ($21.99) and `…app.yearly`
   ($224.99) stay exactly as they are. You have one paying subscriber on the old plan (~$19 MRR)
   and deactivating their product breaks their renewal. We take them out of the *offering* so new
   users never see them — the products themselves keep running quietly in the background.

2. **Store products can never be deleted, only deactivated.** So we create the new $8.99 product
   once, name it correctly the first time, and don't iterate. The product ID below is permanent.

3. **The introductory offer can only be used once per person, ever.** Apple counts it per
   *subscription group* per Apple ID; Google counts it per app per Google account. Anyone who
   already burned the old 7-day trial **will not get the free month** — they'll be charged $8.99
   immediately. That's a store rule, not something we can code around. It affects the ~19 people
   who saw the old paywall, and it's worth knowing before you read the first week's numbers.

**The product ID we're using everywhere:**

```
com.outstandingpartner.app.monthly899
```

---

## 1. App Store Connect

**App Store Connect → your app → Subscriptions**

### 1a. Create the subscription

Open your **existing subscription group** (the one holding `…app.monthly` and `…app.yearly`).
Do *not* create a new group — same-group products let a user switch plans and let Apple handle
upgrades/downgrades properly.

Click **+** and set:

| Field | Value |
|---|---|
| Reference Name | `Premium Monthly 8.99` (internal only) |
| Product ID | `com.outstandingpartner.app.monthly899` |
| Subscription Duration | **1 Month** |
| Price | **$8.99** USD (Apple auto-fills the other currencies) |

Then fill in, on the same screen:
- **Subscription Display Name** — `Premium` (this is what the user sees on the purchase sheet)
- **Description** — e.g. *"Her full cycle playbook, unlimited texts and activities, saved
  progress and phase-change reminders."*
- **Review Information** — a screenshot of the new paywall, or Apple will reject it.

### 1b. Add the free month

Still inside the new subscription → **Introductory Offers** → **+**

| Field | Value |
|---|---|
| Countries | All (or match your price territories) |
| Start Date | Today · **No End Date** |
| Type | **Free** |
| Duration | **1 Month** |

⚠️ Make sure you're creating an **Introductory Offer**, not a *Promotional Offer*. Promotional
offers need per-user signed tokens from your server; introductory offers are automatic. If you
pick the wrong one the trial silently never appears in the app.

### 1c. Take the old plans out of circulation — but leave them running

Nothing to do here. Apple has no "hide from new users" switch; that's handled entirely by the
RevenueCat offering in step 3. **Leave `…app.monthly` and `…app.yearly` in "Approved" state.**

### 1d. Submit

The new subscription goes to **"Waiting for Review"** and is reviewed with your next app build,
*or* on its own if the app is already live. Status must reach **"Approved"** before RevenueCat
can see it.

---

## 2. Google Play Console

**Play Console → your app → Monetise → Products → Subscriptions**

### 2a. Create the subscription

Click **Create subscription**:

| Field | Value |
|---|---|
| Product ID | `com.outstandingpartner.app.monthly899` |
| Name | `Premium` |

### 2b. Add the base plan

Inside the new subscription → **Add base plan**:

| Field | Value |
|---|---|
| Base plan ID | `monthly` |
| Type | **Auto-renewing** |
| Billing period | **Monthly** |
| Price | **$8.99** USD (+ set your other regions) |
| Renewal type | Auto-renewing |

**Activate** the base plan.

> **This is the `:basePlanId` thing you flagged.** Play's full product reference is
> `com.outstandingpartner.app.monthly899:monthly` — the subscription ID with the base plan ID
> appended. That's the string RevenueCat expects in step 3. **The app never sees it.** Our code
> reads `packageType`, `product.priceString` and `product.introPrice` off whatever RevenueCat
> returns, and RevenueCat normalises Play's `product:baseplan` form into the same shape as
> Apple's. Nothing to change in the app for Android.

### 2c. Add the free month

On the `monthly` base plan → **Offers** → **Create offer**:

| Field | Value |
|---|---|
| Offer ID | `freemonth` |
| Eligibility | **New customer acquisition** → *Never had a subscription to this product* |
| Phase | **Free trial**, duration **1 month** |

**Activate** the offer. An offer left in Draft does not appear in the app.

### 2d. Leave the old products alone

Same as Apple — `…app.monthly` and `…app.yearly` stay **Active**. Do not archive them.

---

## 3. RevenueCat

**This is the step that actually changes what users see, and it takes effect immediately —
no app update, no store review.** That's why the pricing can change without shipping a build.

**app.revenuecat.com → project `847e870a`**

### 3a. Register the products

**Products → + New**, twice:

| Store | Product identifier |
|---|---|
| App Store | `com.outstandingpartner.app.monthly899` |
| Play Store | `com.outstandingpartner.app.monthly899:monthly` |

Note the Play one carries the `:monthly` base plan suffix. Apple's does not.

### 3b. Attach them to the entitlement

**Entitlements → `premium` → Attach products** → attach **both** new products.

The app has exactly one entitlement check (`premium`), so this is what actually unlocks the
paid features. Miss this step and people will pay and get nothing.

### 3c. Rebuild the offering

**Offerings → `default` (`ofrnga89dbb10da`)**

1. Open the **Monthly** package (`$rc_monthly`) → **Attach product** → add the App Store
   `…monthly899` **and** the Play `…monthly899:monthly`. One product per platform per package.
2. **Remove the `$rc_annual` package from the offering entirely.**
3. If `$rc_monthly` still has the old $21.99 products attached, **detach them** — a package
   holds one product per store, and the new one has to be the one that's there.

⚠️ **Removing `$rc_annual` does not cancel anybody.** Offerings only control what the app is
*shown*. The existing annual subscriber keeps renewing through their original product, and their
`premium` entitlement stays active because that product is still attached to the entitlement in
step 3b. Don't detach the old products from the **entitlement** — only from the **offering**.

### 3d. Confirm

**Offerings → default** should now read: one package, `$rc_monthly`, two products (App Store +
Play), $8.99. That's what the app fetches.

---

## 3b. RevenueCat Web Billing (Stripe) — the website

**Don't skip this.** Web Billing products are **completely separate** from App Store and Play
products. Creating `…monthly899` in the two stores does nothing for outstandingpartner.app —
the website will keep selling $21.99/7-day until you do this part.

Today the web app sells `op_web_monthly` ($21.99) and `op_web_yearly` ($224.99), both with a
7-day trial, through RevenueCat Web Billing backed by Stripe.

### 3b-1. Create the new web product

**RevenueCat → Products → + New product → app: `Outstanding Partner Web`**

| Field | Value |
|---|---|
| Identifier | `op_web_monthly899` |
| Price | **$8.99** USD |
| Billing period | **Monthly**, auto-renewing |
| Free trial | **1 month** |

**You do not create anything in the Stripe dashboard.** RevenueCat creates the matching Stripe
price for you. If you hand-create a price in Stripe it won't be linked to a RevenueCat product
and purchases won't grant the entitlement.

### 3b-2. Attach + add to the offering

- **Entitlements → `premium` → Attach** `op_web_monthly899`.
- **Offerings → `default` → `$rc_monthly` → Attach product** → add `op_web_monthly899`.

So `$rc_monthly` ends up holding **three** products — one per platform:

| Platform | Product in `$rc_monthly` |
|---|---|
| App Store | `com.outstandingpartner.app.monthly899` |
| Play Store | `com.outstandingpartner.app.monthly899:monthly` |
| Web Billing | `op_web_monthly899` |

That's the whole trick: **one offering, one package, three products.** RevenueCat serves
whichever one matches the platform the user is on, which is why iOS, Android and web all show
$8.99 without any per-platform code.

- Detach `op_web_monthly` / `op_web_yearly` from the **offering** (and drop `$rc_annual`
  entirely, as in step 3c). Leave them attached to the **`premium` entitlement** so any existing
  web subscriber keeps their access and keeps renewing.

### 3b-3. No code change is needed

The web SDK already normalises into the shape the paywall reads
(`src/services/revenuecatWeb.service.js`): `$rc_monthly` → `packageType: 'MONTHLY'`, and the
ISO-8601 trial `P1M` → `introPrice: { price: 0, periodUnit: 'month', periodNumberOfUnits: 1 }`.
The rewritten paywall picks the monthly package and renders **"1 month free, then $8.99/mo"**
and **"Start My Free Month"** off exactly those fields. Verified against the installed
`@revenuecat/purchases-js` enum.

The web app *does* need a redeploy — but for the **freemium** changes, not the price.

### 3b-4. Testing web checkout without spending money

The app has a sandbox switch built in:

```
https://outstandingpartner.app/app?rcsandbox=1
```

That flips to the `rcb_` **sandbox** key (Stripe test mode) and remembers it in localStorage, so
you can run a full checkout with test card `4242 4242 4242 4242`, any future expiry, any CVC.
Clear it with `?rcsandbox=0` when you're done — **it persists until you do.**

> ⚠️ Create the $8.99 product in **both** the sandbox and production Web Billing setups if
> RevenueCat has them split, or the sandbox test will show the old price.

### 3b-5. One difference worth knowing about the web trial

Trial eligibility on web is tracked **per RevenueCat customer** — which for us is the Supabase
user id — not per Apple ID or Google account. Practical consequences:

- Someone who burned the 7-day trial on **iPhone** may still be offered the free month on
  **web**, because they're different eligibility systems (unless it's the same RevenueCat
  customer, i.e. they signed in with the same account).
- Conversely, a new email address on the website is a new customer and gets a fresh free month.
  If that becomes a problem, it's a Stripe-side abuse question, not something the app controls.


---

## 4. Verify it worked

The paywall reads everything from the store at runtime, so these checks confirm all three
consoles at once.

**In the app (sandbox / internal testing):**

1. Open the app as a *new* user and tap any 🔒 lock.
2. The upgrade sheet must show **`$8.99/mo`** and **"1 month free, then $8.99/mo"**.
   - If it shows *"Plans couldn't be loaded"* → the products aren't Approved/Active yet, or
     they're not attached to the offering.
   - If the price is right but there's **no trial line** → the introductory offer / Play offer
     isn't active, or your test account already used a trial.
3. The button reads **"Start My Free Month"**, and above it **"$0 due today"**.
4. Complete a sandbox purchase → the locks disappear immediately.

**On the website** (`outstandingpartner.app/app?rcsandbox=1`): same paywall, same $8.99 and
free-month lines, and the Stripe checkout opens with test card `4242 4242 4242 4242`.

**In RevenueCat → Customer History:** the test purchase appears with the right product
(`…monthly899` on mobile, `op_web_monthly899` on web), entitlement `premium` active, and a
**trial** period.

**Important:** the trial only shows for accounts that have never had one. Use a fresh sandbox
tester on iOS and a fresh licence-tester Google account on Android, or you'll see full price
and think something is broken.

---

## 5. What's left after the consoles are done

These are *not* store tasks, but the pricing isn't really "changed" until they're done — right
now several places still advertise $21.99 and a 7-day trial:

- [ ] **App Store / Play store listings** — descriptions still quote the old price
- [ ] **Landing page** (`web-legal/index.html`) — pricing copy
- [ ] **The three Meta ad creatives + copy** — all say "7 days free"
      (they're still in Draft, so this is free to fix)
- [ ] **Ship a mobile build** — not needed for the price change itself, but needed for the
      freemium changes that make the new paywall reachable in the first place
- [ ] **Redeploy the web app** — likewise: the price comes from RevenueCat, but the freemium
      changes need a deploy

---

## Quick reference

| | Old (keep alive, hidden) | New |
|---|---|---|
| Monthly | `…app.monthly` — $21.99 | **`…app.monthly899` — $8.99** |
| Annual | `…app.yearly` — $224.99 | *(none)* |
| Play ref | `…app.monthly:monthly` | **`…app.monthly899:monthly`** |
| Web (Stripe) | `op_web_monthly` — $21.99 · `op_web_yearly` — $224.99 | **`op_web_monthly899` — $8.99** |
| Trial | 7 days | **1 month, free** |
| Entitlement | `premium` | `premium` (unchanged) |
| In `default` offering | ❌ remove both | ✅ `$rc_monthly` only |
