"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

export function AnimatedSearch({ isOpen, onClose, onSearch }: AnimatedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  if (!isVisible && !isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/60 backdrop-blur-md transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className={cn(
          "relative w-full max-w-lg transition-all duration-300",
          isOpen ? "translate-y-0 scale-100" : "-translate-y-10 scale-95",
        )}
      >
        <div className="rounded-lg shadow-lg overflow-hidden bg-background/90 dark:bg-background/80 border border-border/50">
          <form onSubmit={handleSearch} className="relative">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search..."
              className="h-14 pl-12 pr-12 text-lg border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-background/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
