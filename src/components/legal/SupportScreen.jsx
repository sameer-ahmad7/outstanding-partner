import { S } from './legalStyles.js';
import { APP_NAME, SUPPORT_EMAIL, PRIVACY_EMAIL, SUBSCRIPTION_PRICE, SUBSCRIPTION_TRIAL } from '../../config/app.config.js';

export default function SupportScreen({ onClose }) {
  return (
    <div style={S.overlay}>
      <div style={S.header}>
        <button style={S.back} onClick={onClose}>← Back</button>
        <span style={S.headerTitle}>Support</span>
      </div>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💑</div>
          <div style={S.badge}>{APP_NAME}</div>
          <h1 style={S.h1}>Support</h1>
          <p style={S.meta}>We're here to help. Average response time: 24 hours.</p>
        </div>

        <h2 style={S.h2}>Contact Us</h2>
        <div style={S.card}>
          <h3 style={S.h3}>📧 Email Support</h3>
          <p style={S.p}>For all questions, bugs, billing issues, and feedback.</p>
          <p style={S.p}><a style={S.a} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>🔒 Privacy & Data Requests</h3>
          <p style={S.p}>To delete your account, request your data, or report a privacy concern.</p>
          <p style={S.p}><a style={S.a} href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a></p>
        </div>

        <h2 style={S.h2}>Frequently Asked Questions</h2>

        <div style={S.card}>
          <h3 style={S.h3}>How do I cancel my subscription?</h3>
          <p style={S.p}><strong>iOS:</strong> Settings → Apple ID → Subscriptions → {APP_NAME} → Cancel Subscription.</p>
          <p style={S.p}><strong>Android:</strong> Google Play Store → Menu → Subscriptions → {APP_NAME} → Cancel.</p>
          <p style={S.p}>All subscription management is handled through Apple or Google directly — we cannot process cancellations by email.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Can I get a refund?</h3>
          <p style={S.p}><strong>iOS:</strong> Refunds are handled by Apple at <a style={S.a} href="https://reportaproblem.apple.com">reportaproblem.apple.com</a> within 48 hours of charge.</p>
          <p style={S.p}><strong>Android:</strong> Refunds are handled by Google Play support within 48 hours of charge.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Can I use {APP_NAME} on multiple devices?</h3>
          <p style={S.p}>Yes. Your data is tied to your account and securely synced, so when you sign in on a new device your partner profile, logs, and progress are restored automatically.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>How do I reset my data and start fresh?</h3>
          <p style={S.p}>Go to the <strong>Profile tab</strong> → scroll to <strong>Reset App</strong> → tap <strong>Reset All Data</strong> → confirm. This clears your partner's data, logs, and settings from this device and your account.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Why does the app ask for a period start date?</h3>
          <p style={S.p}>{APP_NAME} uses her menstrual cycle phase to personalize your daily missions, suggested texts, and activities. Each phase comes with different emotional needs — the app helps you understand and meet them. This data is private to your account and never sold or shared.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>Is my partner's information private?</h3>
          <p style={S.p}>Yes. Everything you enter — including your partner's name, birthday, and menstrual cycle data — is stored privately in your account, protected so only you can access it, encrypted in transit and at rest. It is never shared with third parties and never sold. See our Privacy Policy for full details.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>How do I delete my account and data?</h3>
          <p style={S.p}>You can clear your data instantly using <strong>Reset All Data</strong> in the Profile tab, or fully delete your account using <strong>Delete Account</strong> in the same section. You may also email <a style={S.a} href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> with the subject "Account Deletion Request" and we will process it within 30 days.</p>
        </div>

        <div style={S.card}>
          <h3 style={S.h3}>The app is crashing or not loading correctly.</h3>
          <p style={S.p}>Try these in order: force close and reopen the app; check for an update in the App Store or Google Play; restart your device; sign out and back in. If it persists, email <a style={S.a} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with your device model and OS version.</p>
        </div>

        <h2 style={S.h2}>Subscription Details</h2>
        <div style={S.card}>
          <p style={S.p}><strong style={{ color: '#f0ece4' }}>{APP_NAME} — Full Access</strong></p>
          <p style={S.p}>{SUBSCRIPTION_PRICE} · {SUBSCRIPTION_TRIAL}</p>
        </div>
        <div style={S.highlight}>✓ No charge during your free trial. Cancel any time before it ends and you will not be billed.</div>
        <p style={S.p}>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Manage or turn off auto-renewal in your device's account settings after purchase.</p>

        <div style={S.footer}>
          © 2026 {APP_NAME} · <a style={S.a} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <div style={{ marginTop: 8 }}>{APP_NAME} is not affiliated with Apple Inc. or Google LLC.</div>
        </div>
      </div>
    </div>
  );
}
