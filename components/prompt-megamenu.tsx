"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptCategory {
  name: string
  description: string
  prompts: {
    title: string
    prompt: string
  }[]
}

interface PromptMegamenuProps {
  onSelectPrompt: (prompt: string) => void
  isModal?: boolean
}

const promptCategories: PromptCategory[] = [
  {
    name: "Property Listings",
    description: "Prompts for creating compelling property descriptions",
    prompts: [
      {
        title: "Luxury Home",
        prompt:
          "Write an attractive property listing for a luxury [property type] located in [location] with [number] bedrooms and [number] bathrooms. Highlight premium features and amenities including [feature 1], [feature 2], and [feature 3].",
      },
      {
        title: "Starter Home",
        prompt: "Create an engaging listing for a starter home in [location] that appeals to first-time buyers. Emphasize affordability, potential for growth, and proximity to [amenity 1] and [amenity 2].",
      },
      {
        title: "Investment Property",
        prompt:
          "Draft a property listing for an investment property in [location] that highlights ROI potential of [percentage]%, rental income possibilities of $[amount]/month, and market growth projections for the area.",
      },
    ],
  },
  {
    name: "Market Analysis",
    description: "Prompts for analyzing real estate markets and trends",
    prompts: [
      {
        title: "Neighborhood Trends",
        prompt: "Analyze the real estate trends in [neighborhood] over the past [number] years, including price appreciation, inventory levels, and buyer demographics.",
      },
      {
        title: "Investment Opportunity",
        prompt: "Evaluate the investment potential of [property type] properties in [location], considering current market conditions, future development plans, and economic indicators.",
      },
      {
        title: "Comparative Market Analysis",
        prompt:
          "Create a comparative market analysis for a [property type] in [location], comparing it to similar properties that have sold in the last [number] months.",
      },
    ],
  },
  {
    name: "Buyer Guidance",
    description: "Prompts for helping buyers navigate the real estate process",
    prompts: [
      {
        title: "First-Time Buyer Guide",
        prompt:
          "Create a comprehensive guide for first-time homebuyers in [location], covering the entire process from mortgage pre-approval to closing, including local considerations.",
      },
      {
        title: "Relocation Advice",
        prompt:
          "Write advice for someone relocating to [location] from [origin location], highlighting neighborhood recommendations, cost of living differences, and lifestyle considerations.",
      },
      {
        title: "Investment Strategy",
        prompt:
          "Develop an investment strategy for a buyer with [budget amount] looking to purchase [property type] in [location] with a [short/long]-term investment horizon.",
      },
    ],
  },
  {
    name: "Client Communication",
    description: "Prompts for effective client interactions",
    prompts: [
      {
        title: "Buyer Follow-up",
        prompt: "Write a follow-up email to a potential buyer after showing them [property address], addressing their specific interests in [feature 1] and [feature 2], and suggesting next steps.",
      },
      {
        title: "Seller Update",
        prompt: "Create a monthly update email for a seller whose property at [address] has been on the market for [number] days, including recent showing feedback, market activity, and recommended adjustments.",
      },
      {
        title: "Offer Negotiation",
        prompt: "Draft a communication to a seller explaining why they should consider a buyer's offer of $[amount] for their property listed at $[list price], highlighting [strength 1] and [strength 2] of the offer.",
      },
    ],
  },
]

export function PromptMegamenu({ onSelectPrompt, isModal = false }: PromptMegamenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(promptCategories[0].name)

  return isModal ? (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Categories */}
      <div className="md:col-span-1 bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">CATEGORIES</h3>
        <ul className="space-y-1">
          {promptCategories.map((category) => (
            <li key={category.name}>
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between",
                  activeCategory === category.name
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 hover:text-accent-foreground",
                )}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
                <ChevronRight className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Prompts */}
      <div className="md:col-span-4">
        {promptCategories.map((category) => (
          <div key={category.name} className={cn("space-y-4", activeCategory === category.name ? "block" : "hidden")}>
            <div>
              <h3 className="text-lg font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.prompts.map((prompt) => (
                <div
                  key={prompt.title}
                  className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => onSelectPrompt(prompt.prompt)}
                >
                  <h4 className="font-medium mb-1">{prompt.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-accent-foreground/80">
                    {prompt.prompt.substring(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="absolute left-0 mt-2 w-screen bg-popover shadow-lg rounded-b-lg border border-border overflow-hidden z-50">
      <div className="grid grid-cols-5 min-h-[300px]">
        {/* Categories */}
        <div className="col-span-1 bg-muted/50 border-r border-border">
          <div className="p-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">CATEGORIES</h3>
            <ul className="space-y-1">
              {promptCategories.map((category) => (
                <li key={category.name}>
                  <button
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between",
                      activeCategory === category.name
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                    onClick={() => setActiveCategory(category.name)}
                    onMouseEnter={() => setActiveCategory(category.name)}
                  >
                    {category.name}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prompts */}
        <div className="col-span-4 p-6">
          {promptCategories.map((category) => (
            <div key={category.name} className={cn("space-y-4", activeCategory === category.name ? "block" : "hidden")}>
              <div>
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.prompts.map((prompt) => (
                  <div
                    key={prompt.title}
                    className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    onClick={() => onSelectPrompt(prompt.prompt)}
                  >
                    <h4 className="font-medium mb-1">{prompt.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-accent-foreground/80">
                      {prompt.prompt.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}