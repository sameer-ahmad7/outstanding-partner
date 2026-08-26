import { rcLogOut } from '../../services/revenuecat.service.js';
import { signOutUser } from '../../services/auth.service.js';
import { openExternal } from '../../utils/helpers.js';

// Upgrade sheet. Single monthly plan with a free intro month.
//
// This used to be a hard wall shown to every non-subscriber at launch, offering Monthly and
// Yearly. It converted 0 of 19. It is now opened on demand by a locked feature (see
// requirePremium in AppStateProvider) and offers one plan, so there is nothing to weigh up.
// The annual product still exists in the stores for the existing subscriber — it is just no
// longer in the `default` offering, so it never reaches this screen.
export default function Paywall({
  subscription, isPreviewMode,
  subMsg, setSubMsg,
  setSubscribed, setAuthUser, setLegalView,
  onClose, reason,
}) {
  const off = subscription.offering;
  const pkgs = (off && off.availablePackages) || [];
  // Monthly is the only plan we surface. Falling back to the first package keeps the screen
  // functional if the offering is ever reshuffled store-side.
  const chosen =
    pkgs.find(p => p.packageType === 'MONTHLY') ||
    pkgs.find(p => /month/i.test(p.identifier || '')) ||
    pkgs[0] || null;

  // storeReady === false means RevenueCat returned no offering (misconfigured products,
  // missing store setup, or no network). Previously we fell back to hardcoded prices, so a
  // completely non-functional paywall still LOOKED normal — the user tapped Subscribe and
  // silently got nothing. Surface it instead of masking it.
  const storeReady = !!chosen;
  const price = (chosen && chosen.product && chosen.product.priceString) || '$8.99';

  // Only claim a free trial when the store actually reports one. Previously this fell back to
  // "7-day free trial" unconditionally, so the paywall could promise a trial the user isn't
  // eligible for (e.g. they already used it) — the store sheet would then ask for full price,
  // which reads as a bait-and-switch and kills trust at the moment of purchase.
  const trial = (() => {
    try {
      const ip = chosen && chosen.product && chosen.product.introPrice;
      if (ip && Number(ip.price) === 0 && ip.periodNumberOfUnits) {
        const u = String(ip.periodUnit || '').toLowerCase();
        const unit = u.includes('day') ? 'day' : u.includes('week') ? 'week'
          : u.includes('month') ? 'month' : u.includes('year') ? 'year' : u;
        const n = ip.periodNumberOfUnits;
        return { n, unit, label: `${n} ${unit}${n > 1 ? 's' : ''} free` };
      }
    } catch (e) { /* ignore */ }
    return null;
  })();

  const doSubscribe = async () => {
    setSubMsg('');
    if (isPreviewMode) { setSubscribed(true); onClose?.(); return; }
    if (!chosen) {
      setSubMsg('Subscriptions aren’t available right now. Check your connection and try again in a moment.');
      try { await subscription.refresh?.(); } catch (e) { /* ignore */ }
      return;
    }
    try {
      const ok = await subscription.purchase(chosen);
      if (ok) { setSubscribed(true); onClose?.(); } else { setSubMsg('Purchase was not completed.'); }
    } catch (e) {
      const m = (e && e.message) || '';
      if (!/cancel|defer/i.test(m)) setSubMsg(m || 'Purchase failed. Please try again.');
    }
  };

  const doRestore = async () => {
    setSubMsg('');
    try {
      const ok = await subscription.restore();
      if (ok) { setSubscribed(true); onClose?.(); } else { setSubMsg('No active subscription found to restore.'); }
    } catch (e) { setSubMsg('Could not restore purchases.'); }
  };

  const perk = (icon, title, body) => (
    <div key={title} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 11 }}>
      <span style={{ fontSize: 15, lineHeight: '19px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#f0ece4', lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: '#8a8a8a', lineHeight: 1.5, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0d", zIndex: 9998, display: "flex", flexDirection: "column", alignItems: "center", padding: "max(32px,var(--op-safe-top)) 24px calc(24px + var(--op-safe-bottom))", boxSizing: "border-box", overflowY: "auto" }}>
      {/* margin:auto rather than justify-content:center — see AuthScreen for why. */}
      <div style={{ width: "100%", maxWidth: 424, margin: "auto" }}>

      {onClose && (
        <button onClick={onClose} aria-label="Close"
          style={{ position: "absolute", top: "max(16px,var(--op-safe-top))", right: 18, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: 17, lineHeight: "30px", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", padding: 0 }}>×</button>
      )}

      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Outstanding Partner</div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 6 }}>
          {reason || "Be the partner she brags about."}
        </div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
          {trial ? `Your first ${trial.n === 1 ? '' : trial.n + ' '}${trial.unit}${trial.n > 1 ? 's' : ''} are free. Cancel anytime.` : 'Cancel anytime.'}
        </div>
      </div>

      <div style={{ background: "#0a1a0a", border: "1px solid #27ae6030", borderRadius: 12, padding: "9px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>🧠</span>
        <div style={{ fontSize: 11, color: "#27ae60", fontWeight: 700 }}>Built with psychologists · relationship science</div>
      </div>

      <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 14, padding: "16px 16px 6px", marginBottom: 14 }}>
        {perk("🌙", "Her full cycle playbook", "What she needs, what to avoid, and what's coming next — every phase.")}
        {perk("🎯", "Unlimited missions & texts", "Every daily mission, every message, every date idea — no daily cap.")}
        {perk("📈", "Streaks, history & Game Plan", "Your progress saved, plus the long-game plan built around her.")}
        {perk("🔔", "Phase-change reminders", "A heads-up before her needs shift, so you're never caught out.")}
      </div>

      <div style={{ background: "#1a1a1a", border: "2px solid #c0392b", borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f0ece4" }}>Premium</div>
          <div style={{ fontSize: 11, color: "#27ae60", fontWeight: 600, marginTop: 3 }}>
            {trial ? `${trial.label}, then ${price}/mo` : "Billed monthly"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#f0ece4" }}>{price}<span style={{ fontSize: 11, color: "#666", fontWeight: 400 }}>/mo</span></div>
        </div>
      </div>

      {!storeReady && !isPreviewMode && (
        <div style={{ background: "#2a1414", border: "1px solid #e74c3c50", borderRadius: 10, padding: "10px 14px", margin: "4px 0 10px" }}>
          <div style={{ fontSize: 12, color: "#e74c3c", fontWeight: 700, marginBottom: 3 }}>Plans couldn’t be loaded</div>
          <div style={{ fontSize: 11, color: "#c98b84", lineHeight: 1.5 }}>We can’t reach the store right now, so purchases are unavailable. Please check your connection and try again.</div>
          <button onClick={() => subscription.refresh?.()} style={{ background: "transparent", border: "1px solid #e74c3c60", color: "#e74c3c", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Retry</button>
        </div>
      )}

      {subMsg && <div style={{ fontSize: 12, color: "#e74c3c", textAlign: "center", margin: "2px 0 8px" }}>{subMsg}</div>}

      {storeReady && trial && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#27ae60", fontWeight: 700, margin: "2px 0 8px" }}>
          $0 due today · You won’t be charged until your free {trial.unit} ends
        </div>
      )}

      <button onClick={doSubscribe} disabled={subscription.busy || (!storeReady && !isPreviewMode)} style={{ width: "100%", background: "linear-gradient(135deg,#c0392b,#8e44ad)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 14px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 4, opacity: (subscription.busy || (!storeReady && !isPreviewMode)) ? 0.55 : 1, letterSpacing: "0.02em" }}>
        {subscription.busy ? "Processing…" : isPreviewMode ? "Enter App →"
          : trial ? `Start My Free ${trial.unit.charAt(0).toUpperCase() + trial.unit.slice(1)} →` : "Subscribe →"}
      </button>
      <button onClick={doRestore} disabled={subscription.busy} style={{ width: "100%", background: "transparent", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "11px" }}>Restore Purchases</button>

      {onClose && (
        <button onClick={onClose} style={{ width: "100%", background: "transparent", border: "none", color: "#666", fontSize: 13, cursor: "pointer", padding: "2px 0 10px" }}>Maybe later</button>
      )}

      <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.6, margin: "4px 0 12px" }}>
        Payment is charged to your account at confirmation. Subscriptions auto-renew unless turned off at least 24 hours before the end of the current period; manage or cancel anytime in your account settings.
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => openExternal('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Terms of Use</button>
        <button onClick={() => setLegalView("privacy")} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</button>
        <button onClick={() => setLegalView("support")} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Support</button>
      </div>

      {/* Escape hatch retained for the no-onClose case (a paywall opened without a way back). */}
      {!onClose && (
        <button onClick={async () => { try { await rcLogOut(); } catch (e) { /* ignore */ } if (!isPreviewMode) { try { await signOutUser(); } catch (e) { /* ignore */ } } setAuthUser(null); }} style={{ background: "transparent", border: "none", color: "#444", fontSize: 11, cursor: "pointer", textAlign: "center", width: "100%" }}>Sign out</button>
      )}
      </div>
    </div>
  );
}
