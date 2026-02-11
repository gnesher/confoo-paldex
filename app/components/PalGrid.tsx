import { createSignal, onMount, onCleanup, createEffect, Show, For } from 'solid-js'
import { createVirtualizer } from '@tanstack/solid-virtual'
import type { Pal } from '~/schemas/pal'
import { PalCard, PalCardSkeleton } from './PalCard'

interface PalGridProps {
  pals: Pal[]
  isLoading?: boolean
}

/**
 * Calculate number of columns based on container width
 * Responsive: 2 cols on mobile, 3 on tablet, 4-5 on desktop
 */
function calculateColumns(width: number): number {
  if (width < 640) return 2   // sm
  if (width < 1024) return 3  // md/lg
  if (width < 1280) return 4  // lg
  return 5                     // xl+
}

/**
 * Virtualized grid of Pal cards
 * Uses TanStack Virtual for performance with 100+ items
 */
export function PalGrid(props: PalGridProps) {
  let parentRef: HTMLDivElement | undefined
  const [columns, setColumns] = createSignal(4)
  const [containerWidth, setContainerWidth] = createSignal(800)

  // Gap between cards
  const gap = 20

  // Calculate card dimensions based on container
  const cardWidth = () => Math.floor((containerWidth() - (columns() - 1) * gap) / columns())
  // Card height: aspect-[4/3] image + ~80px content
  const cardHeight = () => Math.floor(cardWidth() * 0.75) + 90

  // Calculate number of rows based on items and columns
  const rowCount = () => Math.ceil(props.pals.length / columns())

  // Setup virtualizer for rows
  const virtualizer = createVirtualizer({
    get count() { return rowCount() },
    getScrollElement: () => parentRef ?? null,
    estimateSize: () => cardHeight() + gap,
    overscan: 3,
  })

  // Handle resize to update column count and container width
  const handleResize = () => {
    if (parentRef) {
      const width = parentRef.clientWidth
      setContainerWidth(width)
      setColumns(calculateColumns(width))
    }
  }

  // Setup resize observer
  onMount(() => {
    if (!parentRef) return

    handleResize()

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    resizeObserver.observe(parentRef)

    onCleanup(() => {
      resizeObserver.disconnect()
    })
  })

  // Recalculate virtualizer when dimensions change
  createEffect(() => {
    // Access reactive values to track them
    columns()
    containerWidth()
    virtualizer.measure()
  })

  return (
    <Show
      when={!props.isLoading}
      fallback={
        <div
          class="grid gap-5"
          style={{ "grid-template-columns": `repeat(${columns()}, minmax(0, 1fr))` }}
        >
          <For each={Array.from({ length: 12 })}>
            {() => <PalCardSkeleton />}
          </For>
        </div>
      }
    >
      <Show
        when={props.pals.length > 0}
        fallback={
          <div class="flex flex-col items-center justify-center py-16 text-gray-500">
            <span class="text-6xl mb-4">🔍</span>
            <h3 class="text-xl font-semibold mb-2">No Pals found</h3>
            <p class="text-sm">Try adjusting your search filters</p>
          </div>
        }
      >
        <div
          ref={parentRef}
          class="h-[calc(100vh-220px)] overflow-auto"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            <For each={virtualizer.getVirtualItems()}>
              {(virtualRow) => {
                const startIndex = () => virtualRow.index * columns()
                const rowPals = () => props.pals.slice(startIndex(), startIndex() + columns())

                return (
                  <div
                    data-index={virtualRow.index}
                    ref={(el) => queueMicrotask(() => virtualizer.measureElement(el))}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      "padding-bottom": `${gap}px`,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        "grid-template-columns": `repeat(${columns()}, minmax(0, 1fr))`,
                        gap: `${gap}px`,
                      }}
                    >
                      <For each={rowPals()}>
                        {(pal) => <PalCard pal={pal} />}
                      </For>
                    </div>
                  </div>
                )
              }}
            </For>
          </div>
        </div>
      </Show>
    </Show>
  )
}

/**
 * Grid stats display for debugging/demo purposes
 */
export function PalGridStats(props: {
  total: number
  visible: number
}) {
  return (
    <div class="text-xs text-gray-400 mb-2">
      Showing {props.visible} of {props.total} Pals (virtualized)
    </div>
  )
}
