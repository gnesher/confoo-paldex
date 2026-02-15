import { useState } from 'react'

interface PalImageProps {
  src: string
  alt: string
  palId: string
  className?: string
  fallbackIconSize?: 'sm' | 'md' | 'lg'
}

export function PalImage({
  src,
  alt,
  palId,
  className = 'w-full h-full object-contain',
  fallbackIconSize = 'md',
}: PalImageProps) {
  const [hasError, setHasError] = useState(false)

  const iconSizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-8xl',
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 w-full h-full">
        <span className={iconSizeClasses[fallbackIconSize]}>🎮</span>
        <span className="text-xs mt-1 font-mono">#{palId}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}
