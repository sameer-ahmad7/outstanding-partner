# Message to send the client — Resend setup

---

Hi,

I've finished building **email verification** for new sign-ups, plus **forgot-password** and **change-password** flows. The verification and reset emails are fully branded (Outstanding Partner styling) and contain a button that opens the app directly on the user's phone.

To send these emails reliably, we need to plug in **Resend** as our email provider. A couple of quick things I need from you:

**Why Resend?**
Supabase (our backend) has a built-in email sender, but it's only meant for testing — it's rate-limited to a handful of emails per hour and sends from a generic `@supabase.co` address, which looks untrustworthy and often lands in spam. Resend lets us send unlimited branded emails from **our own domain** (`hello@outstandingpartner.app`) with proper deliverability, so verification/reset emails actually reach users' inboxes. The free plan (3,000 emails/month) is plenty to launch.

**What I need you to do (5 minutes):**
1. **Sign up** for a free account at **https://resend.com**.
2. **Add me as a team member** so I can finish the configuration — invite **sameer.ahmad3247@gmail.com** (Resend → Settings → Team → Invite).
3. **Add our domain**: in Resend → Domains → Add Domain → `outstandingpartner.app`. It will show a few DNS records — **send me a screenshot of those**, and I'll tell you exactly what to paste into Namecheap (it's the same place we set up the website domain). This is what proves we own the domain so email doesn't get marked as spam.
4. **Create an API key** (Resend → API Keys → Create) and **share it with me securely**.

Once you've done the above and the domain shows "Verified", I'll connect everything to the backend, turn on email verification, and run a full test (sign up → receive the branded email → tap the button → app opens and confirms the account). I'll also confirm the friends-and-family "free forever" codes still work with verification on.

Thanks!

---

### (Internal note — not for the client)
After the client completes the above, follow `email-templates/README.md`:
configure Supabase Custom SMTP with the Resend key, paste the two templates,
turn on "Confirm email", then test end-to-end on the simulator/device including the redeem flow.
