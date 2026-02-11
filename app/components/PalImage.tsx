import { createSignal, Show } from 'solid-js'

interface PalImageProps {
  src: string
  alt: string
  palId: string
  class?: string
  fallbackIconSize?: 'sm' | 'md' | 'lg'
}

/**
 * Pal image with graceful fallback on error.
 * Uses Solid signals for error state.
 */
export function PalImage(props: PalImageProps) {
  const [hasError, setHasError] = createSignal(false)

  const iconSizeClasses: Record<string, string> = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-8xl',
  }

  return (
    <Show
      when={!hasError()}
      fallback={
        <div class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
          <span class={iconSizeClasses[props.fallbackIconSize ?? 'md']}>🎮</span>
          <span class="text-xs mt-1 font-mono">#{props.palId}</span>
        </div>
      }
    >
      <img
        src={props.src}
        alt={props.alt}
        class={props.class ?? 'w-full h-full object-contain'}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </Show>
  )
}
