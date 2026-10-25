import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface InformationPageProps {
  eyebrow: string
  title: string
  introduction: string
  documentTitle: string
  children: ReactNode
}

function InformationPage({
  eyebrow,
  title,
  introduction,
  documentTitle,
  children,
}: InformationPageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <title>{documentTitle}</title>
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-dark"
        >
          <span aria-hidden="true">←</span>
          Back to CardOn
        </Link>

        <header className="surface-card border-primary/15 p-6 shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-dark sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{introduction}</p>
        </header>

        <article className="information-content mt-6">{children}</article>
      </div>
    </div>
  )
}

export default InformationPage
