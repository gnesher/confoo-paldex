import { createSignal, createEffect, onCleanup, For, Show } from 'solid-js'
import { createDebouncer } from '@tanstack/solid-pacer'
import { useNavigate } from '@tanstack/solid-router'
import type { PalType } from '~/schemas/pal'

// All available Pal types for the multi-select
const PAL_TYPES: PalType[] = [
  'Neutral', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Ground', 'Dark', 'Dragon'
]

interface SearchParams {
  q?: string
  types?: string[]
  atkMin?: number
  atkMax?: number
}

interface FilterSidebarProps {
  initialValues: SearchParams
}

/**
 * FilterSidebar component with debounced search, type multi-select, and attack range slider.
 * Filter changes update URL search params via TanStack Router navigation.
 */
export function FilterSidebar(props: FilterSidebarProps) {
  const navigate = useNavigate()

  // Update URL with new search params
  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      to: '/',
      search: {
        q: updates.q !== undefined ? (updates.q || undefined) : props.initialValues.q,
        types: updates.types !== undefined 
          ? (updates.types?.length ? updates.types.join(',') : undefined)
          : (props.initialValues.types?.length ? props.initialValues.types.join(',') : undefined),
        atkMin: updates.atkMin !== undefined
          ? (updates.atkMin > 0 ? updates.atkMin : undefined)
          : props.initialValues.atkMin,
        atkMax: updates.atkMax !== undefined
          ? (updates.atkMax < 200 ? updates.atkMax : undefined)
          : props.initialValues.atkMax,
      },
    })
  }

  // Debounced search for text input
  const searchDebouncer = createDebouncer(
    (q: string) => updateSearch({ q }),
    { wait: 300 }
  )

  // Debounced attack range update
  const attackDebouncer = createDebouncer(
    (min: number, max: number) => updateSearch({ atkMin: min, atkMax: max }),
    { wait: 300 }
  )

  return (
    <aside class="w-64 flex-shrink-0 bg-white shadow-lg p-4 hidden md:block">
      <h2 class="text-lg font-semibold mb-4">Filters</h2>

      <div class="space-y-6">
        {/* Search Input with debounce */}
        <SearchInput
          defaultValue={props.initialValues.q ?? ''}
          onChange={(q) => searchDebouncer.maybeExecute(q)}
        />

        {/* Type Multi-Select */}
        <TypeMultiSelect
          selected={props.initialValues.types ?? []}
          onChange={(types) => updateSearch({ types })}
        />

        {/* Attack Range Slider */}
        <AttackRangeSlider
          min={props.initialValues.atkMin ?? 0}
          max={props.initialValues.atkMax ?? 200}
          onChange={(min, max) => attackDebouncer.maybeExecute(min, max)}
        />

        {/* Clear Filters Button */}
        <ClearFiltersButton
          hasFilters={
            !!(props.initialValues.q || props.initialValues.types?.length || props.initialValues.atkMin || (props.initialValues.atkMax !== undefined && props.initialValues.atkMax < 200))
          }
        />
      </div>
    </aside>
  )
}

/**
 * Search input with local state and debounced onChange.
 */
function SearchInput(props: {
  defaultValue: string
  onChange: (value: string) => void
}) {
  const [value, setValue] = createSignal(props.defaultValue)

  // Sync with URL changes
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

/**
 * Multi-select dropdown for Pal types with click-outside-to-close behaviour.
 */
function TypeMultiSelect(props: {
  selected: string[]
  onChange: (types: string[]) => void
}) {
  const [isOpen, setIsOpen] = createSignal(false)
  let containerRef: HTMLDivElement | undefined

  // Close dropdown when clicking outside
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

      {/* Selected types badges */}
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

/**
 * Attack range slider with debounced onChange (debounce applied by parent).
 */
function AttackRangeSlider(props: {
  min: number
  max: number
  onChange: (min: number, max: number) => void
}) {
  const [minValue, setMinValue] = createSignal(props.min)
  const [maxValue, setMaxValue] = createSignal(props.max)

  // Sync with URL changes
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
      
      {/* Dual range slider using two overlapping inputs */}
      <div class="relative h-2">
        <div class="absolute w-full h-2 bg-gray-200 rounded-full" />
        <div
          class="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${(minValue() / 200) * 100}%`,
            width: `${((maxValue() - minValue()) / 200) * 100}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={minValue()}
          onInput={handleMinChange}
          class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={maxValue()}
          onInput={handleMaxChange}
          class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
      
      <div class="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>200</span>
      </div>
    </div>
  )
}

/**
 * Clear all filters button
 */
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
