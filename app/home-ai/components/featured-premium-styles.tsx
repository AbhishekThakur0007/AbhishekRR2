"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Crown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeaturedPremiumStyles() {
  const [activeIndex, setActiveIndex] = useState(0)

  const premiumStyles = [
    {
      id: "premium-1",
      name: "Luxury Modern",
      description: "Elegant contemporary design with premium materials and sophisticated details",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "premium-2",
      name: "Minimalist Premium",
      description: "Clean lines and curated elements for a refined, high-end minimalist aesthetic",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "premium-3",
      name: "Executive Suite",
      description: "Professional-grade design inspired by luxury hotels and executive spaces",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="rounded-xl overflow-hidden border border-purple-200/50 dark:border-purple-800/30">
      <div className="bg-gradient-to-r from-purple-600 to-red-600 backdrop-blur-md p-3 flex items-center border-b border-purple-500/30">
        <Crown className="h-5 w-5 text-white mr-2" />
        <h3 className="font-semibold text-white">Featured Premium Styles</h3>
      </div>

      <div className="relative aspect-video">
        {premiumStyles.map((style, index) => (
          <motion.div
            key={style.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src={style.image || "/placeholder.svg"} alt={style.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
              <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-md">
                <h4 className="text-white font-bold text-lg">{style.name}</h4>
                <p className="text-white/80 text-sm mb-4">{style.description}</p>
                <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white w-full sm:w-auto backdrop-blur-sm">
                  Try This Premium Style <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex p-2 bg-purple-50/80 dark:bg-purple-950/30 backdrop-blur-sm">
        {premiumStyles.map((style, index) => (
          <button
            key={style.id}
            className={`h-1.5 rounded-full flex-1 mx-1 transition-all ${
              index === activeIndex
                ? "bg-gradient-to-r from-purple-600 to-red-600"
                : "bg-purple-200 dark:bg-purple-800/50"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
