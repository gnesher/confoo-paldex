import type { PalType } from '~/schemas/pal'
import { PAL_TYPE_COLORS } from '~/schemas/pal'

interface TypeBadgeProps {
  type: PalType
  size?: 'sm' | 'md'
}

/**
 * Shared type badge component for displaying Pal element types.
 * Used in PalCard (sm) and detail page (md).
 */
export function TypeBadge(props: TypeBadgeProps) {
  const size = () => props.size ?? 'sm'
  const colorClass = () => PAL_TYPE_COLORS[props.type]
  const sizeClasses = () => size() === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <span class={`${sizeClasses()} rounded-full font-medium text-white ${colorClass()}`}>
      {props.type}
    </span>
  )
}
