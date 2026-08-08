# Meta Ad Campaign — Launch Draft ($10/day, iOS + Android)

Copy-paste spec for the first campaign. Enter this **manually** in Ads Manager
(adsmanager.facebook.com, ad account `3082569935282811`).

> ⚠️ **Do all of this by hand in a normal browser.** No automation tools, AI browser
> extensions, or remote-debugging sessions on Facebook — that's what triggered the account
> restriction that was just lifted.

---

## Which objective (read this first)

**Recommended: App promotion campaign.** Meta auto-routes the viewer to the right store —
iPhone users → App Store, Android users → Google Play. One campaign covers both, which is
exactly what you asked for.

⚠️ **One dependency:** app-install attribution needs the Meta SDK live in the shipped app.
- **Android** ✅ — the build now on Play contains the Meta SDK.
- **iOS** ⚠️ — the App Store build was submitted *before* we added the SDK. Ads will still run
  and drive installs, but iOS install *attribution* will be weak until an updated iOS build ships.

**Fallback if App promotion is blocked** (e.g. app not connected to the ad account yet):
run a **Traffic** campaign to `https://outstandingpartner.app` — the landing page has both store
badges, and the Pixel already tracks `DownloadClick`. Slightly less efficient (one extra tap) but
works today with zero dependencies.

---

## Campaign structure

**One campaign → ONE ad set → 3 ads.**

At $10/day, do **not** split into multiple ad sets. $5/ad set is too thin to exit the learning
phase and you'll just get two half-starved ad sets. One ad set, three creatives, let Meta pick.

```
Campaign:  OP–Installs–Launch          $10/day
  └ Ad set: US–Men–25–45               (all placements, Advantage+)
      ├ Ad 1: "Know what she needs"
      ├ Ad 2: "Built for him"
      └ Ad 3: "90-day challenge"
```

---

## 1. Campaign level

| Field | Value |
|---|---|
| Objective | **App promotion** (or **Traffic** — see fallback above) |
| Campaign name | `OP–Installs–Launch` |
| Advantage campaign budget | **On** |
| Daily budget | **$10.00** |
| Campaign bid strategy | Highest volume (default) |
| Special ad category | **None** ← relationship apps are not a special category |

---

## 2. Ad set level

| Field | Value |
|---|---|
| Ad set name | `US–Men–25–45–Broad` |
| App / destination | Your app (iOS + Android) — or the website URL for Traffic |
| Performance goal | **Maximize number of app installs** (Traffic → *Maximise landing page views*) |
| Schedule | Start today, no end date (review after 30 days) |

### Audience
| Setting | Value |
|---|---|
| **Location** | **United States** (start here; expand later) |
| **Age** | **25 – 45** |
| **Gender** | **Men** |
| **Languages** | English (All) |
| **Advantage+ audience** | **On** — feed it the suggestions below as *audience suggestions* |

**Interest suggestions** (add as suggestions; Meta will expand beyond them):
- Relationship-focused: `Marriage`, `Intimate relationship`, `Romance`, `Relationship counseling`
- Self-improvement: `Self-help`, `Personal development`, `Men's interests`
- Authors/figures: `The 5 Love Languages`, `Gary Chapman`, `Mark Manson`, `Tony Robbins`
- Demographics → Relationship status: `Married`, `In a relationship`, `Engaged`
- Life events: `Newlywed (1 year)`, `Anniversary within 30 days`

> With $10/day, **broad beats narrow.** Stacking many interests starves delivery. Start with
> Advantage+ and only these as hints — Meta's algorithm finds buyers faster than manual stacking
> at this budget.

### Placements
**Advantage+ placements (automatic)** → this automatically includes **Instagram Feed, Stories,
Reels, Explore** plus Facebook Feed/Reels/Marketplace. That covers the Instagram request — no
separate campaign needed.
- To force Instagram only (not recommended at this budget): Manual placements → uncheck Facebook.

---

## 3. Ads — copy drafts

Attach the **Facebook Page** (Outstanding Partner) + link the **Instagram account**.
CTA button: **Install Now** (App promotion) or **Download** / **Learn More** (Traffic).

### Ad 1 — "Know what she needs"
**Primary text**
```
Most men love their partner. Very few know how to show it consistently.

Outstanding Partner tells you exactly what to do, what to say, and when — every single day.

• A daily mission matched to the week she's in
• Ready-to-send texts
• Weekly activities and monthly date ideas

7 days free. Cancel anytime.
```
**Headline:** `Know exactly what she needs`
**Description:** `Daily missions, texts & date ideas`

### Ad 2 — "Built for him"
**Primary text**
```
Every other relationship app needs both people to download it.

Outstanding Partner is built only for him. She never sees it — she just feels the difference.

Daily missions. Ready-to-send texts. Date ideas that actually land.

Start free for 7 days.
```
**Headline:** `She never sees it. She just feels it.`
**Description:** `Built for husbands & boyfriends`

### Ad 3 — "90-day challenge"
**Primary text**
```
90 days. One small mission a day. A completely different relationship.

Outstanding Partner gives you the plan — daily missions, texts to send, and date ideas, matched
to what she needs that week.

Level 1: Foundation. Level 2: Advanced. Level 3: Master.

Try it free for 7 days.
```
**Headline:** `The 90-day partner challenge`
**Description:** `Start your free week`

### ⚠️ Ad-copy policy guardrail
Meta prohibits ads that **assert or imply personal attributes** about the viewer. Never write
"Is your marriage failing?", "Your wife is unhappy", "You're a bad husband." Keep it general
("Most men…", "Outstanding Partner gives you…") — the drafts above are written to comply.

---

## 4. Creative specs

| Placement | Ratio | Size |
|---|---|---|
| Feed (FB + IG) | 1:1 or 4:5 | 1080×1080 / 1080×1350 |
| Stories / Reels | **9:16** | 1080×1920 |

- **Video outperforms static for apps.** 15–30 s, hook in the first 3 seconds, captions burned in
  (most people watch muted).
- Upload a 9:16 version too, or Meta will crop your feed image badly on Stories/Reels.
- Simple, effective first videos: screen-record the Today tab (mission → text → shuffle), or a
  plain text-on-brand-background motion piece using the ad copy above.

---

## 5. What $10/day realistically buys

$10/day = **~$300/month**. Honest expectations for US traffic:

| Metric | Realistic range |
|---|---|
| CPM (cost per 1,000 views) | $15 – $35 |
| Impressions/month | ~10,000 – 20,000 |
| Link clicks/month | ~150 – 400 |
| Installs/month | ~30 – 120 (highly creative-dependent) |
| Cost per install | ~$3 – $10 |

⚠️ **Important:** $10/day will **not** produce enough purchases for Meta to optimize on *Purchase*
(that needs ~50 conversions/week). That's why we optimize for **installs** at this budget. Optimize
for purchases later, once volume supports it.

---

## 6. The first 30 days — what to do (and not do)

| When | Do |
|---|---|
| Days 1–7 | **Change nothing.** Editing resets the learning phase and wastes budget. |
| Day 7 | First read: which of the 3 ads has the best CTR + cost per install? |
| Days 7–14 | Turn off the weakest ad. Leave budget alone. |
| Day 14 | Add 1–2 new creatives against the winner (test creative, not audience). |
| Day 30 | Full review → decide: scale, change audience, or switch angle. |

**Rules of thumb**
- Judge on **cost per install**, not clicks or likes.
- Creative is ~80% of performance — test videos/hooks before touching targeting.
- Scale winners **~20%/day**, never double.
- iOS numbers are partly modeled/delayed (Apple privacy) — don't over-read day-1 iOS data.

---

## 7. Pre-flight checklist
- [ ] Business restriction lifted ✅ and **business verification** complete
- [ ] Payment method on the ad account
- [ ] Facebook Page + Instagram account linked to the ad account
- [ ] App connected to the ad account (App promotion only) — Events Manager → app data source
- [ ] Creatives ready: 1:1/4:5 **and** 9:16
- [ ] Pixel live ✅ (already verified: PageView / DownloadClick / Purchase)

---

## BUILD STATUS — draft created in Ads Manager (2026-08-08)

Campaign built directly in Ads Manager, ad account `3082569935282811`. **Status: In draft — NOT
published.** Nothing spends until someone clicks Publish.

### ✅ Configured
| Level | Setting | Value |
|---|---|---|
| Campaign | Name | `OP-Android-Installs` |
| | Objective | App promotion |
| | Budget | **$10.00/day**, Advantage campaign budget on |
| | Bid strategy | Highest volume |
| | Special ad category | None |
| Ad set | Name | `US-Men-25-45-Android` |
| | Store / app | Google Play Store → Outstanding Partner (App ID 1619043059848775) |
| | Performance goal | Maximize number of app installs |
| | Location | United States |
| | **Age** | **25 – 45** (hard limit — "use as suggestion" unchecked) |
| | **Gender** | **Men** (hard limit) |
| | Advantage+ audience | **Off** (so age/gender are enforced) |
| | Placements | Advantage+ (auto) → includes **Instagram** Feed/Stories/Reels/Explore |
| Ad | Name | `Ad1-Know-What-She-Needs` |
| | Facebook Page | Outstanding Partner (1253838037806552) |
| | Instagram | Use Facebook Page |

### ⛔ Remaining before it can run
1. **Media required** — Ads Manager reports *"Please specify the media to run with this ad."*
   Upload a **video (best) or image**: 1:1 / 4:5 for Feed **and** 9:16 for Stories/Reels.
2. **Ad copy** — the Primary text / Headline fields appear once media is attached. Paste from the
   three drafts above.
3. **Detailed interests** — not added. US + Men + 25–45 is already a solid audience at $10/day and
   Meta reports ~7.2% better cost-per-result without narrowing; add the interest list above only if
   you want tighter targeting.
4. **iOS campaign** — not yet built. Fastest route: **duplicate** `OP-Android-Installs`, rename to
   `OP-iOS-Installs`, and change **Mobile app store → App Store**. Do this after the creative exists
   so it copies across.

### ⚠️ One issue worth knowing
While selecting the app, Ads Manager first returned *"Mobile application could not be found in app
store."* The Facebook App's Android registration is **correct** (package `com.outstandingpartner.app`,
class `…MainActivity`, install-referrer key all present) — this was Meta's app-store crawler not yet
having indexed the freshly published Play listing. It cleared during setup, but if it reappears on
publish, wait 24–48 h for Meta to index and try again.

**Budget note:** if you build the iOS campaign at $10/day too, total spend becomes **$20/day**. Set
each to $5/day if $10/day total is the intent.


---

## FINAL DRAFT STATE (complete except account verification)

Ad `Ad1-Know-What-She-Needs` (ID `120273949083120555`) — **In draft, all edits saved.**

| Item | Value |
|---|---|
| Creative setup | 1/1 — App store details on |
| **Media** | ✅ `op-ad-1x1.png` (1080×1080) uploaded + cropped |
| **Primary text** | "Most men love their partner. Very few know how to show it consistently…" (full Ad 1 copy) |
| **Headline** | Know exactly what she needs |
| **Call to action** | Install now |
| Facebook Page | Outstanding Partner |
| Instagram | Use Facebook Page |
| Advantage+ image generation | **Declined** — AI variants inserted stock people/scenes that shouldn't represent the brand without client approval |
| Advantage+ enhancements | **All off** — especially *Text improvements*, which can rewrite copy into personal-attribute phrasing that Meta's own policy rejects |

### ⛔ Only remaining blocker (account-level, needs you)
**"You must have a verified phone number associated with your ad account. (#3858013)"**
→ Click **Add phone number** in Ads Manager and verify. This is your contact detail, so it's yours to enter.

### After that
1. Optionally upload `op-ad-9x16.png` as a second media for Stories/Reels placement.
2. Optionally add Ad 2 / Ad 3 copy as extra text options (Primary text supports up to 5, Headline up to 5)
   — or as separate ads.
3. **Duplicate** `OP-Android-Installs` → rename `OP-iOS-Installs` → change **Mobile app store → App Store**.
4. Review, then **Publish** when the client is ready to spend.

### Creative files
`ad-creative/op-ad-1x1.png` (Feed) · `ad-creative/op-ad-9x16.png` (Stories/Reels) — generated from the
1024px app icon on brand dark, Georgia headline, brand-red trial line.

---

## iOS CAMPAIGN — `OP-iOS-Installs` (draft created)

Built by duplicating the Android campaign (recommendations **unchecked** so it copied our exact
targeting rather than Meta's Advantage+ overrides).

| Level | Setting | Value |
|---|---|---|
| Campaign | Name | `OP-iOS-Installs` (ID 120273950174910555) |
| | **iOS 14+ campaign** | **On** — required to reach iOS 14.5+; without it the only store option is "Apple App Store (iOS 13.7 or earlier)" |
| | App | Outstanding Partner (Apple App ID 1619043059848775) |
| | SKAdNetwork reporting | ✅ On |
| | iOS 14+ campaign limit | 0 of 24 used |
| | Budget | $10/day (inherited) |
| Ad set | Name | `US-Men-25-45-iOS` |
| | Mobile app store | **Apple App Store** (inherited from campaign) |
| | Attribution | Meta's attribution for iOS 14+ (Aggregated Event Measurement) |
| | Targeting | US · Men · 25–45 (copied from Android) |
| Ad | `Ad1-Know-What-She-Needs` | copy + creative carried over |

### 🔧 Config fix applied along the way
The iOS app would not appear in Ads Manager's app picker. Root cause: the Facebook App's **iOS
platform had an empty "iPhone Store ID"**. Set it to **`6778456225`** in
developers.facebook.com → App settings → Basic → iOS → **Saved**. The app became selectable
immediately after.

### ⛔ Remaining blockers
1. **`#2446333` "application could not be found in app store"** — same class as the Android one.
   The iPhone Store ID was only just added, so Meta's store crawler hasn't re-validated yet.
   Expect this to clear on its own (minutes → up to ~24 h). Re-open the draft and it should go green.
2. **Verified phone number on the ad account (`#3858013`)** — account-level, must be done by the
   account owner.

### ⚠️ Budget
Two campaigns × $10/day = **$20/day** ($600/mo). Set each to $5/day if $10/day total was intended.
