# Account setup guide — Web app, Stripe, and Meta Ads

This is a step-by-step guide for the **client** to create the accounts we need for the web app, payments, and Meta advertising, and to **add the developer** to each so we can build and configure everything.

> Add the developer to every platform below using this email: **[DEVELOPER EMAIL]**
> (Use the same email everywhere so access is consistent.)

---

## 1. Stripe (web payments)

We'll take web/website payments through Stripe, connected to RevenueCat so your subscriptions stay in sync across the website, iPhone, and Android.

**Create the account**
1. Go to **https://stripe.com** → **Start now / Sign up**.
2. Enter your email, full name, and a password; verify the email.
3. Choose your **country** (this can't be changed later — pick where the business is registered).
4. Click **Activate account** and complete the business profile:
   - Business type (individual or company) and address
   - Tax ID / EIN (if a company)
   - A **bank account** for payouts
   - ID verification (photo of ID)
   *(Until the account is activated you can only run test payments — activation is required to accept real money.)*

**Add the developer**
1. In Stripe, click the **gear icon (Settings)** → **Team and security** → **Team**.
2. Click **+ New member**, enter **[DEVELOPER EMAIL]**.
3. Set the role to **Administrator** (needed to create products and connect RevenueCat).
4. Send the invite.

*(You don't need to build anything in Stripe yourself — once I'm added, I connect it to RevenueCat and set up the products.)*

---

## 2. RevenueCat (already have this — just add the developer + we connect Stripe)

RevenueCat is the single "source of truth" for subscriptions across all platforms and provides the "Manage subscription" link for web subscribers.

**Add the developer**
1. Go to **https://app.revenuecat.com** → your project.
2. **Project settings** → **Collaborators** (or **Team**) → **Invite**.
3. Enter **[DEVELOPER EMAIL]**, role **Admin** (or Developer). Send.

*(After Stripe is created and I'm added to both, I'll connect Stripe to RevenueCat's Web Billing and create the web products.)*

---

## 3. Meta Business Portfolio + Ads Manager (running the ads)

This is where the ad campaigns live and where all the tracking data comes together.

**Create the Business Portfolio**
1. Go to **https://business.facebook.com** → **Create account / Create a portfolio**.
2. Enter your **business name**, your name, and a business email; confirm the email.

**Create an Ad Account**
1. In **Business Settings** (the gear) → **Accounts** → **Ad accounts** → **Add** → **Create a new ad account**.
2. Name it, set **currency** and **time zone** (these can't be changed later), and add a **payment method** (card).

**Add the developer**
1. **Business Settings** → **Users** → **People** → **Invite people** (or **+ Add**).
2. Enter **[DEVELOPER EMAIL]**.
3. On the next screens, grant access to the **Ad account**, the **Dataset/Pixel** (step 4), and the **App** (step 5) — set as **Admin/Full control** for each so I can configure tracking.

---

## 4. Meta Pixel / Dataset (website tracking) — you'll get a **Pixel ID**

The Pixel is the website "sensor" that tells Meta who visited, started a trial, and paid.

1. Go to **https://business.facebook.com/events_manager**.
2. Click **Connect data sources** → **Web** → **Connect**.
3. Choose to create a new **Dataset/Pixel**, give it a name (e.g. "Outstanding Partner Web").
4. When created, open it and copy the **Pixel ID** (a long number, e.g. `1234567890123456`). **Send me this ID.**

*(I'll install it on the website — no code needed from you.)*

---

## 5. Facebook App ID (mobile app tracking) — you'll get an **App ID** + **Client Token**

The Facebook/Meta App is what lets the iPhone/Android apps report installs, trials, and purchases to Meta.

1. Go to **https://developers.facebook.com** → log in → **My Apps** → **Create App**.
   - If asked to register as a developer first, accept the terms.
2. Choose use case **Other** → app type **Business** → **Next**.
3. Enter an **App name** (e.g. "Outstanding Partner"), your contact email, and link it to your **Business portfolio** (from step 3). Create.
4. On the app **Dashboard**, copy the **App ID** (a number near the app name). **Send me this.**
5. Also go to **App settings → Advanced → Security → Client token** and **send me the Client Token** (needed by the app SDK).

**Add the developer**
1. In the app, go to **App roles → Roles** → **Add People** → add **[DEVELOPER EMAIL]** as **Administrator** (or Developer).
2. I'll accept and configure the iOS/Android tracking.

---

## 6. Google Play Console (Android submission)

1. If you don't already have it: **https://play.google.com/console** → sign up (one-time $25 fee) with your business details.
2. Add the developer: **Users and permissions** → **Invite new users** → **[DEVELOPER EMAIL]** → grant **Admin** (or at least app-level: Edit + Release + Store presence + Financial). Send.

---

## What to send me once done
Please reply with:
- ✅ Confirmed you invited **[DEVELOPER EMAIL]** to: Stripe, RevenueCat, Meta Business, the Facebook App, and Google Play Console.
- **Meta Pixel ID:** __________
- **Facebook App ID:** __________
- **Facebook Client Token:** __________

That's everything I need to start building the web app, wire up Stripe payments, and set up the ad tracking. I'll handle all the technical configuration from there.
