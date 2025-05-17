"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "API", href: "/api" },
    { name: "Features", href: "/features" },
    { name: "Resources", href: "/resources" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 mt-2">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">REVA</span>
            </a>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="flex flex-col gap-6">
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    className="flex items-center py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          <div className="mt-auto pt-8 space-y-4">
            <Button variant="outline" className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              Sign In
            </Button>
            <Button className="w-full bg-black hover:bg-black/90 text-white">Try Free</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
