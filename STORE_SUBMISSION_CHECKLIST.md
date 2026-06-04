# Store Submission Checklist

> Approval is controlled by Apple and Google and cannot be guaranteed. This covers preparation.

## Shared assets

- [ ] App name: **Outstanding Partner**
- [ ] Bundle / package id: `com.outstandingpartner.app`
- [ ] App icon 1024×1024 PNG, no transparency (generated from the compass logo)
- [ ] Screenshots (per required device sizes)
- [ ] Privacy Policy URL (host the in-app Privacy Policy content publicly)
- [ ] Support URL / email (`support@outstandingpartner.app` — confirm)
- [ ] Short + full description, keywords, category, age rating
- [ ] Reviewer test account (email/password with email confirmation handled)

## In-app requirements (already implemented)

- [x] Privacy Policy + Support reachable **without login**
- [x] Account deletion in-app (Profile → Delete Account) — Apple requirement
- [x] Reset All Data
- [x] No external/Stripe checkout for digital subscriptions (uses native IAP via RevenueCat)
- [x] No AI/secret keys in the client bundle

## iOS (App Store Connect)

- [ ] Apple Developer membership + Paid Applications Agreement
- [ ] App record, bundle id matches
- [ ] Subscription group + product(s), 7-day trial; linked in RevenueCat
- [ ] Signing team selected in Xcode; archive builds
- [ ] Sandbox purchase + restore verified
- [ ] App Privacy ("Nutrition label") filled — health (cycle) data, account, purchases
- [ ] Upload to TestFlight → submit for review

## Android (Google Play Console)

- [ ] Play developer account
- [ ] App record, package matches; signed AAB
- [ ] Subscription product; linked in RevenueCat
- [ ] Data Safety form (health data, account; not sold/shared)
- [ ] Internal testing track + testers; purchase + restore verified
- [ ] Promote to production review

## Build commands

```bash
npm run build && npx cap sync
npx cap open ios      # Xcode: Product → Archive
npx cap open android  # Android Studio: Build → Generate Signed Bundle (AAB)
```

## Pre-submit smoke test (web + both emulators)

- [ ] signup / login / logout / forgot-password
- [ ] cycle date → correct day + phase; streak; copy text; challenge progress
- [ ] cross-device sync (two accounts) + RLS isolation
- [ ] paywall: offerings load, purchase, restore, gating (Phase 5)
- [ ] Reset All Data; Delete Account
- [ ] safe areas, keyboard, Android back button
