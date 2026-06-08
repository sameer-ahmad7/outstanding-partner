# Outstanding Partner — Claude (Anthropic) API Key Guide

A short guide to share with the client: **what the AI feature does, why we need a key, and how to create it.**

---

## 1. What the AI feature does

Outstanding Partner has two **premium** AI helpers that generate personalised, in-the-moment suggestions for the user. They are powered by Anthropic's **Claude** model.

- **AI Message Writer** — writes a thoughtful text the user can send to their partner. It's tailored to:
  - the partner's current **menstrual cycle phase** and emotional needs,
  - the app's relationship framework (helping her feel *seen, heard, chosen, safe, alive*),
  - recent notes the user logged in **"She Said."**

- **AI Date / Activity Planner** — suggests a personalised activity or date idea based on the current phase, the user's situation/location, and the app's "lead, protect, provide" framework.

In short: instead of only picking from the built-in library of texts/activities, premium users can generate **fresh, context-aware suggestions on demand.**

> Privacy: requests are sent securely to Anthropic only to generate the suggestion. No data is used for advertising or sold. This is reflected in the app's Privacy Policy.

## 2. Why we need an API key

The AI runs on Anthropic's Claude service. To call Claude from the live app, Anthropic requires an **API key** tied to a billed account. We store this key **only on the server** (a Supabase secret) — it is never placed in the app, the code, or version control, so it cannot leak to users. It can be **revoked or rotated at any time** from the Anthropic console.

**Billing:** Anthropic is **usage-based** (you pay per amount of text generated). It's inexpensive per request, but the client owns the Anthropic account and its billing. You can set a **monthly spend limit** so costs stay capped.

## 3. How to create the API key (client steps)

1. Go to **https://console.anthropic.com** and **sign up** (or log in). Use the company email you want to own the account.
2. Verify your email and create/confirm your **Organization**.
3. **Add billing / credits:** open **Settings → Billing**, add a payment method, and purchase a small amount of starting credits (e.g. $5–$20 is plenty to begin).
   - Optional but recommended: **Settings → Limits** → set a **monthly spend limit** (e.g. $50) so usage can't exceed it.
4. Open **Settings → API Keys** (left-hand menu).
5. Click **Create Key**.
   - Name it something clear, e.g. **`Outstanding Partner – Production`**.
   - Create the key.
6. **Copy the key immediately** — it starts with `sk-ant-api03-…` and is shown **only once**. Store it in a password manager.
7. **Share it securely** with the developer — ideally via a password manager's secure-share or another secure channel (avoid plain email if possible).

## 4. What to send the developer

- The **API key** (`sk-ant-api03-…`).
- (Optional) A preferred model — otherwise we default to a current Claude model (`claude-3-5-sonnet-latest`).

That's it. We add it as a secure server-side secret and the AI features turn on for premium users — no app update required.

## 5. Good to know

- The key is **not** stored in the app or the code repository; only in the secure server environment.
- You can **revoke** the key anytime in the console (Settings → API Keys) — useful if it's ever exposed.
- You can **monitor spend** anytime under Settings → Usage / Billing.
- If you'd rather use **OpenAI** or **Google Gemini** instead of Claude, that's also supported — just say so and provide that provider's key instead.
