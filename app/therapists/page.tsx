"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Languages } from "lucide-react"
import { apiGet } from "@/lib/api/client"

interface Therapist {
  id: string
  name: string
  credentials: string[]
  specialties: string[]
  approach: string
  bio: string
  languages: string[]
  profileImage?: string | null
  createdAt?: string | null
}

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setLoading(true)
        const data = await apiGet<Therapist[]>("/api/therapists")
        setTherapists(data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load therapists")
        console.error("Error fetching therapists:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <header className="p-8 flex justify-between items-center z-20 shrink-0">
        <MindSageLogo size={32} />
        <div className="flex items-center gap-4">
          <AccountIcon />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Talk to a real human, when you&apos;re ready.
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Explore therapists who understand. No pressure, no commitment. Just
            take your time finding someone who feels right.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground font-light">
            Loading therapists...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-destructive font-light">{error}</p>
          </div>
        )}

        {/* Therapists Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {therapists.map((therapist, index) => (
                <motion.div
                  key={therapist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full flex flex-col bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-8 h-8 text-primary/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-light mb-1">{therapist.name}</h3>
                          <p className="text-sm text-muted-foreground font-light">
                            {therapist.credentials.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {therapist.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 text-xs font-light bg-primary/5 text-primary border border-primary/10 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 flex-1">
                        {therapist.approach}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-0 pb-6 px-6">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSelectedTherapist(therapist)}
                      >
                        View profile
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && therapists.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-light">
            No therapists available at the moment.
          </div>
        )}
      </main>

      {/* Therapist Profile Modal */}
      <Dialog
        open={!!selectedTherapist}
        onOpenChange={(open) => !open && setSelectedTherapist(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedTherapist && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-light mb-1">
                      {selectedTherapist.name}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedTherapist.credentials.join(", ")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Specialties */}
                <div>
                  <h4 className="text-sm font-light text-muted-foreground mb-3 uppercase tracking-wider">
                    Areas of Focus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTherapist.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1.5 text-sm font-light bg-primary/5 text-primary border border-primary/10 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* About */}
                <div>
                  <h4 className="text-sm font-light text-muted-foreground mb-3 uppercase tracking-wider">
                    About
                  </h4>
                  <p className="text-base font-light leading-relaxed text-foreground">
                    {selectedTherapist.bio}
                  </p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="text-sm font-light text-muted-foreground mb-3 uppercase tracking-wider">
                    My Approach
                  </h4>
                  <p className="text-base font-light leading-relaxed text-foreground">
                    {selectedTherapist.approach}
                  </p>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="text-sm font-light text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTherapist.languages.map((language) => (
                      <span
                        key={language}
                        className="px-3 py-1.5 text-sm font-light bg-secondary text-secondary-foreground border border-border rounded-full"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="default"
                    className="w-full"
                    disabled
                    onClick={() => setSelectedTherapist(null)}
                  >
                    Request session (coming soon)
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  )
}
