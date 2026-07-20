import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initWebAnalytics } from './services/analytics.web.js'

// GA4 + Meta Pixel on the web build only (no-op on native + localhost).
initWebAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
