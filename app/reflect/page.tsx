"use client"

import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { RefreshCcw } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"

const REFLECTIONS = [
  "What is one small thing that went well today?",
  "How are you feeling in your body right now?",
  "What is something you're looking forward to, no matter how small?",
  "If you could give yourself one piece of gentle advice today, what would it be?",
  "What is a boundary you've successfully held recently?",
]

export default function ReflectPage() {
  const [index, setIndex] = useState(0)

  const nextReflection = () => {
    setIndex((prev) => (prev + 1) % REFLECTIONS.length)
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="pt-12 px-6 flex justify-between items-center">
        <div className="w-10" />
        <MindSageLogo className="w-12 h-12" />
        <div className="flex items-center gap-4">
          <AccountIcon />
        <ThemeToggle />
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <span className="text-xs uppercase tracking-widest text-primary/60 font-medium">Moment of Reflection</span>
            <h2 className="text-3xl md:text-4xl font-light leading-snug text-pretty">{REFLECTIONS[index]}</h2>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex flex-col gap-4 w-full max-w-xs">
          <Button
            onClick={nextReflection}
            className="rounded-full py-6 text-lg font-light tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm"
          >
            Explore another prompt
            <RefreshCcw className="ml-2 w-4 h-4" />
          </Button>
          <Button variant="ghost" className="text-muted-foreground font-light tracking-wide">
            I'm finished for now
          </Button>
        </div>
      </section>

      <Navigation />
    </main>
  )
}
