import { Link } from '@tanstack/react-router'
import type { Pal } from '~/schemas/pal'
import { TypeBadge } from './TypeBadge'
import { PalImage } from './PalImage'

interface PalCardProps {
  pal: Pal
}

/**
 * Individual Pal card for the grid
 * Displays image, name, types, and basic stats
 */
export function PalCard({ pal }: PalCardProps) {
  return (
    <Link
      to="/pals/$palId"
      params={{ palId: pal.id }}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5"
    >
      {/* Image section - smaller aspect ratio */}
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3">
        <PalImage src={pal.imageUrl} alt={pal.name} palId={pal.id} />
      </div>

      {/* Content section */}
      <div className="p-3">
        {/* ID and Name */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 py-0.5 rounded">
            #{pal.id}
          </span>
          <h3 className="font-semibold text-gray-900 truncate text-sm">{pal.name}</h3>
        </div>

        {/* Types */}
        <div className="flex flex-wrap gap-1 mb-2">
          {pal.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>

        {/* Stats preview */}
        <div className="flex justify-between text-xs text-gray-500 border-t border-gray-50 pt-2">
          <div className="flex items-center gap-0.5">
            <span>❤️</span>
            <span className="font-medium">{pal.stats.hp}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span>⚔️</span>
            <span className="font-medium">{pal.stats.attack}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span>🛡️</span>
            <span className="font-medium">{pal.stats.defense}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/**
 * Skeleton loading state for PalCard
 */
export function PalCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-8 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded flex-1" />
        </div>
        <div className="flex gap-1 mb-2">
          <div className="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-50">
          <div className="h-3 w-10 bg-gray-100 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
