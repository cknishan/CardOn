import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-6xl mb-5">{icon}</div>
      <h2 className="text-lg font-semibold text-dark mb-2">{title}</h2>
      <p className="text-sm text-muted mb-6">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
