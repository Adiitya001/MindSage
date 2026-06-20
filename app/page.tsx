"use client"

import { useState, useEffect } from "react"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Globe } from "lucide-react"

export default function EntryGate() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
        <MindSageLogo size={600} />
      </div>

      <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Language Switcher</span>
        </Button>
      </div>

      <AnimatePresence>
        {isLoaded && (
          <div className="z-10 w-full max-w-4xl flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
              }}
              transition={{
                opacity: { duration: 1.2, ease: "easeOut" },
                scale: { duration: 1.2, ease: "easeOut" },
                y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="mb-16"
            >
              <MindSageLogo size={120} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/welcome" className="group">
                  <div className="h-64 flex flex-col items-center justify-center p-8 bg-card border border-border rounded-3xl transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    <h2 className="text-2xl font-light mb-3 text-foreground group-hover:text-primary transition-colors">
                      I&apos;m new here
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium tracking-wide">Begin gently</p>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Link href="/login" className="group">
                  <div className="h-64 flex flex-col items-center justify-center p-8 bg-card border border-border rounded-3xl transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    <h2 className="text-2xl font-light mb-3 text-foreground group-hover:text-primary transition-colors">
                      I already have an account
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium tracking-wide">Continue your journey</p>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
    </main>
  )
}