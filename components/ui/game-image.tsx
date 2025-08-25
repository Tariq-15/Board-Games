"use client"

import Image from "next/image"
import { useState } from "react"

interface GameImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}

export function GameImage({ src, alt, width, height, className, fill }: GameImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${src}`)
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`)
    setImageError(true)
    setIsLoading(false)
  }

  // Use placeholder if image fails to load
  const imageSrc = imageError
    ? `/placeholder.svg?height=${height || 300}&width=${width || 400}&text=${encodeURIComponent(alt)}`
    : src

  // Debug logging
  console.log(`GameImage: Loading image for ${alt}:`, src)
  console.log(`GameImage: Final imageSrc:`, imageSrc)
  console.log(`GameImage: isLoading:`, isLoading, `imageError:`, imageError)

  if (fill) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {isLoading && !imageError && <div className="absolute inset-0 bg-muted animate-pulse rounded" />}
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && !imageError && <div className="absolute inset-0 bg-muted animate-pulse rounded" />}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
