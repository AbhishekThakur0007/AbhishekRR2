"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Crown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomElementsProps {
  styleName: string
}

interface ElementItem {
  name: string
  image: string
}

export default function RoomElements({ styleName }: RoomElementsProps) {
  // Different elements based on the selected style
  const elementsByStyle: Record<string, ElementItem[]> = {
    Minimalist: [
      { name: "Floating Shelves", image: "/placeholder.svg?height=200&width=200" },
      { name: "Hidden Storage", image: "/placeholder.svg?height=200&width=200" },
      { name: "Monochrome Art", image: "/placeholder.svg?height=200&width=200" },
      { name: "Geometric Patterns", image: "/placeholder.svg?height=200&width=200" },
      { name: "Statement Lighting", image: "/placeholder.svg?height=200&width=200" },
      { name: "Natural Materials", image: "/placeholder.svg?height=200&width=200" },
    ],
    Bohemian: [
      { name: "Macramé Wall Hangings", image: "/placeholder.svg?height=200&width=200" },
      { name: "Floor Cushions", image: "/placeholder.svg?height=200&width=200" },
      { name: "Rattan Furniture", image: "/placeholder.svg?height=200&width=200" },
      { name: "Layered Rugs", image: "/placeholder.svg?height=200&width=200" },
      { name: "Indoor Plants", image: "/placeholder.svg?height=200&width=200" },
      { name: "Colorful Textiles", image: "/placeholder.svg?height=200&width=200" },
    ],
    // Fallback for other premium styles
    Default: [
      { name: "Accent Wall", image: "/placeholder.svg?height=200&width=200" },
      { name: "Statement Lighting", image: "/placeholder.svg?height=200&width=200" },
      { name: "Decorative Objects", image: "/placeholder.svg?height=200&width=200" },
      { name: "Wall Art", image: "/placeholder.svg?height=200&width=200" },
      { name: "Area Rug", image: "/placeholder.svg?height=200&width=200" },
      { name: "Window Treatments", image: "/placeholder.svg?height=200&width=200" },
    ],
  }

  // Get elements for the selected style or use default
  const elements = elementsByStyle[styleName] || elementsByStyle["Default"]

  // Only one element can be selected at a time
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Premium Element Selection</h3>
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100/80 to-red-100/80 dark:from-purple-900/30 dark:to-red-900/30 text-purple-800 dark:text-purple-400 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm">
            <Crown className="h-3 w-3" />
            <span>Premium</span>
          </div>
        </div>

        {selectedElement && (
          <button
            onClick={() => setSelectedElement(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear selection
          </button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Choose one premium element to enhance your space. You can select multiple styles, but only one premium element.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {elements.map((element) => (
          <motion.div
            key={element.name}
            className={cn(
              "relative cursor-pointer rounded-lg overflow-hidden border-2",
              selectedElement === element.name
                ? "border-black ring-2 ring-black/20"
                : "border-transparent hover:border-black/50",
            )}
            onClick={() => setSelectedElement(element.name)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="aspect-square relative">
              <Image src={element.image || "/placeholder.svg"} alt={element.name} fill className="object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent backdrop-blur-[1px] flex items-end">
                <div className="w-full p-2 text-white text-xs font-medium">{element.name}</div>
              </div>

              {selectedElement === element.name && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedElement && (
        <motion.div
          className="mt-4 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-800/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <p className="text-sm font-medium">
              <span className="text-black dark:text-white">{selectedElement}</span> will be added to your design
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-4">
            Remember: You can select multiple styles, but only one premium element can be applied.
          </p>
        </motion.div>
      )}
    </div>
  )
}
