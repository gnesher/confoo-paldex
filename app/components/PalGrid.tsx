import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState, useEffect, useCallback } from 'react'
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
export function PalGrid({ pals, isLoading = false }: PalGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(4)
  const [containerWidth, setContainerWidth] = useState(800)

  // Calculate number of rows based on items and columns
  const rowCount = Math.ceil(pals.length / columns)

  // Gap between cards
  const gap = 20

  // Calculate card dimensions based on container
  const cardWidth = Math.floor((containerWidth - (columns - 1) * gap) / columns)
  // Card height: aspect-[4/3] image + ~80px content
  const cardHeight = Math.floor(cardWidth * 0.75) + 90

  // Setup virtualizer for rows
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cardHeight + gap,
    overscan: 3,
  })

  // Handle resize to update column count and container width
  const handleResize = useCallback(() => {
    if (parentRef.current) {
      const width = parentRef.current.clientWidth
      setContainerWidth(width)
      setColumns(calculateColumns(width))
    }
  }, [])

  // Setup resize observer
  useEffect(() => {
    const element = parentRef.current
    if (!element) return

    handleResize()

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [handleResize])

  // Recalculate virtualizer when dimensions change
  useEffect(() => {
    virtualizer.measure()
  }, [columns, containerWidth, virtualizer])

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="grid gap-5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <PalCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Empty state
  if (pals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <span className="text-6xl mb-4">🔍</span>
        <h3 className="text-xl font-semibold mb-2">No Pals found</h3>
        <p className="text-sm">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-220px)] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns
          const rowPals = pals.slice(startIndex, startIndex + columns)

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: `${gap}px`,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: `${gap}px`,
                }}
              >
                {rowPals.map((pal) => (
                  <PalCard key={pal.id} pal={pal} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Grid stats display for debugging/demo purposes
 */
export function PalGridStats({
  total,
  visible,
}: {
  total: number
  visible: number
}) {
  return (
    <div className="text-xs text-gray-400 mb-2">
      Showing {visible} of {total} Pals (virtualized)
    </div>
  )
}
