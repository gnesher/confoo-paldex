import { For } from 'solid-js'
import { Link } from '@tanstack/solid-router'
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
export function PalCard(props: PalCardProps) {
  return (
    <Link
      to="/pals/$palId"
      params={{ palId: props.pal.id }}
      class="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5"
    >
      {/* Image section - smaller aspect ratio */}
      <div class="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3">
        <PalImage src={props.pal.imageUrl} alt={props.pal.name} palId={props.pal.id} />
      </div>

      {/* Content section */}
      <div class="p-3">
        {/* ID and Name */}
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 py-0.5 rounded">
            #{props.pal.id}
          </span>
          <h3 class="font-semibold text-gray-900 truncate text-sm">{props.pal.name}</h3>
        </div>

        {/* Types */}
        <div class="flex flex-wrap gap-1 mb-2">
          <For each={props.pal.types}>
            {(type) => <TypeBadge type={type} />}
          </For>
        </div>

        {/* Stats preview */}
        <div class="flex justify-between text-xs text-gray-500 border-t border-gray-50 pt-2">
          <div class="flex items-center gap-0.5">
            <span>❤️</span>
            <span class="font-medium">{props.pal.stats.hp}</span>
          </div>
          <div class="flex items-center gap-0.5">
            <span>⚔️</span>
            <span class="font-medium">{props.pal.stats.attack}</span>
          </div>
          <div class="flex items-center gap-0.5">
            <span>🛡️</span>
            <span class="font-medium">{props.pal.stats.defense}</span>
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
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div class="aspect-[4/3] bg-gray-100" />
      <div class="p-3">
        <div class="flex items-center gap-2 mb-2">
          <div class="h-4 w-8 bg-gray-100 rounded" />
          <div class="h-4 bg-gray-100 rounded flex-1" />
        </div>
        <div class="flex gap-1 mb-2">
          <div class="h-5 w-14 bg-gray-100 rounded-full" />
        </div>
        <div class="flex justify-between pt-2 border-t border-gray-50">
          <div class="h-3 w-10 bg-gray-100 rounded" />
          <div class="h-3 w-10 bg-gray-100 rounded" />
          <div class="h-3 w-10 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
