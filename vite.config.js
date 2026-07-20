import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The native (Capacitor) build serves the app from the web root ('/'); the web
// deployment serves it under '/app/' on Firebase Hosting. Set VITE_TARGET=web
// (via `npm run build:web`) for the web build.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_TARGET === 'web' ? '/app/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // The @capacitor-firebase plugins ship a web implementation that imports the
      // optional `firebase` JS SDK. We never use their web path (native uses the
      // native bridge; the browser build uses GA4 + Meta Pixel directly), and
      // Capacitor only lazy-loads a plugin's web impl on the web platform when a
      // method is actually called — which our isNative() guards prevent. Externalize
      // so the bundler doesn't try to resolve an SDK we don't ship.
      external: [/^firebase(\/|$)/],
    },
  },
})
