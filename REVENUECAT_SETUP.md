# RevenueCat Setup (Phase 5)

The app gates premium features behind the RevenueCat `premium` entitlement.

## 1. RevenueCat dashboard

1. Create a project (or use existing). Add an **iOS app** and an **Android app**.
2. **Entitlement:** create `premium`.
3. **Offering:** create `default` and make it current.
4. **Packages** in `default`:
   - Monthly → product `com.outstandingpartner.app.monthly` ($21.99/mo, 7-day intro trial)
   - (optional) Yearly → `com.outstandingpartner.app.yearly`
5. Attach the store products to the packages, and attach the products to the `premium` entitlement.
6. Copy the **public SDK keys** (one per platform) into `.env`:
   ```
   VITE_REVENUECAT_IOS_API_KEY=appl_...
   VITE_REVENUECAT_ANDROID_API_KEY=goog_...
   ```

## 2. Store products

- **App Store Connect:** create a subscription group + auto-renewing product `…monthly`
  (and `…yearly`), with a 7-day free trial intro offer. Submit for review with the app.
- **Google Play Console:** create a subscription `…monthly` with a 7-day free trial base plan.
- Link both product ids inside RevenueCat.

## 3. App integration (code — Phase 5)

- `services/revenuecat.service.js`: `configure`, `logIn(supabaseUserId)`, `getOfferings`,
  `purchasePackage`, `restorePurchases`, `getCustomerInfo`, `logOut`.
- `hooks/useSubscription.js`: exposes `{ isPremium, offerings, purchase, restore, loading }`
  derived from `customerInfo.entitlements.active.premium`.
- Replace the temporary `setSubscribed(true)` after login with the real entitlement check.
- Paywall + `PremiumGate` read `isPremium`.

## 4. Testing without store access (now)

- **iOS:** add a local **StoreKit Configuration** file in Xcode (Product → Scheme → Edit →
  Run → Options → StoreKit Configuration) with the monthly product. This lets you test
  purchase + restore in the simulator before App Store Connect is ready.
- **Android:** real testing needs a Play Console internal-testing track (deferred until access).

## 5. Webhook (optional, recommended)

Configure a RevenueCat webhook → a Supabase edge function that writes the
`user_subscriptions` row (service role) so the backend has a subscription mirror.
RLS already lets users read their own `user_subscriptions` row.
