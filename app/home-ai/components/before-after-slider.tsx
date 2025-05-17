"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(position)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <div className="relative w-full h-full aspect-video overflow-hidden rounded-lg" ref={sliderRef}>
      <Image
        src={beforeImage || "/placeholder.svg"}
        alt="Before"
        fill
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <Image
        src={afterImage || "/placeholder.svg"}
        alt="After"
        fill
        className="object-cover"
        style={{ opacity: 0.8 }}
      />

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-black dark:bg-white transition-all"
        style={{ left: `${sliderPosition}%` }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 shadow-md cursor-grab active:cursor-grabbing z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      />

      <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md z-10">
        {beforeLabel}
      </div>
      <div className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md z-10">
        {afterLabel}
      </div>
    </div>
  )
}
