import { useState } from "react";

// Login / Signup / Forgot / Verify-email / Reset-password screen.
// State + handlers are owned by App and passed in.
// Official brand marks. Previously Apple used  (U+F8FF), a private-use glyph that only
// renders on Apple platforms and showed as blank everywhere else, and Google used the
// letter "G" rather than the brand mark. Both vendors require their own logo on these
// buttons: Apple's HIG for Sign in with Apple, Google's Identity branding guidelines.
const APPLE_MARK = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true" focusable="false">
    <path d="M17.05 12.536c-.025-2.57 2.098-3.804 2.193-3.863-1.194-1.746-3.052-1.986-3.71-2.012-1.58-.16-3.083.93-3.884.93-.8 0-2.036-.906-3.348-.882-1.723.025-3.31 1.001-4.196 2.543-1.789 3.1-.457 7.69 1.283 10.203.85 1.23 1.864 2.61 3.195 2.56 1.281-.05 1.766-.828 3.315-.828 1.548 0 1.985.828 3.343.803 1.38-.025 2.253-1.253 3.096-2.487.976-1.425 1.377-2.805 1.401-2.876-.03-.014-2.688-1.032-2.714-4.09zM14.5 4.86c.708-.858 1.185-2.05 1.055-3.238-1.02.041-2.254.679-2.986 1.536-.656.76-1.23 1.973-1.076 3.137 1.138.088 2.299-.578 3.007-1.435z"/>
  </svg>
);

const GOOGLE_MARK = (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" focusable="false">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.97-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function AuthScreen({
  authScreen, setAuthScreen,
  authEmail, setAuthEmail,
  authPassword, setAuthPassword,
  authName, setAuthName,
  authError, setAuthError, authLoading,
  handleLogin, handleSignup, handleForgot,
  handleSocialLogin, socialAuthAvailable,
  handleResendVerification, handleResetPassword, handleCheckVerification,
  pendingVerifyEmail,
  isPreviewMode, setLegalView,
  onClose,
}) {
  // Apple + Google. Apple is listed first on iOS because App Store Guideline 4.8 requires
  // Sign in with Apple to be offered at least as prominently as any other social option.
  const socialBlock = (verb) => {
    const canApple = socialAuthAvailable?.('apple');
    const canGoogle = socialAuthAvailable?.('google');
    if (!canApple && !canGoogle) return null;
    const btn = (label, icon, onClick, dark) => (
      <button key={label} onClick={onClick} disabled={authLoading}
        style={{ width: "100%", background: dark ? "#000" : "#fff", color: dark ? "#fff" : "#1f1f1f",
          border: dark ? "1px solid #333" : "1px solid #747775", borderRadius: 14, padding: "14px 20px",
          fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 10, display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10, opacity: authLoading ? 0.7 : 1,
          fontFamily: "inherit" }}>
        <span style={{ display: "inline-flex", width: 18, height: 18, flexShrink: 0 }}>{icon}</span>{label}
      </button>
    );
    return (
      <div>
        {canApple && btn(`${verb} with Apple`, APPLE_MARK, () => handleSocialLogin('apple'), true)}
        {canGoogle && btn(`${verb} with Google`, GOOGLE_MARK, () => handleSocialLogin('google'), false)}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0 16px" }}>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>OR</div>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
        </div>
      </div>
    );
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const submitReset = () => {
    if (newPassword !== confirmPassword) { setAuthError("Passwords don't match."); return; }
    handleResetPassword(newPassword);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0d", zIndex: 9999, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 28px", boxSizing: "border-box", overflowY: "auto" }}>
      {/* The overlay spans the viewport; this keeps the form itself phone-width on desktop. */}
      <div style={{ width: "100%", maxWidth: 424 }}>
      {onClose && (
        <button onClick={onClose} aria-label="Close"
          style={{ position: "absolute", top: "max(16px,env(safe-area-inset-top))", right: 18, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", fontSize: 17, lineHeight: "30px", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", padding: 0 }}>×</button>
      )}

      {authScreen === "login" && (
        <div>
          <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Outstanding Partner</div>
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
          {socialBlock('Sign in')}

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
              Sign up free
            </button>
          </div>
        </div>
      )}

      {authScreen === "signup" && (
        <div>
          <div style={{ fontSize: 11, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>Outstanding Partner</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 6 }}>Create your free account.</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>Free to use. Save your progress and track her cycle — no card needed.</div>

          <div style={{ background: "linear-gradient(135deg,#0a1a0a,#111)", border: "1px solid #27ae6040", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>🧠</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 4 }}>Developed in Consultation with Psychologists</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>Built on relationship science, attachment theory, and neurochemistry — developed in consultation with psychologists.</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, padding: "12px 16px", background: "#1a1a1a", borderRadius: 12, border: "1px solid #2a2a2a" }}>
            {["Track her cycle — see her phase every day", "Daily missions tailored to that phase", "Your streak and progress, saved", "The \"She Said\" journal", "Free — upgrade later if you want the full playbook"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{f}</span>
              </div>
            ))}
          </div>
          <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Your first name" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          {socialBlock('Sign up')}

          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Create a password (min 8 characters)" type="password" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 6 }} />
          <div style={{ fontSize: 11, color: "#555", marginBottom: 16, lineHeight: 1.5 }}>By signing up you agree to our Terms of Service and Privacy Policy.</div>
          {authError && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#1a0a0a", borderRadius: 8 }}>{authError}</div>}
          <button onClick={handleSignup} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Creating account..." : "Create Free Account →"}
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

      {authScreen === "verify" && (
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1a1500", border: "1px solid #f39c1240", color: "#f39c12", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 999, marginBottom: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f39c12", display: "inline-block" }} /> Email not verified
          </div>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📧</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 8 }}>Verify your email.</div>
          <div style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 16 }}>
            We sent a verification link to{" "}
            <span style={{ color: "#f0ece4", fontWeight: 600 }}>{pendingVerifyEmail || authEmail || "your email"}</span>.
            Open it on this device and tap the button to confirm your account — the app will continue automatically.
          </div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>Can't find it? Check your spam folder, or resend below.</div>
          {authError && <div style={{ color: authError.includes("sent") ? "#27ae60" : "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#111", borderRadius: 8 }}>{authError}</div>}
          <button onClick={() => handleCheckVerification(false)} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Checking..." : "I've Verified — Continue"}
          </button>
          <button onClick={handleResendVerification} disabled={authLoading} style={{ width: "100%", background: "#1a1a1a", color: "#888", border: "1px solid #333", borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            Resend Email
          </button>
          <button onClick={() => { setAuthScreen("login"); setAuthError(""); }} style={{ width: "100%", background: "transparent", border: "none", color: "#555", fontSize: 13, cursor: "pointer", padding: "8px" }}>
            ← Back to login
          </button>
        </div>
      )}

      {authScreen === "reset" && (
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif", lineHeight: 1.2, marginBottom: 8 }}>Set a new password.</div>
          <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Choose a new password for your account.</div>
          <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 8 characters)" type="password" style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 10 }} />
          <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" type="password" onKeyDown={e => e.key === "Enter" && submitReset()} style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "#f0ece4", borderRadius: 12, padding: "14px 16px", fontSize: 15, boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16 }} />
          {authError && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, padding: "10px 12px", background: "#1a0a0a", borderRadius: 8 }}>{authError}</div>}
          <button onClick={submitReset} disabled={authLoading} style={{ width: "100%", background: "#c0392b", color: "#fff", border: "none", borderRadius: 14, padding: "16px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12, opacity: authLoading ? 0.7 : 1 }}>
            {authLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 28 }}>
        <button onClick={() => setLegalView("privacy")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Privacy Policy</button>
        <button onClick={() => setLegalView("support")} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Support</button>
      </div>
      </div>
    </div>
  );
}
