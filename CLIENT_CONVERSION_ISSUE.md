# Why We're Getting Downloads But No Purchases

A short summary of what we found, what we've fixed, and what I'd recommend before we spend
money on ads.

---

## What the numbers show

Over the last 28 days: **27 new users, 0 trials started, $0 revenue.**

That "0 trials started" figure is the important one. If people were reaching the payment screen
and simply deciding the price was too high, we'd still expect to see *some* trials begin. Zero
starts out of 27 users points to something blocking them — not to pricing.

---

## What we found

### The main problem: the trial button was opening a $224.99 charge

This is almost certainly the issue.

The paywall showed two plans — Yearly and Monthly — and the app was **pre-selecting the Yearly
plan by default**. So when someone tapped the big **"Start 7-Day Free Trial"** button, the Apple
or Google payment sheet that appeared said:

> **$224.99 per year**

Put yourself in the user's shoes. They tapped a button that said *free trial*, and the next thing
they saw was a request for **$224.99**. Almost everyone will close that immediately — it feels
like a bait-and-switch, even though the free trial was genuinely there.

**Fixed.** The paywall now defaults to the **Monthly ($21.99)** plan, so the sheet reads
"$21.99/month, 7 days free" — a far less alarming number. Anyone who wants the yearly discount can
still tap it.

### A second problem: a broken payment screen looked completely normal

The paywall had backup prices written into it. If the store connection ever failed, the screen
would still display "$21.99" and "$224.99" and look perfectly healthy — but the button wouldn't
actually do anything. That means if this ever happened to a user, neither they nor we would have
any idea.

**Fixed.** The screen now clearly says "Plans couldn't be loaded" with a Retry button if the store
can't be reached, instead of pretending everything is fine.

### What we checked and ruled out

Your RevenueCat setup is **correct** — we verified all of it. Both plans are properly connected on
Apple, Google Play and web, and linked to the right access level. That part is not the problem, so
no work is needed there.

---

## What I recommend: hold the ads for a few days

I know this isn't what you want to hear when you're keen to launch, but I'd strongly recommend we
**don't start the ads yet**.

Right now we'd be paying roughly **$20 a day** to send new people into a payment screen we've only
just repaired and haven't yet confirmed works end to end. If anything is still wrong, that money is
gone and we learn nothing.

The sequence I'd suggest:

1. **Ship the paywall fixes** in an app update to both stores.
2. **Run a full test purchase** on both an iPhone and an Android phone — all the way through to
   confirming access unlocks. This is exactly what RevenueCat's own support recommended, and it's
   the only way to be certain.
3. **Then turn the ads on**, knowing the money is going somewhere that converts.

That's a short delay to protect roughly $600 a month in ad spend — and, more importantly, to avoid
paying for users who then can't buy.

The campaigns are built and ready to go the moment you say so.

---

## A question for you on the $14.99 one-time price

You mentioned switching to a **flat $14.99 one-time purchase**. Happy to do it — but two honest
thoughts first:

**It won't fix this problem.** A one-time purchase runs through exactly the same payment plumbing
as a subscription. If something in that flow were broken, a one-time price would break in precisely
the same way. So we'd rebuild the pricing and still see zero sales. Worth fixing the flow first,
then deciding on price with real data.

**It's a significant revenue decision.** Right now a customer is worth $21.99 every month. At a
one-time $14.99, each customer pays once, ever. You'd need to keep acquiring new customers
continuously just to stay level — which is expensive when you're also paying for ads.

**What I'd suggest instead:** now that the trial button leads to $21.99 rather than $224.99, let's
see what conversion actually looks like. If it's still poor after a real test, lowering the price
is a sensible next lever — and at that point we'd know we're solving a pricing problem rather than
guessing.

**If you'd still like to move to $14.99 one-time, just confirm and I'll set it up** — it needs new
products created in both stores plus an app update, so roughly a few days including review time.

---

## One thing I can't do

You asked for a button that says *"I agree to a 7-day free trial"* and lets people straight into
the app.

I can't build that one, and I want to explain why rather than just say no. Giving users full access
without going through Apple's or Google's payment system breaks their store rules — it's the same
issue that got the app **rejected by Apple the first time**, and it can get an app pulled from the
store entirely.

The good news is you already have what you're describing: the **7-day free trial is real and
already active**. The user does have to confirm it on the store's payment screen, but **they are
charged $0 today** and can cancel any time within those seven days. That confirmation step is
Apple's and Google's requirement, not our design choice.

If the goal is to get more people through the door, the safe way is to **give away part of the app
for free** — let everyone use some of the daily content without paying, and keep the full
experience behind the subscription. That's completely allowed, and it's how most successful apps do
it. Happy to plan that if you'd like.

---

## Summary

- ✅ Found and fixed the likely cause — the trial button was opening a $224.99 charge
- ✅ Fixed a second issue that could hide a broken payment screen
- ✅ Confirmed your RevenueCat setup is correct
- ⬜ **Next:** ship the update, then test a real purchase on both phones
- ⬜ **Then:** start the ads
- ❓ **Your call:** stay at $21.99/month for now, or move to $14.99 one-time
