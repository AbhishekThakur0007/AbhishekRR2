"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PropertyImageGalleryProps {
  images: string[]
  address: string
}

export function PropertyImageGallery({ images, address }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
    if (e.key === "Escape") setIsOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 cursor-pointer">
        <div
          className="relative col-span-2 row-span-2 aspect-square sm:aspect-auto sm:h-full rounded-lg overflow-hidden"
          onClick={() => {
            setCurrentIndex(0)
            setIsOpen(true)
          }}
        >
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={`${address} - Main Image`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden"
            onClick={() => {
              setCurrentIndex(index + 1)
              setIsOpen(true)
            }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${address} - Image ${index + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-medium">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[90vw] h-[90vh] p-0 bg-black/90" onKeyDown={handleKeyDown}>
          <div className="relative h-full w-full flex flex-col">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-4">
              <div className="absolute left-4 z-10">
                <Button variant="ghost" size="icon" onClick={prevImage} className="text-white hover:bg-white/20">
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </div>

              <div className="relative h-full w-full flex items-center justify-center">
                <Image
                  src={images[currentIndex] || "/placeholder.svg"}
                  alt={`${address} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="absolute right-4 z-10">
                <Button variant="ghost" size="icon" onClick={nextImage} className="text-white hover:bg-white/20">
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-black/80">
              <div className="flex justify-center gap-2 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative h-16 w-24 rounded-md overflow-hidden cursor-pointer border-2",
                      currentIndex === index ? "border-primary" : "border-transparent",
                    )}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${address} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-white text-center mt-2">{address}</p>
              <p className="text-white/70 text-center text-sm">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
