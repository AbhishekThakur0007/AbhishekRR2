"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Download, Share2, Heart, Calendar, Clock, Maximize2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import ImageEditorModal from "@/app/home-ai/components/image-editor-modal"

export default function ResultsGallery() {
  const [activeTab, setActiveTab] = useState("all")
  const [hasResults, setHasResults] = useState(true) // Changed to true to show example results
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Example results for demonstration
  const results = [
    {
      id: "result1",
      title: "Modern Living Room",
      date: "Apr 2, 2025",
      time: "2 min ago",
      image: "/placeholder-h0wxn.png",
      style: "living",
    },
    {
      id: "result2",
      title: "Minimalist Bedroom",
      date: "Apr 2, 2025",
      time: "5 min ago",
      image: "/placeholder-wqe42.png",
      style: "bedroom",
    },
    {
      id: "result3",
      title: "Industrial Kitchen",
      date: "Apr 1, 2025",
      time: "1 day ago",
      image: "/placeholder-sgl47.png",
      style: "kitchen",
    },
    {
      id: "result4",
      title: "Scandinavian Office",
      date: "Mar 30, 2025",
      time: "3 days ago",
      image: "/placeholder-g8nh6.png",
      style: "office",
    },
  ]

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const filteredResults = activeTab === "all" ? results : results.filter((result) => result.style === activeTab)

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4 md:grid-cols-7 h-auto bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1">
          <TabsTrigger
            value="all"
            className="text-xs data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="living"
            className="text-xs data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Living
          </TabsTrigger>
          <TabsTrigger
            value="bedroom"
            className="text-xs data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Bedroom
          </TabsTrigger>
          <TabsTrigger
            value="kitchen"
            className="text-xs data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Kitchen
          </TabsTrigger>
          <TabsTrigger
            value="dining"
            className="text-xs hidden md:inline-flex data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Dining
          </TabsTrigger>
          <TabsTrigger
            value="bathroom"
            className="text-xs hidden md:inline-flex data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Bathroom
          </TabsTrigger>
          <TabsTrigger
            value="office"
            className="text-xs hidden md:inline-flex data-[state=active]:bg-white/80 dark:data-[state=active]:bg-slate-800/80 data-[state=active]:backdrop-blur-md"
          >
            Office
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {hasResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  isFavorite={favorites.includes(result.id)}
                  onToggleFavorite={() => toggleFavorite(result.id)}
                  onOpenEditor={() => setSelectedImage(result.image)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        {["living", "bedroom", "kitchen", "dining", "bathroom", "office"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {hasResults && filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    isFavorite={favorites.includes(result.id)}
                    onToggleFavorite={() => toggleFavorite(result.id)}
                    onOpenEditor={() => setSelectedImage(result.image)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Image Editor Modal */}
      {selectedImage && (
        <ImageEditorModal imageSrc={selectedImage} isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  )
}

interface ResultCardProps {
  result: {
    id: string
    title: string
    date: string
    time: string
    image: string
  }
  isFavorite: boolean
  onToggleFavorite: () => void
  onOpenEditor: () => void
}

function ResultCard({ result, isFavorite, onToggleFavorite, onOpenEditor }: ResultCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 dark:border-slate-800/50"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <Image src={result.image || "/placeholder.svg"} alt={result.title} fill className="object-cover" />

        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={onOpenEditor}
            >
              Edit Image <Edit className="ml-2 h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>
      <div className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="font-medium text-sm">{result.title}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {result.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {result.time}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpenEditor}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", isFavorite && "text-red-500")}
            onClick={onToggleFavorite}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
      <h3 className="font-medium mb-2">No results yet</h3>
      <p className="text-sm text-muted-foreground mb-4">Upload a room photo and generate designs to see results here</p>
    </div>
  )
}
