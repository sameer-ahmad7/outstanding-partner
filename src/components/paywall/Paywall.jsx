import { rcLogOut } from '../../services/revenuecat.service.js';
import { signOutUser } from '../../services/auth.service.js';
import { openExternal } from '../../utils/helpers.js';

// Hard paywall (subscription-only). State is owned by App and passed in as props;
// service calls (restore/logout) are imported directly.
export default function Paywall({
  subscription, isPreviewMode,
  selectedPlan, setSelectedPlan,
  subMsg, setSubMsg,
  setSubscribed, setAuthUser, setLegalView,
}) {
  const off = subscription.offering;
  const pkgs = (off && off.availablePackages) || [];
  const monthly = pkgs.find(p => p.packageType === 'MONTHLY') || pkgs.find(p => /month/i.test(p.identifier || ''));
  const annual = pkgs.find(p => p.packageType === 'ANNUAL') || pkgs.find(p => /(annual|year)/i.test(p.identifier || ''));
  // storeReady === false means RevenueCat returned no offering (misconfigured products,
  // missing store setup, or no network). Previously we fell back to hardcoded prices, so a
  // completely non-functional paywall still LOOKED normal — the user tapped Subscribe and
  // silently got nothing. Surface it instead of masking it.
  const storeReady = !!(monthly || annual);
  const monthlyPrice = (monthly && monthly.product && monthly.product.priceString) || '$21.99';
  const annualPrice = (annual && annual.product && annual.product.priceString) || '$224.99';
  const chosen = selectedPlan === 'annual' ? (annual || monthly) : (monthly || annual);

  // Only claim a free trial when the store actually reports one. Previously this fell back to
  // "7-day free trial" unconditionally, so the paywall could promise a trial the user isn't
  // eligible for (e.g. they already used it) — the store sheet would then ask for full price,
  // which reads as a bait-and-switch and kills trust at the moment of purchase.
  const trialOf = (pkg) => {
    try {
      const ip = pkg && pkg.product && pkg.product.introPrice;
      if (ip && Number(ip.price) === 0 && ip.periodNumberOfUnits) {
        const u = String(ip.periodUnit || '').toLowerCase();
        const unit = u.includes('day') ? 'day' : u.includes('week') ? 'week' : u.includes('month') ? 'month' : u.includes('year') ? 'year' : u;
        const n = ip.periodNumberOfUnits;
        return { label: `${n}-${unit}${n > 1 ? 's' : ''} free`, n, unit };
      }
    } catch (e) { /* ignore */ }
    return null;
  };
  const chosenTrial = () => trialOf(selectedPlan === 'annual' ? annual : monthly);

  const doSubscribe = async () => {
    setSubMsg('');
    if (isPreviewMode) { setSubscribed(true); return; }
    if (!chosen) {
      setSubMsg('Subscriptions aren’t available right now. Check your connection and try again in a moment.');
      try { await subscription.refresh?.(); } catch (e) { /* ignore */ }
      return;
    }
    try { const ok = await subscription.purchase(chosen); if (ok) { setSubscribed(true); } else { setSubMsg('Purchase was not completed.'); } }
    catch (e) { const m = (e && e.message) || ''; if (!/cancel|defer/i.test(m)) setSubMsg(m || 'Purchase failed. Please try again.'); }
  };

  const doRestore = async () => {
    setSubMsg('');
    try { const ok = await subscription.restore(); if (ok) { setSubscribed(true); } else { setSubMsg('No active subscription found to restore.'); } }
    catch (e) { setSubMsg('Could not restore purchases.'); }
  };

  const planCard = (k, label, price, per, note, badge) => {
    const sel = selectedPlan === k;
    return (
      <button onClick={() => setSelectedPlan(k)} style={{ textAlign: 'left', width: '100%', background: sel ? '#1a1a1a' : '#141414', border: `2px solid ${sel ? '#c0392b' : '#2a2a2a'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f0ece4' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#27ae60', fontWeight: 600, marginTop: 3 }}>{note}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#f0ece4' }}>{price}<span style={{ fontSize: 11, color: '#666', fontWeight: 400 }}>{per}</span></div>
          {badge && <div style={{ fontSize: 9, color: '#fff', background: '#c0392b', borderRadius: 6, padding: '2px 6px', marginTop: 4, display: 'inline-block', fontWeight: 700 }}>{badge}</div>}
        </div>
      </button>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0d", zIndex: 9998, display: "flex", flexDirection: "column", justifyContent: "center", padding: "max(32px,env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))", boxSizing: "border-box", overflowY: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Outstanding Partner</div>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 6 }}>Be the partner she brags about.</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{chosenTrial() ? `Start with a ${chosenTrial().n}-${chosenTrial().unit} free trial. Cancel anytime.` : 'Cancel anytime.'}</div>
      </div>

      <div style={{ background: "#0a1a0a", border: "1px solid #27ae6030", borderRadius: 12, padding: "9px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16 }}>🧠</span>
        <div style={{ fontSize: 11, color: "#27ae60", fontWeight: 700 }}>Built with psychologists · relationship science</div>
      </div>

      {planCard('annual', 'Yearly', annualPrice, '/yr',
        trialOf(annual) ? `${trialOf(annual).label}, then ${annualPrice}/yr` : `Billed yearly`, 'BEST VALUE')}
      {planCard('monthly', 'Monthly', monthlyPrice, '/mo',
        trialOf(monthly) ? `${trialOf(monthly).label}, then ${monthlyPrice}/mo` : `Billed monthly`)}

      {!storeReady && !isPreviewMode && (
        <div style={{ background: "#2a1414", border: "1px solid #e74c3c50", borderRadius: 10, padding: "10px 14px", margin: "4px 0 10px" }}>
          <div style={{ fontSize: 12, color: "#e74c3c", fontWeight: 700, marginBottom: 3 }}>Plans couldn’t be loaded</div>
          <div style={{ fontSize: 11, color: "#c98b84", lineHeight: 1.5 }}>We can’t reach the store right now, so purchases are unavailable. Please check your connection and try again.</div>
          <button onClick={() => subscription.refresh?.()} style={{ background: "transparent", border: "1px solid #e74c3c60", color: "#e74c3c", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Retry</button>
        </div>
      )}

      {subMsg && <div style={{ fontSize: 12, color: "#e74c3c", textAlign: "center", margin: "2px 0 8px" }}>{subMsg}</div>}

      {storeReady && chosenTrial() && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#27ae60", fontWeight: 700, margin: "2px 0 8px" }}>
          $0 due today · You won’t be charged until your {chosenTrial().n}-{chosenTrial().unit} trial ends
        </div>
      )}

      <button onClick={doSubscribe} disabled={subscription.busy || (!storeReady && !isPreviewMode)} style={{ width: "100%", background: "linear-gradient(135deg,#c0392b,#8e44ad)", color: "#fff", border: "none", borderRadius: 12, padding: "16px 14px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 4, opacity: (subscription.busy || (!storeReady && !isPreviewMode)) ? 0.55 : 1, letterSpacing: "0.02em" }}>
        {subscription.busy ? "Processing…" : isPreviewMode ? "Enter App →"
          : chosenTrial() ? `Start ${chosenTrial().n}-${chosenTrial().unit} Free Trial →` : "Subscribe →"}
      </button>
      <button onClick={doRestore} disabled={subscription.busy} style={{ width: "100%", background: "transparent", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "11px" }}>Restore Purchases</button>

      <div style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.6, margin: "4px 0 12px" }}>
        Payment is charged to your account at confirmation. Subscriptions auto-renew unless turned off at least 24 hours before the end of the current period; manage or cancel anytime in your account settings.
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => openExternal('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Terms of Use</button>
        <button onClick={() => setLegalView("privacy")} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</button>
        <button onClick={() => setLegalView("support")} style={{ background: "transparent", border: "none", color: "#777", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Support</button>
      </div>

      <button onClick={async () => { try { await rcLogOut(); } catch (e) { /* ignore */ } if (!isPreviewMode) { try { await signOutUser(); } catch (e) { /* ignore */ } } setAuthUser(null); }} style={{ background: "transparent", border: "none", color: "#444", fontSize: 11, cursor: "pointer", textAlign: "center", width: "100%" }}>Sign out</button>
    </div>
  );
}
