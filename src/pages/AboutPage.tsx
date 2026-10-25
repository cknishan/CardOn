import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    title: 'Import in batches',
    description:
      'Paste a structured list or upload a text file, preview every card, and import the valid questions together.',
  },
  {
    number: '02',
    title: 'Study with purpose',
    description:
      'Review what is due and rate each answer so CardOn can schedule the next useful repetition.',
  },
  {
    number: '03',
    title: 'Stay in control',
    description:
      'Keep data in your browser, export a portable backup, or choose manual cloud sync after signing in.',
  },
]

function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <title>About | CardOn</title>
      <meta
        name="description"
        content="Learn how CardOn makes flashcard creation faster through simple bulk import and local-first study tools."
      />

      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-dark"
        >
          <span aria-hidden="true">←</span>
          Back to CardOn
        </Link>

        <section className="surface-card overflow-hidden border-primary/15 shadow-sm">
          <div className="grid md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 sm:p-10 md:p-12">
              <img
                src="/logo.png"
                alt="CardOn"
                className="mb-5 h-16 w-16 object-contain sm:h-20 sm:w-20"
              />
              <h1 className="text-3xl font-bold leading-tight text-dark sm:text-5xl">
                Flashcards should save study time, not consume it.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                CardOn is built for learners who already have questions in notes, documents, or
                generated study material. Its simple bulk import turns that content into a clean
                study deck without repetitive form filling.
              </p>
              <Link to="/" className="button-base button-highlight mt-7">
                Open your decks
              </Link>
            </div>

            <div className="bg-dark p-7 text-white sm:p-10 md:flex md:flex-col md:justify-center">
              <p className="font-display text-xl font-semibold">A small format with a big payoff</p>
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-5 font-mono text-sm leading-7">
                <p>
                  <span className="text-[#8bbdff]">Q:</span> What should I remember?
                </p>
                <p>
                  <span className="text-[#8bbdff]">A:</span> The essential answer.
                </p>
                <p>
                  <span className="text-[#8bbdff]">Hint:</span> Optional context.
                </p>
                <p>
                  <span className="text-[#8bbdff]">Note:</span> Extra detail.
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Repeat the pattern for as many cards as you need, then review them together before
                importing.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="font-bold uppercase tracking-[0.16em] text-primary">
              The CardOn approach
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="surface-card p-6 shadow-sm">
                <p className="font-display text-sm font-bold text-primary">{feature.number}</p>
                <h3 className="mt-5 text-xl font-bold text-dark">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-primary px-7 py-9 text-white sm:px-10 sm:py-12">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Local first, cloud when you choose</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
                Your decks work from browser storage without an account. Google sign-in is optional
                and supports manual cloud sync when you want access across devices.
              </p>
            </div>
            <Link to="/privacy" className="button-base bg-white text-primary hover:bg-white/90">
              Read our Privacy Policy
            </Link>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold">
          <Link to="/" className="text-muted hover:text-dark">
            Home
          </Link>
          <Link to="/privacy" className="text-muted hover:text-dark">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-muted hover:text-dark">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
