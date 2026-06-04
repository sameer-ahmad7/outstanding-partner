// Snapshot / restore the local persisted app state as a single plain object.
// The app already writes every field to localStorage (via safeSet); we treat the
// whole keyspace (minus auth/subscription/session keys) as the syncable document.

const EXCLUDE_PREFIXES = ['sb-']; // Supabase auth session keys
const EXCLUDE_KEYS = new Set([
  'authUser',
  'authToken',
  'subscribed', // subscription state comes from RevenueCat, not cross-device sync
  'subTier',
  'lastFired', // device-local reminder timing
]);

function isExcluded(key) {
  if (!key) return true;
  if (EXCLUDE_KEYS.has(key)) return true;
  return EXCLUDE_PREFIXES.some((p) => key.startsWith(p));
}

export function snapshotLocal() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isExcluded(k)) continue;
      out[k] = localStorage.getItem(k);
    }
  } catch (e) {
    /* storage blocked */
  }
  return out;
}

export function restoreLocal(obj) {
  try {
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (isExcluded(k)) return;
      if (typeof v === 'string') localStorage.setItem(k, v);
    });
  } catch (e) {
    /* storage blocked */
  }
}
