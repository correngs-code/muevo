import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker (PWA). Resolves relative to the deployment base
// so it works on both Vercel (root) and GitHub Pages (/muevo/).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', document.baseURI).href
    navigator.serviceWorker.register(swUrl, { scope: './' }).catch(() => {
      // Silently ignore — app still works without SW
    })
  })
}
