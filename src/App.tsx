/**
 * @module App
 * @description Root application component.
 * Defines all routes using React Router v6 and wraps them in the shared Layout.
 *
 * Route structure:
 * - `/` — Dashboard (deck list)
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
import DashboardPage from './pages/DashboardPage'
import DeckFormPage from './pages/DeckFormPage'
import DeckDetailPage from './pages/DeckDetailPage'
import CardFormPage from './pages/CardFormPage'
import ImportPage from './pages/ImportPage'
import StudySessionPage from './pages/StudySessionPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
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
  )
}

export default App
