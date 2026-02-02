"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function WelcomeJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const lightColors = [
    "oklch(0.99 0.002 240)", // Soft off-white (matches --background)
    "oklch(0.96 0.02 240)",
    "oklch(0.95 0.03 260)",
    "oklch(0.96 0.02 240)",
    "oklch(0.99 0.002 240)",
  ]

  const darkColors = [
    "oklch(0.1 0.01 240)", // Immersive midnight charcoal (matches --background)
    "oklch(0.12 0.02 240)",
    "oklch(0.13 0.03 260)",
    "oklch(0.12 0.02 240)",
    "oklch(0.1 0.01 240)",
  ]

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    mounted && resolvedTheme === "dark" ? darkColors : lightColors,
  )

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="relative transition-colors duration-1000 min-h-screen"
    >
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center bg-transparent">
        <Link href="/">
          <MindSageLogo size={40} />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className="rounded-full px-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
            asChild
          >
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      {/* Chapter 1: Emotional Hook */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extralight text-center max-w-3xl leading-tight text-balance"
        >
          A sanctuary for the mind, built for the moments between.
        </motion.h1>
      </section>

      {/* Chapter 2: The Problem */}
      <section className="h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center max-w-xl"
        >
          <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed">
            The world doesn&apos;t often ask how you feel. It asks what you&apos;ve done. MindSage is here for the rest.
          </p>
        </motion.div>
      </section>

      {/* Chapter 3: What MindSage Offers */}
      <section className="min-h-screen py-24 px-6 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full">
          {[
            { title: "Reflection", desc: "A quiet space to untangle your thoughts." },
            { title: "Guidance", desc: "Gentle perspectives when you need them most." },
            { title: "Journaling", desc: "Your personal history of growth and clarity." },
            { title: "Emotional Clarity", desc: "Seeing the patterns that shape your days." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2rem] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-500"
            >
              <h3 className="text-2xl font-light mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chapter 4: Experience over Features */}
      <section className="h-screen flex items-center justify-center px-6 bg-primary/[0.02]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-extralight mb-8">It feels like coming home.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every interaction is designed to be intentional, private, and non-judgmental. There are no metrics here—only
            you.
          </p>
        </motion.div>
      </section>

      {/* Chapter 5: Trust & Safety + CTA */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-xl mb-24"
        >
          <p className="text-sm uppercase tracking-widest text-primary/60 mb-8">Trust & Safety</p>
          <p className="text-muted-foreground text-sm italic leading-relaxed">
            MindSage provides guidance and a space for reflection. We are here to support you, but please remember we
            are not a medical service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <Button
            size="lg"
            className="h-16 px-12 rounded-full text-lg font-light transition-all duration-500 hover:scale-105"
            asChild
          >
            <Link href="/signup">Begin your journey</Link>
          </Button>
          <p className="mt-8 text-muted-foreground/60 text-sm">You are safe here.</p>
        </motion.div>
      </section>

      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-[-1] flex items-center justify-center opacity-[0.02]">
        <MindSageLogo size={800} />
      </div>
    </motion.div>
  )
}
