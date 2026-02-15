import { createSignal, createEffect, onCleanup, For, Show } from 'solid-js'
import { createDebouncer } from '@tanstack/solid-pacer'
import { useNavigate } from '@tanstack/solid-router'
import type { PalType } from '~/schemas/pal'
import { MAX_ATTACK_STAT } from '~/schemas/pal'
import { hasActiveFilters, type SearchParams } from '~/schemas/search'

const PAL_TYPES: PalType[] = [
  'Neutral', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Ground', 'Dark', 'Dragon',
]

interface FilterSidebarProps {
  initialValues: SearchParams
}

/**
 * Merge a partial update into the current filter values, converting each
 * field into its URL-friendly representation (undefined = omit from URL).
 */
function buildSearchUpdate(
  updates: Partial<SearchParams>,
  current: SearchParams,
) {
  const q = updates.q !== undefined ? updates.q : current.q
  const types = updates.types !== undefined ? updates.types : current.types
  const atkMin = updates.atkMin !== undefined ? updates.atkMin : current.atkMin
  const atkMax = updates.atkMax !== undefined ? updates.atkMax : current.atkMax

  return {
    q: q || undefined,
    types: types?.length ? types.join(',') : undefined,
    atkMin: atkMin && atkMin > 0 ? atkMin : undefined,
    atkMax: atkMax !== undefined && atkMax < MAX_ATTACK_STAT ? atkMax : undefined,
  }
}

export function FilterSidebar(props: FilterSidebarProps) {
  const navigate = useNavigate()

  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      to: '/',
      search: buildSearchUpdate(updates, props.initialValues),
    })
  }

  const searchDebouncer = createDebouncer(
    (q: string) => updateSearch({ q }),
    { wait: 300 },
  )

  const attackDebouncer = createDebouncer(
    (min: number, max: number) => updateSearch({ atkMin: min, atkMax: max }),
    { wait: 300 },
  )

  return (
    <aside class="w-64 flex-shrink-0 bg-white shadow-lg p-4 hidden md:block">
      <h2 class="text-lg font-semibold mb-4">Filters</h2>

      <div class="space-y-6">
        <SearchInput
          defaultValue={props.initialValues.q ?? ''}
          onChange={(q) => searchDebouncer.maybeExecute(q)}
        />

        <TypeMultiSelect
          selected={props.initialValues.types ?? []}
          onChange={(types) => updateSearch({ types })}
        />

        <AttackRangeSlider
          min={props.initialValues.atkMin ?? 0}
          max={props.initialValues.atkMax ?? MAX_ATTACK_STAT}
          onChange={(min, max) => attackDebouncer.maybeExecute(min, max)}
        />

        <ClearFiltersButton hasFilters={hasActiveFilters(props.initialValues)} />
      </div>
    </aside>
  )
}

function SearchInput(props: {
  defaultValue: string
  onChange: (value: string) => void
}) {
  const [value, setValue] = createSignal(props.defaultValue)

  createEffect(() => {
    setValue(props.defaultValue)
  })

  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Search
      </label>
      <input
        type="text"
        value={value()}
        onInput={(e) => {
          setValue(e.currentTarget.value)
          props.onChange(e.currentTarget.value)
        }}
        placeholder="Search Pals by name..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

function TypeMultiSelect(props: {
  selected: string[]
  onChange: (types: string[]) => void
}) {
  const [isOpen, setIsOpen] = createSignal(false)
  let containerRef: HTMLDivElement | undefined

  createEffect(() => {
    if (!isOpen()) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef && !containerRef.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside))
  })

  const toggleType = (type: string) => {
    if (props.selected.includes(type)) {
      props.onChange(props.selected.filter((t) => t !== type))
    } else {
      props.onChange([...props.selected, type])
    }
  }

  return (
    <div class="relative" ref={containerRef}>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Types
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <Show
          when={props.selected.length > 0}
          fallback={<span class="text-gray-400">Select types...</span>}
        >
          <span>{props.selected.length} type(s) selected</span>
        </Show>
        <span class="float-right">{isOpen() ? '▲' : '▼'}</span>
      </button>

      <Show when={isOpen()}>
        <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <For each={PAL_TYPES}>
            {(type) => (
              <label
                class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={props.selected.includes(type)}
                  onChange={() => toggleType(type)}
                  class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm">{type}</span>
              </label>
            )}
          </For>
        </div>
      </Show>

      <Show when={props.selected.length > 0}>
        <div class="flex flex-wrap gap-1 mt-2">
          <For each={props.selected}>
            {(type) => (
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {type}
                <button
                  type="button"
                  onClick={() => toggleType(type)}
                  class="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

function AttackRangeSlider(props: {
  min: number
  max: number
  onChange: (min: number, max: number) => void
}) {
  const [minValue, setMinValue] = createSignal(props.min)
  const [maxValue, setMaxValue] = createSignal(props.max)

  createEffect(() => {
    setMinValue(props.min)
    setMaxValue(props.max)
  })

  const handleMinChange = (e: Event) => {
    const val = Number((e.currentTarget as HTMLInputElement).value)
    if (val <= maxValue()) {
      setMinValue(val)
      props.onChange(val, maxValue())
    }
  }

  const handleMaxChange = (e: Event) => {
    const val = Number((e.currentTarget as HTMLInputElement).value)
    if (val >= minValue()) {
      setMaxValue(val)
      props.onChange(minValue(), val)
    }
  }

  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Attack Range
      </label>
      <div class="flex justify-between text-xs text-gray-500 mb-2">
        <span>{minValue()}</span>
        <span>{maxValue()}</span>
      </div>
      
      <div class="relative h-2">
        <div class="absolute w-full h-2 bg-gray-200 rounded-full" />
        <div
          class="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${(minValue() / MAX_ATTACK_STAT) * 100}%`,
            width: `${((maxValue() - minValue()) / MAX_ATTACK_STAT) * 100}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={MAX_ATTACK_STAT}
          step={5}
          value={minValue()}
          onInput={handleMinChange}
          class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={0}
          max={MAX_ATTACK_STAT}
          step={5}
          value={maxValue()}
          onInput={handleMaxChange}
          class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>{MAX_ATTACK_STAT}</span>
      </div>
    </div>
  )
}

function ClearFiltersButton(props: { hasFilters: boolean }) {
  const navigate = useNavigate()

  return (
    <Show when={props.hasFilters}>
      <button
        type="button"
        onClick={() => navigate({ to: '/', search: {} })}
        class="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear all filters
      </button>
    </Show>
  )
}
