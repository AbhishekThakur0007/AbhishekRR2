"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Grid2X2, List, Star, Mic, MicOff, Send, Copy, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for popular prompts
const popularPrompts = [
  {
    category: "Creative",
    prompts: [
      { id: 1, title: "Design a logo for a tech startup", popularity: 4.8 },
      { id: 2, title: "Create a fantasy character description", popularity: 4.6 },
      { id: 3, title: "Write a poem about nature", popularity: 4.5 },
      { id: 4, title: "Generate a color palette for a website", popularity: 4.7 },
      { id: 5, title: "Design a minimalist poster", popularity: 4.4 },
      { id: 6, title: "Create a brand identity for a coffee shop", popularity: 4.3 },
    ],
  },
  {
    category: "Business",
    prompts: [
      { id: 7, title: "Write a professional email template", popularity: 4.9 },
      { id: 8, title: "Create a business plan outline", popularity: 4.7 },
      { id: 9, title: "Generate a marketing strategy", popularity: 4.8 },
      { id: 10, title: "Draft a project proposal", popularity: 4.6 },
      { id: 11, title: "Create a sales pitch", popularity: 4.5 },
      { id: 12, title: "Write a company mission statement", popularity: 4.4 },
    ],
  },
  {
    category: "Technical",
    prompts: [
      { id: 13, title: "Explain a complex technical concept", popularity: 4.7 },
      { id: 14, title: "Debug this code snippet", popularity: 4.8 },
      { id: 15, title: "Create a database schema", popularity: 4.6 },
      { id: 16, title: "Write a function to solve this problem", popularity: 4.9 },
      { id: 17, title: "Optimize this algorithm", popularity: 4.7 },
      { id: 18, title: "Design a system architecture", popularity: 4.5 },
    ],
  },
  {
    category: "Education",
    prompts: [
      { id: 19, title: "Create a lesson plan for middle school", popularity: 4.6 },
      { id: 20, title: "Generate practice questions for a test", popularity: 4.8 },
      { id: 21, title: "Explain this concept for a 10-year-old", popularity: 4.9 },
      { id: 22, title: "Create a study guide for this topic", popularity: 4.7 },
      { id: 23, title: "Design an interactive learning activity", popularity: 4.5 },
      { id: 24, title: "Write a quiz on this subject", popularity: 4.4 },
    ],
  },
]

interface PopularPromptsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PopularPromptsModal({ open, onOpenChange }: PopularPromptsModalProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("Creative")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    let SpeechRecognition: any = null
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event:any) => {
        const transcript = Array.from(event.results)
          .map((result:any) => result[0])
          .map((result) => result.transcript)
          .join("")

        setCustomPrompt(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt)
    setCustomPrompt(prompt)
  }

  const handleSubmitPrompt = () => {
    if (!customPrompt.trim()) return

    console.log("Submitting prompt:", customPrompt)
    // Here you would typically handle the prompt submission
    // For example, send it to an API or process it
    onOpenChange(false)
  }

  const handleCopyPrompt = () => {
    if (!customPrompt.trim()) return

    navigator.clipboard
      .writeText(customPrompt)
      .then(() => {
        console.log("Prompt copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy prompt: ", err)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[800px] glass-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Prompt Library</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-4">
                {popularPrompts.map((category) => (
                  <TabsTrigger key={category.category} value={category.category}>
                    {category.category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(viewMode === "grid" && "bg-primary text-primary-foreground")}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(viewMode === "list" && "bg-primary text-primary-foreground")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {popularPrompts.map((category) => (
              <TabsContent key={category.category} value={category.category} className="mt-2">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {category.prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={cn(
                          "border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors relative group",
                          selectedPrompt === prompt.title && "border-primary bg-primary/10",
                        )}
                        onClick={() => handlePromptSelect(prompt.title)}
                      >
                        <div className="font-medium">{prompt.title}</div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{prompt.popularity.toFixed(1)}</span>
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 mb-4">
                    {category.prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={cn(
                          "border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors flex justify-between items-center group",
                          selectedPrompt === prompt.title && "border-primary bg-primary/10",
                        )}
                        onClick={() => handlePromptSelect(prompt.title)}
                      >
                        <div className="font-medium">{prompt.title}</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{prompt.popularity.toFixed(1)}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="font-medium mb-2">Your Prompt</div>
          <div className="relative">
            <Textarea
              placeholder="Write or select a prompt..."
              className="min-h-[120px] pr-10"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn("absolute right-2 top-2", isRecording && "text-red-500")}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCopyPrompt}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleSubmitPrompt}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
