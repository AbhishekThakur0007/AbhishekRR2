"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Download,
  Share2,
  Video,
  MessageSquare,
  Edit,
  Wand2,
  Eraser,
  Brush,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Layers,
  Send,
  Sparkles,
  Play,
  Pause,
  Crop,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImageEditorModalProps {
  imageSrc: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageEditorModal({ imageSrc, isOpen, onClose }: ImageEditorModalProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "chat">("edit")
  const [brushSize, setBrushSize] = useState(20)
  const [brushOpacity, setBrushOpacity] = useState(100)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "How would you like to edit this image? You can ask me to change colors, add or remove items, or transform the style.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    setChatMessages([...chatMessages, { role: "user", content: inputMessage }])

    // Simulate AI response
    setIsLoading(true)
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've applied your changes to the image. Is there anything else you'd like to modify?",
        },
      ])
      setIsLoading(false)
    }, 1500)

    setInputMessage("")
  }

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode)
    if (!isVideoMode) {
      // When enabling video mode
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh] h-[800px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              <h2 className="font-semibold">Image Editor</h2>
              {isVideoMode && (
                <div className="ml-2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-red-600 text-white text-xs rounded-full">
                  Video Mode
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleVideoMode}>
                {isVideoMode ? "Image Mode" : "Video Mode"}
                <Video className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Image Canvas Area */}
            <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              {isVideoMode ? (
                <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image src={imageSrc || "/placeholder.svg"} alt="Edited room" fill className="object-contain" />
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={isPlaying ? { width: "100%" } : { width: "0%" }}
                        transition={{
                          duration: 10,
                          repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                          repeatType: "loop",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
                  <Image src={imageSrc || "/placeholder.svg"} alt="Edited room" fill className="object-contain" />
                </div>
              )}

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-lg p-1 flex flex-col">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "edit" | "chat")}
                className="flex flex-col h-full"
              >
                <TabsList className="w-full grid grid-cols-2 rounded-none">
                  <TabsTrigger value="edit" className="rounded-none">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="rounded-none">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="flex-1 p-4 overflow-y-auto space-y-6 m-0">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Tools</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-full">
                        <Brush className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-full">
                        <Eraser className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-full">
                        <Wand2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-full">
                        <Crop className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">Brush Size</h3>
                      <span className="text-xs text-muted-foreground">{brushSize}px</span>
                    </div>
                    <Slider
                      value={[brushSize]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setBrushSize(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">Opacity</h3>
                      <span className="text-xs text-muted-foreground">{brushOpacity}%</span>
                    </div>
                    <Slider
                      value={[brushOpacity]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => setBrushOpacity(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Layers</h3>
                    <div className="border rounded-md p-2 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2" />
                          <span className="text-sm">Original</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <div className="flex items-center">
                          <Layers className="h-4 w-4 mr-2" />
                          <span className="text-sm">Mask</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">History</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Undo className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Redo className="h-4 w-4 mr-2" />
                        Redo
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Apply AI Enhancement
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="flex flex-col flex-1 m-0 p-0 overflow-hidden">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-red-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800",
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-slate-100 dark:bg-slate-800">
                          <div className="flex space-x-2">
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Ask AI to edit your image..."
                        className="min-h-[60px] resize-none"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 self-end"
                        size="icon"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Try: "Add a plant in the corner" or "Change the wall color to blue"
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
