import { Capacitor } from '@capacitor/core';

// Configure the native status bar to match the dark brand theme.
// No-op on web. Imported lazily so web builds don't pull native code paths.
export async function initStatusBar() {
  if (!Capacitor.isNativePlatform?.()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark }); // dark theme -> light icons
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#0d0d0d' });
    }
  } catch (e) {
    /* status bar not available */
  }
}

export function isNative() {
  return Capacitor.isNativePlatform?.() || false;
}
