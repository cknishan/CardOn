/**
 * @module EntryPoint
 * @description Application entry point.
 * Mounts the React app into the DOM inside a BrowserRouter for client-side routing.
 *
 * @see {@link https://reactrouter.com/}
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
