# Firebase Hosting — Privacy & Support pages

Hosts ONLY the two legal pages (`web-legal/`) at your custom domain — for the App Store
"Privacy Policy URL" / "Support URL" and the in-app links. The React app is **not** deployed
to web (no login/signup is publicly visible). The full web app + Stripe is a later phase.

```
web-legal/
  index.html     # minimal hub: links to /privacy and /support
  privacy.html   # → served at /privacy  (cleanUrls)
  support.html   # → served at /support
firebase.json    # public: web-legal, cleanUrls, rewrites
```

## 1. One-time: log in to Firebase CLI
On your machine (you have the Firebase account):
```bash
cd ~/Desktop/outstanding-partner
npx firebase-tools login          # opens a browser
npx firebase-tools use --add      # pick (or create) your Firebase project → alias "default"
```
> Prefer a brand-new Firebase project (e.g. `outstanding-partner`). Hosting works on the free Spark plan.

## 2. Deploy
```bash
npx firebase-tools deploy --only hosting
```
You'll get a live URL like `https://<project>.web.app`. Test:
- `https://<project>.web.app/`         → hub
- `https://<project>.web.app/privacy`  → Privacy Policy
- `https://<project>.web.app/support`  → Support

*(If you'd rather I run the deploy, either run `npx firebase-tools login` once on this machine,
or create a CI token with `npx firebase-tools login:ci` and share it — I'll deploy with
`firebase deploy --only hosting --token <token>`.)*

## 3. Custom domain (Namecheap)
1. Firebase Console → **Hosting** → **Add custom domain** → enter your domain
   (e.g. `outstandingpartner.app`, or a subdomain like `legal.outstandingpartner.app`).
2. Firebase shows DNS records to add. In **Namecheap → Domain List → Manage → Advanced DNS**:
   - Add the **TXT** record Firebase gives (domain verification).
   - Then add the **A** records Firebase provides (two IPs) for the root, **or** a **CNAME** to
     `<project>.web.app` for a subdomain.
3. Back in Firebase, click **Verify**. SSL is provisioned automatically (can take 15 min–24 h).
4. Final URLs: `https://yourdomain/privacy` and `https://yourdomain/support`.

## 4. Use the URLs
- **App Store Connect:** App Privacy → **Privacy Policy URL**; App Information → **Support URL**.
- **Google Play Console:** Store listing → **Privacy Policy**; Support email/website.
- These match the in-app Privacy/Support screens (same content).

## Updating later
Edit files in `web-legal/`, then `npx firebase-tools deploy --only hosting`.
