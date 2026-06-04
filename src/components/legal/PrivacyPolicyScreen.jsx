import { S } from './legalStyles.js';
import { APP_NAME, SUPPORT_EMAIL, PRIVACY_EMAIL, PRIVACY_LAST_UPDATED } from '../../config/app.config.js';

export default function PrivacyPolicyScreen({ onClose }) {
  return (
    <div style={S.overlay}>
      <div style={S.header}>
        <button style={S.back} onClick={onClose}>← Back</button>
        <span style={S.headerTitle}>Privacy Policy</span>
      </div>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💑</div>
          <div style={S.badge}>{APP_NAME}</div>
          <h1 style={S.h1}>Privacy Policy</h1>
          <p style={S.meta}>Last Updated: {PRIVACY_LAST_UPDATED}</p>
        </div>

        <h2 style={S.h2}>1. Introduction</h2>
        <p style={S.p}>{APP_NAME} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the {APP_NAME} mobile application ("App"). By using the App, you agree to this Privacy Policy.</p>

        <h2 style={S.h2}>2. Information We Collect</h2>
        <h3 style={S.h3}>Partner Information (You Enter Voluntarily)</h3>
        <ul>
          <li style={S.li}>Your partner's first name and nickname</li>
          <li style={S.li}>Your partner's date of birth</li>
          <li style={S.li}>Your partner's menstrual cycle start date</li>
          <li style={S.li}>Your anniversary and first-date dates</li>
          <li style={S.li}>Favourites and preferences, and personal notes about your partner</li>
        </ul>
        <h3 style={S.h3}>Account Information</h3>
        <ul>
          <li style={S.li}>Email address (for account creation and login)</li>
          <li style={S.li}>Password (stored only as a salted hash — we never see it in plain text)</li>
        </ul>
        <h3 style={S.h3}>Usage Information</h3>
        <ul>
          <li style={S.li}>Daily mission completion logs and streaks</li>
          <li style={S.li}>Which suggested texts you have sent</li>
          <li style={S.li}>Relationship log entries, ratings, and notes</li>
          <li style={S.li}>"She Said" journal entries and challenge progress</li>
        </ul>

        <h2 style={S.h2}>3. Health-Related Information</h2>
        <div style={S.warning}>⚕️ {APP_NAME} collects menstrual cycle data — cycle start dates and calculated phases. This is sensitive health data.</div>
        <div style={S.highlight}>✓ We never sell this data and never share it with advertisers, insurers, employers, or data brokers — ever.</div>
        <ul>
          <li style={S.li}>Stored privately in your account and synced across your own devices</li>
          <li style={S.li}>Encrypted in transit (TLS) and at rest</li>
          <li style={S.li}>Accessible only to you — enforced by database row-level security</li>
          <li style={S.li}>Deletable at any time via "Reset All Data" or "Delete Account" in the Profile tab</li>
        </ul>

        <h2 style={S.h2}>4. Information We Do NOT Collect</h2>
        <ul>
          <li style={S.li}>GPS location data</li>
          <li style={S.li}>Contacts, camera, or microphone access</li>
          <li style={S.li}>Biometric data</li>
          <li style={S.li}>Your activity on other apps or websites</li>
          <li style={S.li}>Advertising identifiers</li>
        </ul>

        <h2 style={S.h2}>5. How We Use Your Information</h2>
        <p style={S.p}>We use your information solely to:</p>
        <ul>
          <li style={S.li}>Personalize daily missions, texts, and activities to your partner's cycle phase</li>
          <li style={S.li}>Display relationship insights, streaks, and challenge progress</li>
          <li style={S.li}>Sync your data securely across your devices</li>
          <li style={S.li}>Improve your experience within the App</li>
        </ul>
        <p style={S.p}>We do <strong>not</strong> use your information for advertising, selling to third parties, or training AI models.</p>

        <h2 style={S.h2}>6. Data Storage & Security</h2>
        <p style={S.p}>Your account data is stored on secure cloud infrastructure (Supabase, built on PostgreSQL) hosted in a managed data center. Access is restricted per user by row-level security, so one account can never read another account's data. All communication uses TLS encryption, and data is encrypted at rest.</p>
        <p style={S.p}>A copy of your current data is also cached on your device so the App is fast and usable offline; it re-syncs with your account when you're online.</p>
        <h3 style={S.h3}>Data Retention</h3>
        <p style={S.p}>Your data is retained until you delete it via "Reset All Data", delete your account, or request deletion by email. Deleting your account permanently removes your profile, app data, and subscription records from our systems.</p>

        <h2 style={S.h2}>7. Third-Party Services</h2>
        <ul>
          <li style={S.li}><strong>Supabase</strong> — authentication and encrypted cloud database (<a style={S.a} href="https://supabase.com/privacy" target="_blank" rel="noreferrer">supabase.com/privacy</a>)</li>
          <li style={S.li}><strong>Apple In-App Purchase / Google Play Billing</strong> — subscription billing (<a style={S.a} href="https://www.apple.com/legal/privacy" target="_blank" rel="noreferrer">Apple</a> · <a style={S.a} href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google</a>)</li>
          <li style={S.li}><strong>RevenueCat</strong> — manages subscription entitlements (<a style={S.a} href="https://www.revenuecat.com/privacy" target="_blank" rel="noreferrer">revenuecat.com/privacy</a>)</li>
        </ul>
        <p style={S.p}>We do not use advertising networks or data brokers.</p>

        <h2 style={S.h2}>8. Children's Privacy</h2>
        <p style={S.p}>{APP_NAME} is not intended for users under 17. We do not knowingly collect information from anyone under 17. If you believe a minor has provided us information, contact us and we will delete it promptly.</p>

        <h2 style={S.h2}>9. Your Rights</h2>
        <ul>
          <li style={S.li}><strong>Access</strong> — request a copy of your data</li>
          <li style={S.li}><strong>Correction</strong> — update your information any time in the App</li>
          <li style={S.li}><strong>Deletion</strong> — "Reset All Data" or "Delete Account" in Profile, or contact us</li>
          <li style={S.li}><strong>Portability</strong> — request your data in a portable format</li>
        </ul>
        <p style={S.p}><strong>California (CCPA):</strong> you may request to know, delete, and opt out of sale (we do not sell personal information). <strong>EU/UK (GDPR):</strong> our lawful basis is your consent, which you may withdraw at any time by deleting your data.</p>

        <h2 style={S.h2}>10. Data Breach</h2>
        <p style={S.p}>We conduct regular security reviews and will notify affected users within 72 hours of discovering any data breach.</p>

        <h2 style={S.h2}>11. Changes to This Policy</h2>
        <p style={S.p}>When we update this policy we will update the "Last Updated" date and, for material changes, notify you in the App. Continued use after changes constitutes acceptance.</p>

        <h2 style={S.h2}>12. App Store Disclosures</h2>
        <h3 style={S.h3}>Data Used to Track You</h3>
        <p style={S.p}><strong>None.</strong> We do not track you across apps or websites.</p>
        <h3 style={S.h3}>Data Linked to You</h3>
        <ul>
          <li style={S.li}>Email address (account)</li>
          <li style={S.li}>Partner profile, health (cycle), and usage data — stored privately in your account</li>
          <li style={S.li}>Purchase history (via Apple / Google)</li>
        </ul>

        <div style={S.card}>
          <h3 style={S.h3}>📬 Contact Us</h3>
          <p style={S.p}>Privacy questions or data requests: <a style={S.a} href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a></p>
          <p style={S.p}>General support: <a style={S.a} href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
          <p style={{ ...S.p, color: '#555', fontSize: 12 }}>We respond to all privacy requests within 30 days.</p>
        </div>

        <div style={S.footer}>© 2026 {APP_NAME} · Compliant with App Store Guidelines · CCPA · GDPR</div>
      </div>
    </div>
  );
}
