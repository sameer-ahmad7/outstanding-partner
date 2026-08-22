# Recommendation — What to charge for, and what to give away

Prepared to answer two open questions on the $8.99 model, and to restate the free/paid split with
the new cycle-unlock idea factored in.

---

## Q1 — Should the $8.99 subscription include the cycle tracker?

### ✅ Yes. Without question.

If a subscriber paying $8.99/month were asked for another $8.99 to use the cycle tracker, it reads
as a bait-and-switch. That produces refund requests and 1-star reviews — the two things hardest to
undo on an app listing.

**Recommendation:** attach the subscription product to **both** entitlements in RevenueCat, so
subscribers get the cycle tracker automatically and never see the upsell.

---

## Q2 — Should we sell the cycle tracker separately for $8.99?

### ❌ My recommendation is no — and there's a structural reason, not just a pricing one.

**The cycle isn't a feature. It's the engine the whole app runs on.**

Every piece of content in the library is tagged by phase. From `src/constants/data.js`:
```
{ title:"Buy her flowers",           phases:["ovulation","follicular"] }
{ title:"Pick up her favorite candy", phases:["menstrual","luteal"] }
{ title:"Bring her coffee or tea",    phases:["menstrual","luteal"] }
```
The cycle is what *selects* today's mission, today's text, and this week's activity. It isn't a
module bolted on the side — take it away and the app can't decide what to show you. Selling it as a
separate add-on implies it's optional, when in fact everything else depends on it.

**It's also the entire promise of the advertising.** The App Store listing leads with
*"HER CYCLE CHANGES EVERYTHING."* The landing page says *"Track her cycle. Know what she needs before
she has to tell you."* The Meta ads say *"guided by her cycle."*

So someone clicks an ad about cycle-aware guidance, installs, and finds the cycle behind a second
paywall. That's the **same promise-versus-reality gap** that just cost us 19 out of 19 conversions
with the $224.99 sheet. Repeating the pattern in a different place is a real risk.

**Third, at $8.99 vs $8.99 the maths doesn't work.** $8.99/month buys *everything* with the first
month free. $8.99 once buys *one feature*. Anyone who compares them takes the subscription — so the
one-time product likely sells almost nothing while adding a second entitlement, extra store
products, and more support questions.

### If a non-subscription option is still wanted
Sell **lifetime access to the whole app**, not one feature:

> **Lifetime — $39.99, pay once, keep everything forever**

That serves people who dislike subscriptions, is a well-understood pattern, doesn't fragment the
product, and is worth roughly 4.5 months of subscription up front. Far better than $8.99 for a
single feature.

---

## The free / paid split (updated)

⚠️ **Note the change from my earlier version.** I originally had the cycle tracker in
"free with an account". Given the client now wants to charge for it, here's the direct comparison:

| | Earlier recommendation | Client's new idea | **What I now recommend** |
|---|---|---|---|
| Cycle tracker | Free with account | $8.99 one-time | **Free with account** |

**Why keep it free:** it's the ten-second demonstration of why this app is different from every
other relationship app. Setting up her cycle and instantly seeing *"Week 3 — Ovulation — she needs
connection"* alongside today's matching mission is the moment someone understands the product. Put
that behind a paywall and we're asking people to pay before they've felt anything — which is exactly
the problem we're trying to fix.

### Recommended tiering

**🆓 Free — no account needed** *(the hook: prove value in 10 seconds)*
- Today's mission
- One ready-to-send text
- A handful of date ideas
- Read-only look at the four cycle phases

**👤 Free — with an account** *(the reason to sign up)*
- **Set up and track her cycle** — today's phase and what she needs
- Save progress and streak
- The "She Said" journal

**💳 Paid — $8.99/month, first month free** *(the reason to pay)*
- The full 190+ text library *(free tier gets one a day)*
- All 60 activities and 100 date ideas
- The 30/60/90-day Partner Challenge
- Anniversary and birthday reminders with 21-day advance warning
- Cycle history and insights over time

The principle: **free proves it works, paid gives you more of it.** People upgrade because they want
volume and depth, not because they've hit an arbitrary wall.

---

## Summary of what I'd do

| | Recommendation |
|---|---|
| Subscription includes cycle? | **Yes** |
| Sell cycle separately for $8.99? | **No** — it's the engine, and it's what the ads promise |
| Want a one-time option anyway? | **Lifetime everything at $39.99**, not one feature |
| Cycle tracker tier | **Free with an account** — it's the hook |
| Main product | **$8.99/month, first month free, monthly only** ✅ as agreed |

This also keeps the build simpler: **one entitlement instead of two**, fewer store products, and less
to go wrong — which matters when we're still trying to get the first conversion.

---

# ADDENDUM — Splitting the cycle tracker (client wants part of it paid)

Client agreed the tiering but doesn't want free account-holders getting the **whole** cycle feature.
Fair. And usefully, **the split already exists in the data** — no need to invent one.

Each phase in `CYCLE_PHASES` (`src/constants/data.js`) is layered:

```js
menstrual: {
  label:"Menstrual", days:[1..5], emoji:"🌑",
  tip:"She needs rest, warmth, and deep understanding.",     // ← one-line summary
  whatSheNeeds:{
    headline:"She needs to be held, not handled.",
    physical:[…4 items], emotional:[…4 items],
    fromYou:[…5 actions],                                     // ← the playbook
    avoid:[…4 things not to do],                              // ← the highest-value part
  },
}
```

So we can split on **two natural axes** rather than all-or-nothing.

## Axis 1 — Depth: *where she is* (free) vs *what to do about it* (paid)

| Free (with account) | Paid |
|---|---|
| Enter her cycle start date | The full **"What she needs"** playbook |
| **Today's** day + phase — *"Day 17 of 28 · Luteal 🌘"* | `fromYou` — 5 specific actions for this phase |
| The one-line `tip` — *"She needs patience and emotional safety."* | `avoid` — **4 things NOT to do right now** |
| Today's mission, already phase-matched | `physical` + `emotional` needs breakdown |

The free part proves the app **knows where she is**. The paid part tells you **what to actually do**.
That's a clean, honest line a user can understand in one sentence.

> **`avoid` is the strongest paid hook in the whole app.** *"4 things not to do this week"* is exactly
> what this audience is afraid of getting wrong. I'd make it the single most visible locked item.

## Axis 2 — Time: *today* (free) vs *ahead and behind* (paid)

| Free | Paid |
|---|---|
| Today only | **The forecast** — *"She enters her toughest week in 3 days"* |
| | Cycle history and patterns over time |
| | Phase-change reminders / notifications |

⚠️ **The forecast is already the headline marketing claim.** The landing page says:
*"Know when she's getting cramps before she does — by tracking her cycle you'll know days in advance
when she's entering her toughest week."*

That advance warning is the genuinely valuable, genuinely premium capability — and pricing it that
way makes the marketing and the product agree instead of contradicting each other.

## What this looks like to a free user

They open the app, enter her start date, and see:

> **Day 17 of 28 · Luteal 🌘**
> *She needs patience and emotional safety.*
> **Today's mission:** …
>
> 🔒 **What she needs this week** — 5 things to do, 4 to avoid
> 🔒 **Coming up:** her next phase change — *unlock to see 3 days ahead*

They get a real, working, cycle-aware app. They can see exactly what they're missing and why it's
worth $8.99. Nothing feels withheld out of spite — it feels like there's more.

## Why I'd still keep phase *detection* free
It's the ten-second proof that this app is different from every other relationship app, and it's what
the ads sold them. Charging to find out *which phase she's in* means the ad's promise isn't delivered
until after payment — the same mismatch that cost us 19 of 19 conversions on the $224.99 sheet.
Charging for **what to do about it** and **what's coming** has none of that problem.

## Revised tiering — cycle rows only

**👤 Free with account**
- Set up her cycle · today's day + phase · the one-line tip · today's phase-matched mission

**💳 Paid $8.99/mo**
- Full "What she needs" playbook per phase (do / avoid / physical / emotional)
- **The forecast** — advance warning of phase changes
- Cycle history and insights
- Phase-change reminders

Everything else in the earlier tiering is unchanged.
