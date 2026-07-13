import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The native (Capacitor) build serves the app from the web root ('/'); the web
// deployment serves it under '/app/' on Firebase Hosting. Set VITE_TARGET=web
// (via `npm run build:web`) for the web build.
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_TARGET === 'web' ? '/app/' : '/',
  plugins: [react()],
})
