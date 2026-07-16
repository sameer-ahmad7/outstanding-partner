# Meta (Pixel + Ads) & Google Analytics — Setup + Admin Access Guide

For the **account owner** to (1) create the tracking assets and (2) grant the **developer**
admin access to manage them.

> **Developer to add everywhere:** `sameer.ahmad3247@gmail.com`
> - For **Meta** assets: this is the email on the developer's Facebook account.
> - For **Google Analytics**: this is the developer's Google account.
>
> **Send the developer at the end:** the **Pixel/Dataset ID**, the **GA4 Measurement ID
> (`G-XXXXXXX`)**, and confirmation you granted admin on all three.

---

## PART 1 — Meta Dataset (Pixel) — website tracking

The "Pixel" is now called a **Dataset** in Events Manager. Same thing.

### 1A. Create it
1. Go to **business.facebook.com/events_manager**
   *(or Meta Business Suite → left menu → All tools → Events Manager).*
2. **Top-left: select the correct business portfolio** — your **Outstanding Partner** one
   (NOT 3 Oak Cbd / Dream Puffs).
3. Click the green **＋ Connect data sources** (left side).
4. Select **Web** → **Connect** (or **Next**).
5. If asked how to connect ("Meta Pixel" vs "Conversions API and Meta Pixel") → either is fine;
   pick **Meta Pixel** for now (server-side Conversions API is added later).
6. **Name the dataset:** `Outstanding Partner Web` → **Create**.
7. If it asks for your website to check activity → enter `https://outstandingpartner.app` →
   **Check** (optional — you can **Skip**).
8. On the install-options screen ("Install code manually" / "Use a partner" / "Email
   instructions") → choose **Install code manually**, then **close/skip** the code page.
   *(The developer installs the actual code — you only need the dataset created.)*

### 1B. Get the ID (send this to the developer)
1. In **Events Manager**, click your **"Outstanding Partner Web"** dataset in the left list.
2. The **Dataset ID** (a ~15–16-digit number) appears **under the dataset name**, or in
   **Settings** (gear icon) → *Dataset ID*.
3. **Copy it → send to the developer.**

### 1C. Grant the developer admin on the Dataset
> If the developer is already a **full Admin of the Business portfolio**, they can see this
> dataset automatically. Assigning it explicitly is a safe belt-and-suspenders.
1. **business.facebook.com/settings** → left menu **Data sources → Datasets**.
2. Click **Outstanding Partner Web**.
3. Open the **Assign people / Add people** tab (or "People with access").
4. Click **Add people** → select **`sameer.ahmad3247@gmail.com`**.
5. Turn on **Full control / Manage dataset** → **Assign**.

---

## PART 2 — Ad Account (this powers Ads Manager)

### 2A. Create it
1. **business.facebook.com/settings** → left menu **Accounts → Ad accounts**.
2. **Add** (dropdown) → **Create a new ad account**.
3. Fill in:
   - **Ad account name:** `Outstanding Partner`
   - **Time zone:** your reporting zone — ⚠️ **permanent, can't change later**
   - **Currency:** **USD** — ⚠️ **permanent**
4. "This ad account is used for" → **My business** → select the **Outstanding Partner**
   portfolio → **Create**.
5. On the assign-access step, add **yourself** with **Manage ad account** (Admin).
6. **Add a payment method:** Business Settings → **Payment methods** (or Billing) → **Add** →
   your card. *(It usually prompts right after creation.)*

### 2B. Grant the developer admin on the Ad account
1. **business.facebook.com/settings** → **Accounts → Ad accounts** → click the
   **Outstanding Partner** ad account.
2. Open **Assign people / Add people**.
3. **Add people** → select **`sameer.ahmad3247@gmail.com`**.
4. Turn on **Manage ad account** (this is full/admin access to the ad account) → **Assign**.

*(Ads Manager itself — adsmanager.facebook.com — runs on this ad account. Nothing extra to
send the developer; access to the ad account = access to Ads Manager for it.)*

---

## PART 3 — Google Analytics 4 (GA4)

### 3A. Create the property + web stream
1. Go to **analytics.google.com** → sign in with the account that should **own** analytics.
2. **Admin** (gear icon, bottom-left).
3. If you have no account yet: **Create → Account** → name `Outstanding Partner` → Next.
4. **Create → Property** (or the Property step of account creation):
   - **Property name:** `Outstanding Partner`
   - **Reporting time zone** + **Currency: USD** → Next → fill business details → Create.
5. In the property → **Data streams → Add stream → Web**:
   - **Website URL:** `https://outstandingpartner.app`
   - **Stream name:** `Website` → **Create stream**.
6. On the stream details, copy the **Measurement ID** — it starts with **`G-XXXXXXX`**.
   **Send it to the developer.**

### 3B. Grant the developer admin on GA4
1. In **Analytics → Admin**.
2. Choose the scope:
   - **Account access management** (grants admin across everything in the account), **or**
   - **Property access management** (just the Outstanding Partner property — narrower, also fine).
3. Click the blue **＋** (top-right) → **Add users**.
4. Enter **`sameer.ahmad3247@gmail.com`**.
5. (Optional) tick **Notify new users by email**.
6. Under **Direct roles and data restrictions**, select **Administrator**.
7. Click **Add**.

---

## PART 4 — What to send the developer once done
- [ ] **Meta Pixel / Dataset ID** (Part 1B)
- [ ] **GA4 Measurement ID** — `G-XXXXXXX` (Part 3A)
- [ ] Confirmation you added **`sameer.ahmad3247@gmail.com`** as **admin** to: the **Dataset**,
      the **Ad account**, and **GA4**.
- [ ] *(Later, for mobile tracking)* the **Facebook App ID** + **Client Token** from
      developers.facebook.com.

Once the developer has the Pixel ID + GA4 ID, they install both on the website (landing + app)
and set up the "Download clicked" conversion event — no further action needed from you.

---

### Notes
- If you can't add the developer to a Meta asset, it's usually because they're only a
  **"partial access"** user on the Business portfolio — set them to **Admin / Full control**
  at the **portfolio** level (Business Settings → Users → People → their profile → Admin access),
  and they'll then have access to all assets.
- Meta asset access uses the developer's **Facebook-account email**; GA4 uses their **Google
  account** — same address (`sameer.ahmad3247@gmail.com`) works for both here.
- The developer must **accept** any pending invite (email / notification) before access is live.
