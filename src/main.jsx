import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initWebAnalytics } from './services/analytics.web.js'
import { initNativeTracking } from './services/analytics.native.js'

// Web build → GA4 + Meta Pixel; native build → Firebase Analytics/Crashlytics +
// Meta App Events + iOS ATT. Each is a no-op on the other platform.
initWebAnalytics()
initNativeTracking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
