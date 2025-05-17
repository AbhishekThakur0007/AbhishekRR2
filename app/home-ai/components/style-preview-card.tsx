"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface StylePreviewCardProps {
  style: {
    id: string
    name: string
    image: string
    isPremium: boolean
  }
  isSelected: boolean
  onSelect: () => void
}

export default function StylePreviewCard({ style, isSelected, onSelect }: StylePreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer transition-all border-2",
        isSelected
          ? "border-black ring-2 ring-black/20"
          : style.isPremium
            ? "border-purple-300/70 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-600"
            : "border-transparent hover:border-black/50",
        style.isPremium && "shadow-md hover:shadow-lg",
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      {style.isPremium && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-red-600 backdrop-blur-sm text-white text-xs font-medium py-1 px-2 flex items-center justify-center z-10 border-b border-purple-500/30">
          <Crown className="h-3 w-3 mr-1" /> Premium Style
        </div>
      )}

      <div className={cn("aspect-video relative", style.isPremium && "pt-6")}>
        <Image src={style.image || "/placeholder.svg"} alt={style.name} fill className="object-cover" />

        <AnimatePresence>
          {isHovered && !isSelected && (
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "bg-white/90 hover:bg-white backdrop-blur-sm",
                  style.isPremium &&
                    "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white border-purple-400",
                )}
              >
                Preview Style <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
          <div className="w-full p-3 text-white font-medium flex justify-between items-center">
            <span>{style.name}</span>
          </div>
        </div>

        {isSelected && (
          <motion.div
            className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
