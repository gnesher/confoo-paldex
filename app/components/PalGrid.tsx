import { createSignal, onMount, onCleanup, createEffect, Show, For } from 'solid-js'
import { createVirtualizer } from '@tanstack/solid-virtual'
import type { Pal } from '~/schemas/pal'
import { PalCard, PalCardSkeleton } from './PalCard'
import { EmptyState } from './EmptyState'

interface PalGridProps {
  pals: Pal[]
  isLoading?: boolean
}

function calculateColumns(width: number): number {
  if (width < 640) return 2
  if (width < 1024) return 3
  if (width < 1280) return 4
  return 5
}

export function PalGrid(props: PalGridProps) {
  let parentRef: HTMLDivElement | undefined
  const [columns, setColumns] = createSignal(4)
  const [containerWidth, setContainerWidth] = createSignal(800)

  const gap = 20
  const cardWidth = () => Math.floor((containerWidth() - (columns() - 1) * gap) / columns())
  // aspect-[4/3] image + ~90px content
  const cardHeight = () => Math.floor(cardWidth() * 0.75) + 90
  const rowCount = () => Math.ceil(props.pals.length / columns())

  const virtualizer = createVirtualizer({
    get count() { return rowCount() },
    getScrollElement: () => parentRef ?? null,
    estimateSize: () => cardHeight() + gap,
    overscan: 3,
  })

  const handleResize = () => {
    if (parentRef) {
      const width = parentRef.clientWidth
      setContainerWidth(width)
      setColumns(calculateColumns(width))
    }
  }

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

  createEffect(() => {
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
        fallback={<EmptyState showClearButton={false} />}
      >
        <div
          ref={parentRef}
          class="flex-1 min-h-0 overflow-auto"
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
