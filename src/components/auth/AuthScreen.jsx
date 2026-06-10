// Login / Signup / Forgot-password screen. State + handlers are owned by App and passed in.
export default function AuthScreen({
  authScreen, setAuthScreen,
  authEmail, setAuthEmail,
  authPassword, setAuthPassword,
  authName, setAuthName,
  authError, setAuthError, authLoading,
  handleLogin, handleSignup, handleForgot,
  isPreviewMode, setLegalView,
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0d", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 28px", boxSizing: "border-box", overflowY: "auto" }}>
      {authScreen === "login" && (
        <div>
          <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Better Husband</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 6 }}>Welcome back.</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>Sign in to continue your journey.</div>

          <div style={{ background: "linear-gradient(135deg,#0a1a0a,#111)", border: "1px solid #27ae6040", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 4 }}>Developed in Consultation with Psychologists</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Built in consultation with psychologists and grounded in relationship science, attachment theory, and neurochemistry.</div>
            </div>
          </div>
          {isPreviewMode && (
            <div style={{ background: "#1a1a00", border: "1px solid #f39c1240", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#f39c12", fontWeight: 700, marginBottom: 4 }}>⚡ Preview Mode</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>No backend connected. Tap Sign In to enter the app directly — no real account needed for testing.</div>
            </div>
          )}
          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder={isPreviewMode ? "Any password (preview mode)" : "Password"} type="password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 6 }} />
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <button onClick={() => setAuthScreen("forgot")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: 0 }}>Forgot password?</button>
          </div>
          {authError && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#1a0a0a", borderRadius: 8 }}>{authError}</div>}
          <button onClick={handleLogin} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Signing in..." : isPreviewMode ? "Enter App →" : "Sign In"}
          </button>
          <div style={{ textAlign: "center", fontSize: 13, color: "#555" }}>
            Don't have an account?{" "}
            <button onClick={() => { setAuthScreen("signup"); setAuthError(""); }} style={{ background: "transparent", border: "none", color: "#c0392b", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>
              Start free trial
            </button>
          </div>
        </div>
      )}

      {authScreen === "signup" && (
        <div>
          <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Better Husband</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 6 }}>Start your 7-day free trial.</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>Then $21.99/month. Cancel anytime.</div>

          <div style={{ background: "linear-gradient(135deg,#0a1a0a,#111)", border: "1px solid #27ae6040", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 4 }}>Developed in Consultation with Psychologists</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Built on relationship science, attachment theory, and neurochemistry — developed in consultation with psychologists.</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, padding: "12px 16px", background: "#1a1a1a", borderRadius: 12, border: "1px solid #2a2a2a" }}>
            {["200+ phase-matched texts — new ones added every month", "100 date ideas + 60 at-home activities", "Daily missions tailored to her cycle phase", "Full profile: zodiac, numerology, and cycle tracking", "30/60/90-day partner challenge"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{f}</span>
              </div>
            ))}
          </div>
          <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Your first name" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Create a password (min 8 characters)" type="password" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 6 }} />
          <div style={{ fontSize: 11, color: "#555", marginBottom: 16, lineHeight: 1.5 }}>By signing up you agree to our Terms of Service and Privacy Policy. You can cancel anytime from your account settings.</div>
          {authError && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#1a0a0a", borderRadius: 8 }}>{authError}</div>}
          <button onClick={handleSignup} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Creating account..." : "Start Free Trial →"}
          </button>
          <div style={{ textAlign: "center", fontSize: 13, color: "#555" }}>
            Already have an account?{" "}
            <button onClick={() => { setAuthScreen("login"); setAuthError(""); }} style={{ background: "transparent", border: "none", color: "#c0392b", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0 }}>
              Sign in
            </button>
          </div>
        </div>
      )}

      {authScreen === "forgot" && (
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Reset Password</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>We'll send you a reset link.</div>
          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Your email address" type="email" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />
          {authError && <div style={{ color: authError.includes("sent") ? "#27ae60" : "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#111", borderRadius: 8 }}>{authError}</div>}
          <button onClick={handleForgot} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Sending..." : "Send Reset Link"}
          </button>
          <button onClick={() => { setAuthScreen("login"); setAuthError(""); }} style={{ width: "100%", background: "transparent", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: "8px" }}>
            ← Back to login
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 28 }}>
        <button onClick={() => setLegalView("privacy")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</button>
        <button onClick={() => setLegalView("support")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Support</button>
      </div>
    </div>
  );
}
