"use client"

import { useState } from "react"
import { Nav } from "@/components/nav-bar"
import { PromptModal } from "@/components/prompt-modal"

export function NavbarWrapper() {
  const [isPromptModalOpen, setPromptModalOpen] = useState(false)
  
  return (
    <>
      <Nav onWriteClick={() => setPromptModalOpen(true)} />
      <PromptModal open={isPromptModalOpen} onOpenChange={setPromptModalOpen} />
    </>
  )
}