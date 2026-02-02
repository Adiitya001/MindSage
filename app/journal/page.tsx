"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"

export default function JournalPage() {
  const [content, setContent] = useState("")
  const [status, setStatus] = useState("Saved locally")

  useEffect(() => {
    const timer = setTimeout(() => setStatus("Safe and secure"), 2000)
    return () => clearTimeout(timer)
  }, [content])

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <header className="p-8 flex justify-between items-center z-20 shrink-0">
        <MindSageLogo size={32} />
        <div className="flex items-center gap-6">
          <div className="text-xs text-muted-foreground/60 font-light tracking-widest uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            {status}
          </div>
          <AccountIcon />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-12 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="flex-1 flex flex-col"
        >
          <div className="mb-8">
            <h1 className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-light mb-2">
              Today&apos;s Entry
            </h1>
            <p className="text-2xl font-light text-foreground/80">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="This is your private space. You can write anything..."
            className="flex-1 w-full bg-transparent border-none outline-none resize-none text-xl font-light leading-loose placeholder:text-muted-foreground/30 placeholder:italic text-foreground/90"
            autoFocus
          />
        </motion.div>
      </main>

      <Navigation />
    </div>
  )
}
