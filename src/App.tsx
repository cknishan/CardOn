/**
 * @module App
 * @description Root application component.
 * Defines all routes using React Router v6 and wraps them in the shared Layout.
 *
 * Route structure:
 * - `/` — Dashboard (deck list)
 * - `/account` — Account & sign-in state
 * - `/settings` — Settings & data management
 * - `/decks/new` — Create a new deck
 * - `/decks/:deckId` — Deck detail (card list)
 * - `/decks/:deckId/edit` — Edit deck name
 * - `/decks/:deckId/study` — Study session
 * - `/decks/:deckId/import` — Markdown import
 * - `/decks/:deckId/cards/new` — Add a new card
 * - `/decks/:deckId/cards/:cardId/edit` — Edit an existing card
 * - `*` — 404 fallback
 */

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './components/AuthContext.tsx'
import { supabaseProvider } from './providers/SupabaseProvider'
import DashboardPage from './pages/DashboardPage'
import DeckFormPage from './pages/DeckFormPage'
import DeckDetailPage from './pages/DeckDetailPage'
import CardFormPage from './pages/CardFormPage'
import ImportPage from './pages/ImportPage'
import StudySessionPage from './pages/StudySessionPage'
import SettingsPage from './pages/SettingsPage'
import AccountPage from './pages/AccountPage'
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from './pages/AboutPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'

function App() {
  return (
    <AuthProvider provider={supabaseProvider}>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/decks/new" element={<DeckFormPage />} />
          <Route path="/decks/:deckId" element={<DeckDetailPage />} />
          <Route path="/decks/:deckId/edit" element={<DeckFormPage />} />
          <Route path="/decks/:deckId/study" element={<StudySessionPage />} />
          <Route path="/decks/:deckId/import" element={<ImportPage />} />
          <Route path="/decks/:deckId/cards/new" element={<CardFormPage />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<CardFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
