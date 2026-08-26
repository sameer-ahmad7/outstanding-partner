# What's free, what needs an account, what needs Premium

Since the last update the app **opens straight into a working app** — no sign-up wall. That is
deliberate, and it's the fix for the conversion problem: of 47 people who opened the app, 27 left
at the sign-up screen without ever seeing what it does.

So going "straight in" is the new design, not a bug.

---

## 🆓 Free — no account, no card

Anyone who downloads the app gets this immediately:

| | |
|---|---|
| **Today's mission** | The full daily mission, with Shuffle to swap it |
| **Today's text** | One ready-to-send message a day |
| **Her cycle — where she is** | "Day 17 of 28 · Luteal" plus the one-line summary of what that means |
| **The four phases** | Read-only schedule with the dates each phase starts |
| **Activities & dates** | 3 at-home activities + 3 date ideas |
| **Her profile** | Her details, zodiac, Chinese zodiac, numerology, Your Code |
| **This week's activity** | The weekly suggestion |

Phase *detection* is free on purpose — it's the 10-second proof the app is different, and it's what
the ads promise. Charging to learn which phase she's in would recreate the promise-vs-delivery gap
that cost us those 19 conversions.

---

## 👤 Free account — asks him to **sign up** (still no card)

Tapping any of these opens **"Create your free account"**:

| | Why an account |
|---|---|
| **Log tab** — streak, monthly score, mission history | Progress you can lose isn't progress |
| **Remind tab** — the "She Said" journal | Notes need to survive a new phone |
| **"She Said" box** on the Texts tab | Same |

Anything he did before signing up (her name, her cycle date, missions completed) carries over
automatically — nothing is lost.

---

## 💳 Premium — opens the **paywall** ($8.99/month, first month free)

Tapping any of these opens the upgrade screen:

| | What he sees locked |
|---|---|
| **Her full playbook** | 🔒 "7 moves that work — 6 that backfire" on the Today tab |
| **Cycle forecast** | 🔒 "Know what's coming before she does" — the 28-day map, next-period prediction, and what to expect this week |
| **The whole text library** | 🔒 "190+ more texts, matched to her phase" |
| **All activities & dates** | 🔒 "60 activities and 100 date ideas" |
| **90-Day Partner Challenge** | The whole Guide tab |
| **Game Plan** | Profile → Game Plan |
| **Anniversary reminder** | The advance warning before her anniversary |

There is also an **Upgrade to Premium** card on the Profile tab listing everything above, so he
never has to hunt for a lock to subscribe.

---

## One deliberate detail worth knowing

If someone has **no account** and taps a Premium lock, the app asks him to **sign up free first** —
it does not jump straight to asking for money. A free account is a much smaller ask, and we can
reach him afterwards. Once he has an account, the same lock goes straight to the paywall.

---

## ⚠️ On testing as "a totally new user"

Deleting the account in Supabase **will not** give a fresh free trial, and we should not do it:

1. **Apple only grants the free month once per Apple ID, ever.** It's enforced by the App Store,
   not by our app. Deleting the account changes nothing — the same Apple ID will be charged
   $8.99 straight away instead of getting the month free.
2. **The active subscription is tied to that account.** Our subscription records are keyed to the
   Supabase user, so deleting it would disconnect the live trial and premium access could
   disappear.

**To test the free experience instead:** delete and reinstall the app but **don't sign in**. That
is exactly what a brand-new user sees. To test the sign-up prompt, tap the **Log** or **Remind**
tab. To see the paywall, sign in and tap any 🔒.

**To test a real purchase end to end,** use a fresh **App Store Sandbox tester account**
(App Store Connect → Users and Access → Sandbox Testers). That's the only way to get the free
month again, because it's a different Apple ID.
