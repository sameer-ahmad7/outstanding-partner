# Feature Tiering — LOCKED (2026-08-21)

The agreed free/paid split. **This is the spec WS3 (freemium) is built against.**
Rationale lives in `PRICING_TIERING_RECOMMENDATION.md`.

**Model:** $8.99/month, **first month free**, monthly only. One entitlement (`premium`).
No separate cycle purchase — the cycle *depth* is part of the subscription.

---

## 🆓 Free — no account
| Feature | Notes |
|---|---|
| Today's mission | phase-matched |
| One ready-to-send text | 1/day |
| A handful of date ideas | small sample |
| Read-only view of the four cycle phases | explains the concept, no tracking |

## 👤 Free — with an account
| Feature | Notes |
|---|---|
| Set up her cycle start date | |
| **Today's** day + phase | e.g. "Day 17 of 28 · Luteal 🌘" |
| The one-line phase `tip` | e.g. "She needs patience and emotional safety." |
| Save progress + streak | |
| "She Said" journal | |

## 💳 Paid — $8.99/mo, first month free
| Feature | Notes |
|---|---|
| Full 190+ text library | free tier gets 1/day |
| All 60 activities + 100 date ideas | |
| 30/60/90-Day Partner Challenge | |
| Anniversary + birthday reminders | 21-day advance warning |
| **Full "What she needs" playbook** | `fromYou` (5 actions) · **`avoid` (4 things not to do)** · `physical` · `emotional` |
| **Cycle forecast** | "she enters her toughest week in 3 days" |
| Cycle history + insights | |
| Phase-change reminders | |

---

## The cycle split — the part that took the most thought

Split on **two axes**, both already present in `CYCLE_PHASES` (`src/constants/data.js`):

| Axis | Free | Paid |
|---|---|---|
| **Depth** | *where she is* — day, phase, one-line tip | *what to do about it* — the full playbook |
| **Time** | **today** only | **ahead** (forecast) + **behind** (history) |

**Implementation pointers**
- Free renders `CYCLE_PHASES[phase].tip` only.
- Paid renders `CYCLE_PHASES[phase].whatSheNeeds.*`.
- `whatSheNeeds.avoid` is the **highest-value locked item** — surface it as the visible lock
  ("4 things not to do this week"), it's what this audience most fears getting wrong.
- The forecast is the landing page's headline claim ("know days in advance when she's entering her
  toughest week") — pricing it as premium makes marketing and product agree.

⚠️ **Phase *detection* stays free, deliberately.** It's the 10-second proof the app is different and
it's what the ads promise. Charging to learn *which phase she's in* recreates the promise-vs-delivery
gap that cost 19/19 conversions on the $224.99 sheet. Charging for *what to do* and *what's coming*
carries none of that risk.

**Principle:** free proves it works, paid gives you more of it. People upgrade for volume and depth,
never because they hit an arbitrary wall.
