# Apple + Google Sign-In — Console Setup Guide

Everything needed in **Apple Developer**, **Google Cloud**, and **Supabase** to make WS1 work.
The app code is already written and committed — this is the configuration half.

**Constants you'll need throughout:**
| | |
|---|---|
| Bundle ID / package | `com.outstandingpartner.app` |
| Supabase project ref | `avnqmwuvzdkkfnovaibl` |
| Supabase callback URL | `https://avnqmwuvzdkkfnovaibl.supabase.co/auth/v1/callback` |
| Website | `https://outstandingpartner.app` |
| Web app path | `https://outstandingpartner.app/app` |

---

# PART 1 — Apple Developer (Sign in with Apple)

Sign in with Apple needs **four** values: a Services ID, a Team ID, a Key ID, and a `.p8` private key.
The confusing part is that native iOS and web use *different* client IDs — the app uses the **Bundle
ID**, the web uses the **Services ID**. Both must be configured.

### 1.1 Enable the capability on the App ID
1. developer.apple.com → **Certificates, Identifiers & Profiles → Identifiers**
2. Click your App ID **`com.outstandingpartner.app`**
3. Tick **Sign in with Apple** → **Save**
   *(This alone makes native iOS sign-in work.)*

### 1.2 Create a Services ID (this is the *web* client ID)
1. **Identifiers → ＋ → Services IDs → Continue**
2. **Description:** `Outstanding Partner Web`
   **Identifier:** `com.outstandingpartner.app.web`  ← must differ from the Bundle ID
3. **Continue → Register**
4. Re-open it → tick **Sign in with Apple** → **Configure**:
   - **Primary App ID:** `com.outstandingpartner.app`
   - **Domains and Subdomains:** `avnqmwuvzdkkfnovaibl.supabase.co`
   - **Return URLs:** `https://avnqmwuvzdkkfnovaibl.supabase.co/auth/v1/callback`
   - **Next → Done → Continue → Save**

> ⚠️ The domain is **Supabase's**, not yours. Apple posts back to Supabase, which then redirects to
> your site. Putting `outstandingpartner.app` here is the single most common mistake.

### 1.3 Create the Sign in with Apple key
1. **Keys → ＋**
2. **Key Name:** `Outstanding Partner Sign In`
3. Tick **Sign in with Apple** → **Configure** → Primary App ID = `com.outstandingpartner.app` → **Save**
4. **Continue → Register → Download** the `.p8`
   > ⚠️ **Downloadable exactly once.** Lose it and you must revoke and start over.
5. Note the **Key ID** (10 chars) shown on that page

### 1.4 Find your Team ID
Top-right of the developer portal, or **Membership details** → **Team ID** (10 chars).

### ✅ Apple gives you
| Value | Example | Used by |
|---|---|---|
| Services ID | `com.outstandingpartner.app.web` | Supabase + `VITE_APPLE_SERVICES_ID` |
| Team ID | `ABCDE12345` | Supabase |
| Key ID | `XYZ9876543` | Supabase |
| `.p8` key file | `AuthKey_XYZ9876543.p8` | Supabase |

---

# PART 2 — Google Cloud (Sign in with Google)

You need **three** OAuth client IDs — Web, iOS, Android. They are not interchangeable.

Use the **existing** Firebase project **`outstanding-partner-app`** (console.cloud.google.com →
select that project) so everything stays in one place.

### 2.1 OAuth consent screen (once)
1. **APIs & Services → OAuth consent screen**
2. **User type: External** → Create
3. App name `Outstanding Partner`, support email, developer email
4. **App domain:** `https://outstandingpartner.app`
   **Privacy policy:** `https://outstandingpartner.app/privacy`
   **Terms:** `https://outstandingpartner.app/terms`
5. Scopes: the defaults (`email`, `profile`, `openid`) are enough — add nothing else
6. **Publish app** (otherwise only test users can sign in)

> Because we only use email/profile/openid, Google does **not** require a security review.
> Adding any other scope would trigger one — don't.

### 2.2 Web client ID
1. **APIs & Services → Credentials → ＋ Create Credentials → OAuth client ID**
2. **Type: Web application**, name `Outstanding Partner Web`
3. **Authorised JavaScript origins:**
   - `https://outstandingpartner.app`
4. **Authorised redirect URIs:**
   - `https://avnqmwuvzdkkfnovaibl.supabase.co/auth/v1/callback`
5. **Create** → copy the **Client ID** and **Client Secret**

> ⚠️ The Web client ID is used by **all three** platforms. Supabase needs it; Android needs it as the
> `serverClientId` to return an ID token; the website uses it directly. Don't skip it thinking it's web-only.

### 2.3 iOS client ID
1. **Create Credentials → OAuth client ID → iOS**
2. Name `Outstanding Partner iOS`, **Bundle ID:** `com.outstandingpartner.app`
3. **Create** → copy the **Client ID** (looks like `…apps.googleusercontent.com`)

### 2.4 Android client ID — ⚠️ needs TWO fingerprints
1. **Create Credentials → OAuth client ID → Android**
2. Name `Outstanding Partner Android`, **Package name:** `com.outstandingpartner.app`
3. **SHA-1** — you must register **both**, or login works in testing and fails in production:

   **a) Debug key** (already known):
   ```
   DE:AA:5A:2A:05:1B:EB:EF:68:45:C0:20:BD:22:7E:BE:2E:69:CD:EF
   ```
   *(That's our upload key. For the local debug keystore run:
   `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`)*

   **b) Play App Signing key** ← the important one:
   Play Console → your app → **Test and release → App integrity → App signing** →
   copy the **SHA-1 of the "App signing key certificate"**

4. Create one Android client per fingerprint (Google allows only one SHA-1 each).

### ✅ Google gives you
| Value | Used by |
|---|---|
| Web Client ID + Secret | Supabase provider config |
| Web Client ID | `VITE_GOOGLE_WEB_CLIENT_ID` (also Android's serverClientId) |
| iOS Client ID | `VITE_GOOGLE_IOS_CLIENT_ID` |
| Android client(s) | no value to copy — registration only |

---

# PART 3 — Supabase

### 3.1 Enable Apple
**Authentication → Providers → Apple → Enable**
| Field | Value |
|---|---|
| Client IDs | `com.outstandingpartner.app.web,com.outstandingpartner.app` |
| Secret Key | contents of the `.p8` |
| Team ID | from 1.4 |
| Key ID | from 1.3 |

> ⚠️ Put **both** IDs in Client IDs, comma-separated, no space. Web tokens carry the Services ID;
> native iOS tokens carry the Bundle ID. Miss the second and native sign-in fails validation.

### 3.2 Enable Google
**Authentication → Providers → Google → Enable**
| Field | Value |
|---|---|
| Client ID | Web client ID |
| Client Secret | Web client secret |
| **Authorized Client IDs** | iOS client ID **and** Web client ID, comma-separated |

> ⚠️ "Authorized Client IDs" is what lets **native** ID tokens validate. Without it web works and
> mobile returns "Unacceptable audience".

### 3.3 Redirect URLs
**Authentication → URL Configuration → Redirect URLs**, add:
```
https://outstandingpartner.app/app
https://outstandingpartner.app/**
outstandingpartner://**
```

### 3.4 ⚠️ Account linking — the step that protects paying customers
**Authentication → Providers → enable "Allow manual linking" / confirm automatic linking on verified email.**

Why this matters more than anything else here:

> RevenueCat's `app_user_id` **is** the Supabase user id. If someone signed up with
> `bob@x.com` + password, then later taps "Continue with Google" as `bob@x.com`, and Supabase mints
> a **new** user id, then RevenueCat sees a different customer and **their paid subscription
> disappears.** They were charged and lost access.

**Must be tested before release** — see Part 5.

---

# PART 4 — Put the values in `.env`

```
VITE_APPLE_SERVICES_ID="com.outstandingpartner.app.web"
VITE_GOOGLE_WEB_CLIENT_ID="…apps.googleusercontent.com"
VITE_GOOGLE_IOS_CLIENT_ID="…apps.googleusercontent.com"
```
`.env` is gitignored. The buttons **hide themselves** when the matching value is blank
(`socialAuthAvailable()`), so the app is safe to ship before these are filled in — the buttons simply
won't appear.

Then: `npm run build && npx cap sync`

### iOS — one Xcode step
Xcode → **App target → Signing & Capabilities → ＋ Capability → Sign in with Apple**.
Without it, iOS sign-in fails at runtime.

---

# PART 5 — Test plan (do not skip #3)

1. **Web** — `outstandingpartner.app/app` → both buttons → redirect → lands signed in
2. **iOS device** — Apple button opens the native sheet; Google opens the account picker
3. ⚠️ **The linking test — with a REAL PAYING account:**
   1. Sign up with email+password using an address you control
   2. Buy a subscription (sandbox) → confirm premium unlocks
   3. Sign out
   4. Sign back in with **"Continue with Google"** using the **same email**
   5. ✅ **Premium must still be active.** If it isn't, linking is misconfigured — fix before release.
4. **Android** — test a **Play internal-testing build**, not just debug, to prove the release SHA-1 works
5. **Apple Hide My Email** — sign up choosing "Hide My Email"; confirm the account is created and works

---

# Common failures

| Symptom | Cause |
|---|---|
| `Unacceptable audience in id_token` | Native client ID missing from Supabase (Apple *Client IDs* / Google *Authorized Client IDs*) |
| `invalid_client` on web Apple | Services ID, Return URL, or `.p8`/Key ID/Team ID wrong |
| Google works on iOS, fails on Android release | Play App Signing SHA-1 not registered (2.4b) |
| Apple sign-in works in sim, fails on device | "Sign in with Apple" capability missing in Xcode |
| Subscription vanishes after social login | **Account linking** — Part 3.4 |
| Buttons don't appear | `.env` values blank — by design |
