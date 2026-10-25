import { Link } from 'react-router-dom'
import InformationPage from '../components/InformationPage'

function TermsOfServicePage() {
  return (
    <InformationPage
      eyebrow="A fair agreement for using CardOn"
      title="Terms of Service"
      introduction="These terms set out the rules for using CardOn and explain the responsibilities that come with creating, importing, and synchronizing study material."
      documentTitle="Terms of Service | CardOn"
    >
      <p className="information-date">Effective date: 19 September 2026</p>

      <section>
        <h2>1. Acceptance of these terms</h2>
        <p>
          By accessing or using CardOn, you agree to these Terms of Service and the{' '}
          <Link to="/privacy">Privacy Policy</Link>. If you do not agree, do not use the service.
        </p>
      </section>

      <section>
        <h2>2. What CardOn provides</h2>
        <p>
          CardOn is a flashcard application that lets you create decks, bulk import structured
          questions and answers, schedule reviews, study due cards, create backups, and optionally
          synchronize data after signing in. Features may be improved, changed, or discontinued as
          the service develops.
        </p>
      </section>

      <section>
        <h2>3. Accounts and sign-in</h2>
        <p>
          The core local features do not require an account. Google sign-in is required only for
          account-based features such as cloud sync. You are responsible for maintaining the
          security of your Google account and for activity performed through your authenticated
          session. You must provide accurate account information and must not use another person's
          account without permission.
        </p>
      </section>

      <section>
        <h2>4. Your content</h2>
        <p>
          You retain ownership of the questions, answers, notes, and other material you add to
          CardOn. You grant CardOn only the limited permission needed to store, process, display,
          back up, and synchronize that material at your direction.
        </p>
        <p>
          You are responsible for your content and must have the rights needed to use it. Do not
          upload or import content that is unlawful, infringes intellectual property or privacy
          rights, contains malicious code, or is intended to interfere with the service.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use CardOn for unlawful, deceptive, abusive, or harmful activity</li>
          <li>Attempt to access another user's account or synchronized data</li>
          <li>Probe, disrupt, overload, or bypass the security of the service</li>
          <li>Automate requests in a way that places unreasonable load on the service</li>
          <li>Misrepresent your relationship with CardOn or its service providers</li>
        </ul>
      </section>

      <section>
        <h2>6. Backups and availability</h2>
        <p>
          CardOn is local first, and browser data can be lost if browser storage is cleared, a
          device is damaged, or software behaves unexpectedly. You are responsible for exporting
          backups of important study material. Cloud sync is a convenience and is not a substitute
          for a separate backup. The service may occasionally be unavailable or contain errors.
        </p>
      </section>

      <section>
        <h2>7. Third-party services</h2>
        <p>
          CardOn relies on services provided by Google and Supabase for optional authentication and
          cloud functionality. Your use of those services may also be governed by their respective
          terms and policies. CardOn is not responsible for third-party services outside its
          control.
        </p>
      </section>

      <section>
        <h2>8. Intellectual property</h2>
        <p>
          CardOn's software, design, branding, and original service content are protected by
          applicable intellectual property laws. These terms do not transfer ownership of CardOn or
          its branding to you. You may use the service only as permitted by these terms.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer</h2>
        <p>
          CardOn is provided on an "as is" and "as available" basis to the extent permitted by law.
          CardOn does not guarantee that the service will always be available, error free, or
          suitable for a particular learning outcome. Study schedules and progress indicators are
          tools for personal learning and do not constitute educational or professional advice.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, CardOn and its operator will not be liable for
          indirect, incidental, special, consequential, or punitive loss arising from your use of
          the service, including loss of data, study material, opportunity, or anticipated results.
          Nothing in these terms excludes rights or remedies that cannot legally be excluded.
        </p>
      </section>

      <section>
        <h2>11. Suspension and termination</h2>
        <p>
          Access to account-based features may be suspended or terminated when reasonably necessary
          to protect users, comply with law, address security risks, or respond to a serious breach
          of these terms. You may stop using CardOn at any time and remove local data through
          Settings.
        </p>
      </section>

      <section>
        <h2>12. Changes to these terms</h2>
        <p>
          These terms may be updated when the service or applicable requirements change. The
          effective date at the top of this page will identify the current version. Continued use
          after an updated version is published means you accept the revised terms.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Questions about these terms can be sent to the CardOn operator using the user support
          contact displayed on the Google OAuth consent screen. You can also learn more on the{' '}
          <Link to="/about">About page</Link>.
        </p>
      </section>
    </InformationPage>
  )
}

export default TermsOfServicePage
