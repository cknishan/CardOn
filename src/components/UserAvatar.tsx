import type { CloudUser } from '../providers/CloudProvider'

interface UserAvatarProps {
  user: CloudUser | null
  size?: 'sm' | 'md'
}

function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-12 w-12 text-base'
  const iconSizeClass = size === 'sm' ? 'h-5 w-5' : 'h-8 w-8'

  if (!user) {
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded-full bg-border/50 text-muted`}
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={iconSizeClass}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    )
  }

  const initials =
    user.email
      .split('@')[0]
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || '?'

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-primary font-semibold text-white`}
      title={user.email}
    >
      {initials}
    </div>
  )
}

export default UserAvatar
