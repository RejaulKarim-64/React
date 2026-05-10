import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { enableAntiInspect, initAntiInspect } from './utils/antiInspect.js'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initAntiInspect()
enableAntiInspect()
