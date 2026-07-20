# Tracking & Analytics — Complete Setup (Web + Native/Capacitor)

For the **account owner** to create the tracking assets, grant the **developer** admin, and
hand over the IDs. Covers **both** surfaces of the product.

> **Developer to add everywhere:** `sameer.ahmad3247@gmail.com`
> (Facebook-account email for Meta; Google account for GA4 — same address works.)

---

## THE BIG PICTURE — read this first

Outstanding Partner has **two surfaces**, and they're tracked with **different tools**:

| Surface | Tool | Notes |
|---|---|---|
| **Website + Web app** (anything in a browser, incl. `/app`) | **Meta Pixel (Web Dataset)** + **Google Analytics 4** | Standard web tracking |
| **Native iOS/Android apps** (the Capacitor apps installed from the App Store / Google Play) | **Meta SDK (App Events)** tied to your **Facebook App** | ⚠️ NOT the web Pixel — installed apps need the SDK for proper attribution + iOS ATT/SKAdNetwork |
| **Ads for both** | one **Ad Account (Ads Manager)** | runs web *Sales* campaigns + app *Install* campaigns |

**Why Capacitor apps don't use the web Pixel:** even though Capacitor is web-tech inside, it
ships as a real native app. Meta attributes app installs/events only through the **App Events
SDK** (with SKAdNetwork on iOS) — a webview Pixel can't do that. So the two tools together
cover the whole funnel.

**Send the developer at the end:** Web **Pixel/Dataset ID**, **GA4 Measurement ID (`G-XXXX`)**,
and the **Facebook App ID + Client Token**.

---

## 1 — Meta Pixel / Dataset  ·  WEB (website + web app)

### 1A. Create it
1. **business.facebook.com/events_manager** → top-right: select the **Outstanding Partner** portfolio.
2. Green **＋ Connect data sources** → **Web** → **Connect / Next**.
3. On **"Create a new dataset"**:
   - **Name:** `Outstanding Partner Web`
   - **Conversions API checkbox:** leave it **checked** (server-side tracking = more accurate).
   - **Categories:** leave blank (optional; only restricts sensitive-data sharing).
   - **Create.**
4. If it offers install options → choose **Install code manually** → **skip/close** (the developer installs the code).

### 1B. Get the ID → send to developer
- Open the **Outstanding Partner Web** dataset → the **Dataset ID** (~15–16 digits) is under the
  name, or **Settings (gear) → Dataset ID**. **Copy → send to developer.**

### 1C. Grant developer admin
- Business Settings → **Data sources → Datasets** → select it → **Assign people** →
  add `sameer.ahmad3247@gmail.com` → **Full control** → Assign.
  *(If the developer is a full **portfolio Admin**, they already have it.)*

---

## 2 — Meta App Events  ·  NATIVE (Capacitor iOS + Android)

This is what tracks the **installed apps** — it runs through your **Facebook App**, not the web Pixel.

### 2A. Create the Facebook App (the app's identity) — client
1. **developers.facebook.com** → **My Apps → Create App** (register as a developer if prompted).
2. Use case **Other** → type **Business** → **Next**.
3. **App name:** `Outstanding Partner`; contact email; link the **Outstanding Partner portfolio** → **Create**.
4. On the **App Dashboard**, copy the **App ID** (~15–16 digits).
5. **App settings → Advanced → Security → Client token** → copy it.
6. **← Send the developer the App ID + Client Token.**

### 2B. Add the platforms (client, quick) — so events attribute
- App **Settings → Basic → Add Platform**:
  - **iOS** → Bundle ID: `com.outstandingpartner.app`
  - **Android** → Package name: `com.outstandingpartner.app`
    *(Android also needs a "key hash" — leave that to the developer; it comes from the signing key.)*

### 2C. What the DEVELOPER does (no action from you) — the SDK side
- Integrate the **Meta SDK** into the iOS/Android (Capacitor) builds and log standard app events:
  **app install/activate → StartTrial → Subscribe → Purchase**.
- **iOS:** add the **App Tracking Transparency (ATT)** prompt, configure **SKAdNetwork**, and set
  advertiser-tracking based on the user's ATT choice. Update the App Store **privacy nutrition labels**.
- **Android:** update the Play **Data Safety** form.
- These ship in the next **mobile store build** (the Meta / Phase-5 step).

### 2D. In Events Manager + Ads
- Once the SDK is live, the app shows up as a separate **"App"** data source in Events Manager.
- For iOS, set up **Aggregated Event Measurement (AEM)** (prioritize Purchase > StartTrial > …).
- **Connect the Facebook App to the Ad account** so you can run **App Install** campaigns.

### 2E. Grant developer admin on the App
- **developers.facebook.com → your app → App Roles → Roles → Add People** →
  add `sameer.ahmad3247@gmail.com` as **Administrator**.
  *(App roles are a separate list from Business Settings — do this too.)*

### 2F. Business Verification (client) — start early
- Business Settings → **Security Center** → complete **business verification**.
  Required for **app-install ads** + full Conversions API; can take a few days.

---

## 3 — Ad Account (Ads Manager)  ·  both web + app campaigns

### 3A. Create it — client
1. **business.facebook.com/settings** → **Accounts → Ad accounts → Add → Create a new ad account**.
2. **Name:** `Outstanding Partner`; **Time zone** + **Currency: USD** — ⚠️ **permanent**.
3. "Used for" → **My business** → the Outstanding Partner portfolio → **Create**.
4. **Add a payment method** (Business Settings → Payment methods → card).

### 3B. Grant developer admin
- Business Settings → **Ad accounts** → select it → **Assign people** →
  add `sameer.ahmad3247@gmail.com` → **Manage ad account** (full/admin) → Assign.

*(Ads Manager — adsmanager.facebook.com — runs on this account; nothing to send the developer.)*

---

## 4 — Google Analytics 4 (GA4)  ·  WEB analytics

### 4A. Create the property + web stream — client
1. **analytics.google.com** → **Admin** (gear, bottom-left).
2. **Create → Account** (`Outstanding Partner`) → then **Create → Property** (`Outstanding Partner`,
   timezone + **USD**) → fill business details → Create.
3. Property → **Data streams → Add stream → Web**:
   - URL: `https://outstandingpartner.app`, name `Website` → **Create stream**.
4. Copy the **Measurement ID** — starts with **`G-XXXXXXX`**. **← Send to developer.**

### 4B. Grant developer admin
- Analytics → **Admin → Account access management** (or Property access management) →
  blue **＋ → Add users** → `sameer.ahmad3247@gmail.com` → role **Administrator** → **Add**.

### 4C. (Optional) Native app analytics
- GA4 for **apps** is done via **Firebase Analytics** (a separate SDK), and is **optional** — the
  plan uses the **Meta SDK** for app ad tracking and **GA4** for the website/web app. If you later
  want in-app analytics in GA4, that's a Firebase add-on we can do down the line. **Not needed now.**

---

## 5 — What to send the developer (checklist)
- [ ] **Web Pixel / Dataset ID** (Part 1B) — installed on the site now
- [ ] **GA4 Measurement ID** `G-XXXXXXX` (Part 4A) — installed on the site now
- [ ] **Facebook App ID + Client Token** (Part 2A) — used for the native app SDK (mobile phase)
- [ ] Confirm `sameer.ahmad3247@gmail.com` is **admin** on: Dataset, Ad account, Facebook App, GA4

### Priority
1 + 4 (**Pixel ID + GA4 ID**) unblock **website tracking** right away → send those first.
2 (**App ID + Client Token**) is for the **native SDK**, wired in during the mobile/Meta phase.

---

### Access troubleshooting
- Meta "you don't have access to take this action" → the developer is only a **partial-access**
  user; set them to **Admin / Full control** at the **portfolio** level (Business Settings → Users →
  People → their profile → Admin access), then they can manage all assets.
- The developer must **accept** any pending invite (email / notification) before access goes live.
