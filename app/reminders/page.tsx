"use client"

import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import Link from "next/link"

function RemindersPageContent() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="fixed top-8 left-8 z-50">
        <Link href="/profile">
          <MindSageLogo size={32} />
        </Link>
      </div>
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        <AccountIcon />
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-primary/60" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">Gentle Reminders</h1>
          </div>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Gentle reminders are soft nudges to pause, reflect, or breathe — never pressure.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">What reminders are</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Optional check-ins</p>
                <p className="text-foreground font-light">Calm reflection prompts</p>
                <p className="text-foreground font-light">Supportive, non-urgent nudges</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">What reminders are NOT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Not alarms</p>
                <p className="text-foreground font-light">Not streaks</p>
                <p className="text-foreground font-light">Not performance tracking</p>
                <p className="text-foreground font-light">Not mental health monitoring</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Fully opt-in</p>
                <p className="text-foreground font-light">Adjustable frequency</p>
                <p className="text-foreground font-light">Easy to turn off anytime</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-light">This feature is thoughtfully designed and coming soon.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Navigation />
    </main>
  )
}

export default function RemindersPage() {
  return (
    <ProtectedRoute>
      <RemindersPageContent />
    </ProtectedRoute>
  )
}
