import { useState, useCallback } from 'react';
import { AppStateProvider } from './state/AppStateProvider.jsx';
import AppShell from './components/AppShell.jsx';

export default function App() {
  // Bumping this key remounts the provider so its useState initializers re-read localStorage
  // after cloud sync restores a user's data — a reliable replacement for location.reload()
  // (which is fragile in a native WebView).
  const [hydrationKey, setHydrationKey] = useState(0);
  const rehydrate = useCallback(() => setHydrationKey(k => k + 1), []);

  return (
    <AppStateProvider key={hydrationKey} onRehydrated={rehydrate}>
      <AppShell />
    </AppStateProvider>
  );
}
