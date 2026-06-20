"use client"

import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Link from "next/link"

function PrivacyPageContent() {
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
            <Shield className="w-8 h-8 text-primary/60" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">Privacy & Data</h1>
          </div>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            MindSage is a private space for reflection. Your data belongs to you.
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
                <CardTitle className="text-xl font-normal">What we store</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Account information (email, display name)</p>
                <p className="text-foreground font-light">Preferences (wisdom mode, avatar)</p>
                <p className="text-foreground font-light">Conversations (only if you choose to save them)</p>
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
                <CardTitle className="text-xl font-normal">What we do NOT store</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">No medical records</p>
                <p className="text-foreground font-light">No diagnoses</p>
                <p className="text-foreground font-light">No prescriptions</p>
                <p className="text-foreground font-light">No clinical notes</p>
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
                <CardTitle className="text-xl font-normal">How your data is protected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Secure authentication</p>
                <p className="text-foreground font-light">Encrypted storage</p>
                <p className="text-foreground font-light">Access limited to you</p>
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
                <CardTitle className="text-xl font-normal">Your control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">Edit or delete your profile anytime</p>
                <p className="text-foreground font-light">Delete conversations anytime</p>
                <p className="text-foreground font-light">Request full account deletion</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">AI boundaries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground font-light">MindSage provides guidance, not medical advice</p>
                <p className="text-foreground font-light">In serious situations, MindSage recommends real human support</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="border-none bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-normal">Future safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-light">Optional guardian or emergency contact features (planned)</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-8 text-center"
          >
            <p className="text-muted-foreground font-light italic">
              MindSage respects your privacy by design.
            </p>
          </motion.div>
        </div>
      </div>

      <Navigation />
    </main>
  )
}

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <PrivacyPageContent />
    </ProtectedRoute>
  )
}
