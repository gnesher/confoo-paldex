import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface LinkButtonProps {
  to: string
  search?: Record<string, unknown>
  children: ReactNode
  className?: string
}

export function LinkButton({
  to,
  search,
  children,
  className = '',
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      search={search}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </Link>
  )
}
