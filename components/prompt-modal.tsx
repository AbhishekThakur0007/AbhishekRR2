"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PromptMegamenu } from "@/components/prompt-megamenu"
import { Textarea } from "@/components/ui/textarea"
import { PenLine, X, Sparkles, Wand2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PromptModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PromptModal({ open, onOpenChange }: PromptModalProps) {
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [showPromptEditor, setShowPromptEditor] = useState(false)

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt)
    setShowPromptEditor(true)
  }

  const handleImprovePrompt = () => {
    // This would be connected to an AI service in a real implementation
    console.log("Improving prompt:", selectedPrompt)
  }

  const handleGenerate = () => {
    // This would be connected to an AI service in a real implementation
    console.log("Generating with prompt:", selectedPrompt)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-6">
        {showPromptEditor && (
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">
              Prompt Library
            </DialogTitle>
          </DialogHeader>
        )}
        
        {showPromptEditor ? (
          <div className="space-y-6">
            <div className="relative rounded-lg overflow-hidden bg-black/80 backdrop-blur-md p-6 shadow-lg border border-white/10">
              <div className="absolute top-4 right-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => setShowPromptEditor(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                AI Prompt
              </h3>
              <Textarea 
                value={selectedPrompt} 
                onChange={(e) => setSelectedPrompt(e.target.value)}
                className="min-h-[150px] bg-black text-white border-gray-700 focus:border-blue-500 resize-none"
                placeholder="Enter your prompt here..."
              />
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-medium"
                  onClick={handleImprovePrompt}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Improve Prompt
                </Button>
                <Button 
                  className="gradient-text bg-gradient-to-r from-[#ff4d4d] via-[#f9cb28] to-[#4ade80] text-white font-medium animate-gradient-x"
                  onClick={handleGenerate}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Suggested Prompts</h3>
                <div className="relative w-64">
                  <Input 
                    className="pl-8 h-8 text-sm" 
                    placeholder="Search prompts..." 
                  />
                  <svg 
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              <PromptMegamenu onSelectPrompt={handlePromptSelect} isModal={true} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Prompt Library</h3>
              <div className="relative w-64">
                <Input 
                  className="pl-8 h-8 text-sm" 
                  placeholder="Search prompts..." 
                />
                <svg 
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
            <PromptMegamenu onSelectPrompt={handlePromptSelect} isModal={true} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}