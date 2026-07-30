# Meta Ads Runbook — Outstanding Partner

How to actually run ads once the tracking is in place. Ads Manager
(**adsmanager.facebook.com**) is the console where you build, target, budget, launch, and
measure campaigns on Facebook + Instagram. The Pixel, the app SDK, and the ad account all
exist to feed it.

---

## What Ads Manager is *for*
1. **Reach the right people** — target by age/location/interests, or by **custom/lookalike
   audiences** built from your own data (site visitors, waitlist, subscribers).
2. **Optimize toward a goal** — you tell Meta the outcome you want (a purchase, an install, a
   lead), and its algorithm shows the ad to the people most likely to do it. This only works
   because the **Pixel/SDK reports those outcomes back**.
3. **Measure ROI** — cost per result, ROAS (revenue ÷ spend), which ad/audience/creative wins.
4. **Retarget** — re-show ads to people who visited but didn't convert (highest ROI usually).

You do **not** run ads from the Pixel or the app — those just send signals. All campaign
work happens in Ads Manager.

---

## How a campaign is structured (3 levels)
```
Campaign      → the OBJECTIVE + budget      (e.g. "Sales", $20/day)
  └ Ad Set    → WHO + WHERE + optimization  (audience, placements, "optimize for Purchase")
      └ Ad    → the CREATIVE                (image/video + headline + link + CTA button)
```
One campaign can hold several ad sets (test audiences), each with several ads (test creatives).

---

## Before you spend a dollar — checklist
- [ ] **Ad account created** + **payment method** added (Business Settings → Payment methods).
- [ ] **Business verification** approved (Security Center) — required for app-install ads + full data.
- [ ] **Pixel firing** (Events Manager → Test Events shows PageView) — ✅ live on the site.
- [ ] **Domain verified** in Business Settings → Brand safety → Domains (`outstandingpartner.app`) —
      needed for web conversion campaigns + iOS Aggregated Event Measurement.
- [ ] For app-install ads: **app live on the App Store / Play**, **Meta SDK in the build**, and the
      **app connected** to the ad account.

---

## What to run — sequenced to where the product is

### Phase A — right now (app not on the stores yet, waitlist live)
Goal: build audience + waitlist cheaply, and warm up the Pixel.
- **Traffic campaign** → send people to `outstandingpartner.app`. Cheap clicks, builds a
  retargetable site-visitor audience.
- **Leads / waitlist campaign** → optimize for the **waitlist signup** (fire a `Lead` Pixel event
  on form submit — small add) so Meta finds people who actually join, not just click.
- **Engagement / Awareness** → if you want reach + video views to build the brand and a warm audience.

### Phase B — at launch (apps live + web checkout)
- **App Promotion campaign** (Advantage+ App Campaign) → optimize for **installs**, then for
  **in-app purchase/trial** once the SDK sends those (via the RevenueCat→Meta integration).
- **Sales campaign (web)** → optimize for **Purchase** on the website/web app (fire the web
  `Purchase` Pixel event on RC Web Billing success — the planned follow-up).
- **Retargeting** → show subscribe ads to site visitors + waitlist who haven't converted.

---

## Your first campaign — step by step
1. **adsmanager.facebook.com** → make sure the **Outstanding Partner** ad account is selected.
2. Green **＋ Create** → pick an **Objective**:
   - now: **Traffic** (link clicks) or **Leads** (waitlist);
   - at launch: **Sales** (web purchases) or **App promotion** (installs).
3. **Campaign level:** name it (e.g. `OP-Traffic-Launch`). Turn on **Advantage campaign budget**
   and set a **daily budget** (start small — **$10–20/day**).
4. **Ad set level:**
   - **Conversion location / event:** e.g. Website → **Purchase** (or Landing page views / Leads).
   - **Audience:** start with **Advantage+ audience** (let Meta find them) or a broad manual one
     (US, ages 25–45, interests: relationships, marriage, self-improvement). Add your **retargeting**
     and **lookalike** audiences here once they exist.
   - **Placements:** **Advantage+ placements** (auto) to start.
5. **Ad level:**
   - **Format:** single image or video (video usually wins for apps).
   - **Creative:** the app's value in the first 3 seconds; **Primary text** (the pain/benefit),
     **Headline**, **CTA button** (Learn More / Download / Sign Up), and the **destination URL**
     (`outstandingpartner.app`, later the store link).
   - Attach the **Facebook Page** + **Instagram account** it runs from.
6. **Publish** → it goes to review (usually < 24h), then starts spending.

---

## Audiences to build (Business tools → Audiences)
- **Custom — Website:** all visitors (last 180 days), or specific pages → retargeting.
- **Custom — Customer list:** upload the **waitlist emails** → target or exclude them.
- **Custom — App activity / Purchasers** (post-launch) → exclude existing subscribers, retarget trials.
- **Lookalike:** 1% lookalike of your purchasers/waitlist → the single highest-value cold audience.

---

## Reading results (the columns that matter)
- **Cost per result** (per purchase / install / lead) — the number to drive down.
- **ROAS** (Purchase ROAS) — revenue ÷ spend; > 1 means profitable on first payment.
- **CTR** (link) — creative quality; low CTR = change the creative.
- **CPM** — cost per 1,000 impressions; audience/competition signal.
- Use **Breakdown → by age/placement/creative** to cut losers and scale winners.

---

## Rules of thumb for launch
- **Start broad + small.** One campaign, 1–2 ad sets, 2–3 creatives, $10–20/day. Let it run
  **3–7 days** before judging — don't tinker daily (it resets learning).
- **Optimize for the real outcome** (Purchase/Install), not clicks — the Pixel/SDK make that possible.
- **Creative is 80% of performance.** Test hooks/videos more than audiences.
- **Scale winners ~20%/day**; kill ad sets that can't hit your target cost.
- **iOS caveat:** post-ATT, iOS conversions are modeled/delayed via SKAdNetwork + Aggregated Event
  Measurement — give it longer attribution windows and don't over-read day-1 numbers.

---

## What feeds all this (already built)
- **Web Pixel** (`1110278981958912`) → website + web-app events → web Sales/retargeting.
- **GA4** (`G-9T0SC0L8C1`) → independent analytics cross-check.
- **Meta App Events SDK** (App `1619043059848775`) → app install/session attribution.
- **RevenueCat → Meta integration** → server-side trial/subscribe/purchase events for optimization.
- **"Download clicked" + (planned) Purchase events** → conversion signals to optimize toward.

See `META_AND_ANALYTICS_SETUP.md` (accounts) and `NATIVE_TRACKING_SETUP.md` (app SDKs).
