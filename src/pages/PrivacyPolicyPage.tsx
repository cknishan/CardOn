import { Link } from 'react-router-dom'
import InformationPage from '../components/InformationPage'

function PrivacyPolicyPage() {
  return (
    <InformationPage
      eyebrow="Your data, explained clearly"
      title="Privacy Policy"
      introduction="CardOn is designed to work locally first. This policy explains what information the app handles, why it is used, and the choices available to you."
      documentTitle="Privacy Policy | CardOn"
    >
      <p className="information-date">Effective date: 25 September 2026</p>

      <section>
        <h2>1. Overview</h2>
        <p>
          CardOn helps you create, import, organise, and study flashcards. Most app data is stored
          in your browser. You can use the core deck, card, import, study, and backup features
          without signing in.
        </p>
      </section>

      <section>
        <h2>2. Information stored on your device</h2>
        <p>CardOn stores the following information in your browser using IndexedDB:</p>
        <ul>
          <li>Deck names and descriptions</li>
          <li>Flashcard questions, answers, hints, and notes</li>
          <li>Review scheduling information, including due dates and repetition progress</li>
          <li>Study-session records when available</li>
        </ul>
        <p>
          CardOn also stores the date and time of your most recent manual sync in local browser
          storage. This information remains on your device unless you clear it, restore a backup,
          delete the browser storage, or remove it through CardOn's settings.
        </p>
      </section>

      <section>
        <h2>3. Google sign-in information</h2>
        <p>
          Google sign-in is optional. When you choose to sign in, CardOn uses Google OAuth through
          Supabase Authentication. CardOn receives the identifier and email address associated with
          your authenticated account. This information is used only to sign you in, show your
          account state, and associate manually synchronized data with your account.
        </p>
        <p>
          CardOn does not request access to your Google Drive, Gmail, contacts, calendar, or Google
          account password. CardOn does not use Google user data for advertising, profiling, or the
          training of artificial intelligence models.
        </p>
        <p>
          CardOn's use and transfer of information received from Google APIs follows the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including its Limited Use requirements.
        </p>
      </section>

      <section>
        <h2>4. Optional cloud sync</h2>
        <p>
          If you sign in and select Sync Now, CardOn uploads your decks, flashcards, scheduling
          information, and available study-session records to Supabase. CardOn then downloads the
          records associated with your account and merges newer records into your local database.
          Sync is initiated by you and does not run continuously in the background.
        </p>
        <p>
          Supabase processes authentication and synchronized app data on CardOn's behalf. Google
          processes the information needed to complete Google sign-in. Each provider handles data
          under its own terms and privacy practices.
        </p>
      </section>

      <section>
        <h2>5. Technical and hosting information</h2>
        <p>
          CardOn's hosting and service providers may automatically process standard technical
          information, such as your IP address, browser type, request time, and requested page, to
          deliver the app, prevent abuse, and maintain security. CardOn does not include advertising
          trackers or a product analytics service in the application.
        </p>
      </section>

      <section>
        <h2>6. How information is used</h2>
        <p>Information handled by CardOn is used to:</p>
        <ul>
          <li>Provide deck, card, import, backup, and study features</li>
          <li>Calculate review schedules and display learning progress</li>
          <li>Authenticate you when you choose Google sign-in</li>
          <li>Provide manual synchronization across your devices</li>
          <li>Maintain the security and reliability of the service</li>
        </ul>
      </section>

      <section>
        <h2>7. Sharing and sale of information</h2>
        <p>
          CardOn does not sell your personal information. CardOn does not share your information
          with advertisers or data brokers. Information is disclosed to Google and Supabase only as
          needed to provide authentication and optional cloud sync, or when disclosure is required
          by law.
        </p>
      </section>

      <section>
        <h2>8. Your choices and data control</h2>
        <ul>
          <li>You can use CardOn without Google sign-in.</li>
          <li>You choose when to start a cloud sync.</li>
          <li>You can export your local data as a JSON backup.</li>
          <li>You can delete individual decks and cards or clear all local data in Settings.</li>
          <li>
            When signed in, you can permanently delete your CardOn account and synchronized data
            from Settings.
          </li>
          <li>
            Signing out ends your authenticated session but does not delete synchronized data.
          </li>
        </ul>
        <p>
          Deleting your account removes the live authentication account and associated synchronized
          CardOn records. For other privacy requests, contact the CardOn operator using the user
          support contact displayed on the Google OAuth consent screen.
        </p>
      </section>

      <section>
        <h2>9. Data retention and security</h2>
        <p>
          Local data remains in your browser until you remove it. Synchronized data is retained for
          as long as needed to provide sync or until it is deleted following a valid request. CardOn
          uses browser security controls, authenticated access, and Supabase row-level security to
          restrict cloud records to the signed-in account. No online service can guarantee absolute
          security, so you should keep an exported backup of important study material.
        </p>
      </section>

      <section>
        <h2>10. Children's privacy</h2>
        <p>
          CardOn is not directed to children under 13, and the service does not knowingly collect
          personal information from children under 13. If you believe a child has provided personal
          information, contact the CardOn operator so the matter can be reviewed.
        </p>
      </section>

      <section>
        <h2>11. Changes to this policy</h2>
        <p>
          This policy may be updated when CardOn's features or data practices change. The effective
          date at the top of this page will be revised when an update is published.
        </p>
      </section>

      <section>
        <h2>12. Related information</h2>
        <p>
          Please also read CardOn's <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/about">About page</Link>.
        </p>
      </section>
    </InformationPage>
  )
}

export default PrivacyPolicyPage
