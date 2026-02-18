import { Link } from '@tanstack/solid-router'
import type { JSX } from 'solid-js'

interface LinkButtonProps {
  to: string
  search?: Record<string, unknown>
  children: JSX.Element
  class?: string
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <Link
      to={props.to}
      search={props.search}
      class={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors ${props.class ?? ''}`}
    >
      {props.children}
    </Link>
  )
}
