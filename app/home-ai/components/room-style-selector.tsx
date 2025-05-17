"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RoomElements from "@/app/home-ai/components//room-elements"
import StylePreviewCard from "@/app/home-ai/components/style-preview-card"
import { Badge } from "@/components/ui/badge"
import { Crown, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RoomStyleSelectorProps {
  onPremiumStyleSelection?: (hasPremium: boolean) => void
}

export default function RoomStyleSelector({ onPremiumStyleSelection }: RoomStyleSelectorProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [showAllStyles, setShowAllStyles] = useState(false)

  // Generate 12 styles for each category
  const generateStyles = (category: string, isPremium: boolean, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${category}-${i + 1}`,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Style ${i + 1}`,
      image: "/placeholder.svg?height=200&width=300",
      isPremium,
      category,
    }))
  }

  const popularStyles = generateStyles("popular", false, 12)
  const trendingStyles = generateStyles("trending", false, 12)
  const premiumStyles = generateStyles("premium", true, 12)

  // Combine all styles
  const allStyles = [...popularStyles, ...premiumStyles, ...trendingStyles]

  // Filter styles based on selected category
  const filteredStyles = filter ? allStyles.filter((style) => style.category === filter) : allStyles

  // Limit displayed styles unless "show all" is clicked
  const displayedStyles = showAllStyles ? filteredStyles : filteredStyles.slice(0, 8)

  // Check if any selected style is premium
  const selectedStylesData = allStyles.filter((style) => selectedStyles.includes(style.id))
  const isPremiumSelected = selectedStylesData.some((style) => style.isPremium)

  // Notify parent component when premium selection changes
  useEffect(() => {
    if (onPremiumStyleSelection) {
      onPremiumStyleSelection(isPremiumSelected)
    }
  }, [isPremiumSelected, onPremiumStyleSelection])

  // Ensure premium styles are always visible in the initial view
  const initialDisplayStyles = () => {
    if (filter) return displayedStyles

    // When showing all styles without a filter, ensure at least 2 premium styles are visible
    const nonPremiumStyles = displayedStyles.filter((style) => !style.isPremium)
    const premiumStylesToShow = premiumStyles.slice(0, 2)

    // If we're not showing all styles, ensure premium styles are included in the initial view
    if (!showAllStyles) {
      return [...nonPremiumStyles.slice(0, 6), ...premiumStylesToShow]
    }

    return displayedStyles
  }

  const visibleStyles = filter === "premium" ? displayedStyles : initialDisplayStyles()
  const hasMoreStyles = filteredStyles.length > displayedStyles.length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Badge
            variant={filter === null ? "default" : "outline"}
            className="cursor-pointer backdrop-blur-sm"
            onClick={() => setFilter(null)}
          >
            All Styles
          </Badge>
          <Badge
            variant={filter === "popular" ? "default" : "outline"}
            className="cursor-pointer backdrop-blur-sm"
            onClick={() => setFilter("popular")}
          >
            Popular
          </Badge>
          <Badge
            variant={filter === "trending" ? "default" : "outline"}
            className="cursor-pointer backdrop-blur-sm"
            onClick={() => setFilter("trending")}
          >
            Trending
          </Badge>
          <Badge
            variant={filter === "premium" ? "default" : "outline"}
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white backdrop-blur-sm"
            onClick={() => setFilter("premium")}
          >
            <Crown className="h-3 w-3 mr-1" /> Premium
          </Badge>
        </div>
      </div>

      {/* Selected styles count */}
      {selectedStyles.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
              {selectedStyles.length}
            </div>
            <span className="text-sm font-medium">{selectedStyles.length === 1 ? "Style" : "Styles"} selected</span>
          </div>
          <button
            onClick={() => setSelectedStyles([])}
            className="text-xs text-muted-foreground hover:text-foreground bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Premium Styles Banner - Always visible unless filtering for non-premium */}
      {(filter === null || filter === "premium") && (
        <div className="bg-gradient-to-r from-purple-50/80 to-red-50/80 dark:from-purple-950/30 dark:to-red-950/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-400">Premium Styles</h3>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Unlock premium styles for stunning, professional-quality room transformations with exclusive design
            elements.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
        {visibleStyles.map((style) => (
          <StylePreviewCard
            key={style.id}
            style={style}
            isSelected={selectedStyles.includes(style.id)}
            onSelect={() => {
              if (selectedStyles.includes(style.id)) {
                // Remove style if already selected
                setSelectedStyles(selectedStyles.filter((id) => id !== style.id))
              } else {
                // Add style to selection
                setSelectedStyles([...selectedStyles, style.id])
              }
            }}
          />
        ))}
      </div>

      {/* Show more/less button */}
      {hasMoreStyles || showAllStyles ? (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllStyles(!showAllStyles)}
            className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          >
            {showAllStyles ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Show More Styles
                <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      ) : null}

      {/* Room Elements section - only shown for premium styles */}
      <AnimatePresence>
        {isPremiumSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="border-t pt-8 mt-8"
          >
            <RoomElements styleName={selectedStylesData[0]?.name || ""} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
