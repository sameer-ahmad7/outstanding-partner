// Shared styles for the legal/support full-screen views (dark brand theme).
export const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 10000, background: '#0d0d0d',
    color: '#c8c4bc', overflowY: 'auto',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    WebkitOverflowScrolling: 'touch',
  },
  header: {
    position: 'sticky', top: 0, background: '#0d0d0d', borderBottom: '1px solid #1e1e1e',
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', zIndex: 2,
  },
  back: {
    background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#f0ece4',
    borderRadius: 10, padding: '8px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  headerTitle: { fontSize: 16, fontWeight: 700, color: '#f0ece4' },
  container: { maxWidth: 680, margin: '0 auto', padding: '24px 18px 80px', lineHeight: 1.8 },
  badge: {
    display: 'inline-block', background: '#1a1a1a', border: '1px solid #c0392b30',
    color: '#c0392b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 20, marginBottom: 16,
  },
  h1: { fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#f0ece4', marginBottom: 8 },
  meta: { fontSize: 13, color: '#555', marginBottom: 8 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#f0ece4', margin: '34px 0 12px', paddingBottom: 8, borderBottom: '1px solid #1e1e1e' },
  h3: { fontSize: 14, fontWeight: 700, color: '#e0dbd3', margin: '18px 0 8px' },
  p: { fontSize: 14, color: '#999', marginBottom: 12 },
  li: { fontSize: 14, color: '#999', marginBottom: 8 },
  a: { color: '#c0392b', textDecoration: 'none', fontWeight: 600 },
  card: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: '18px 20px', margin: '12px 0' },
  highlight: { background: '#0a1a0a', border: '1px solid #27ae6030', borderRadius: 10, padding: '14px 18px', margin: '16px 0', color: '#27ae60', fontWeight: 600, fontSize: 14 },
  warning: { background: '#1a0a0a', border: '1px solid #c0392b30', borderRadius: 10, padding: '14px 18px', margin: '16px 0', color: '#c0392b', fontWeight: 600, fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 40, paddingTop: 24, borderTop: '1px solid #1e1e1e', fontSize: 12, color: '#444' },
};
