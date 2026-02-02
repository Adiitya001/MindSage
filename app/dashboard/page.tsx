"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/AuthContext"
import { apiGet } from "@/lib/api/client"

interface UserProfile {
  id: string
  email: string
  name: string | null
  preferredMode: "gita" | "quran" | "bible" | "none"
  avatarId: string
  createdAt: string | null
}

function DashboardContent() {
  const { user, getIdToken } = useAuth()
  const [userName, setUserName] = useState<string | null>(null)

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // TEMPORARILY DISABLED: Profile fetch for auth isolation testing
  // Fetch user's name from profile
  useEffect(() => {
    // DISABLED FOR AUTH TESTING - Profile fetch temporarily disabled
    // Use Firebase user data directly (no profile API calls)
    if (user) {
      if (user.displayName) {
        setUserName(user.displayName)
      } else if (user.email) {
        setUserName(user.email.split("@")[0])
      }
    }
  }, [user])

  // Display name: profile name > displayName > email username > "there"
  const displayName = userName || user?.displayName || (user?.email ? user.email.split("@")[0] : "there")

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-32">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <MindSageLogo size={800} />
      </div>

      <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <MindSageLogo size={40} />
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground font-light hidden md:block">It&apos;s a good day to reflect.</p>
          <AccountIcon />
          <ThemeToggle />
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extralight mb-4 tracking-tight">
            {getGreeting()}, {displayName}.
          </h1>
          <p className="text-muted-foreground text-lg font-light italic">How does your heart feel today?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="md:col-span-3"
          >
            <Link href="/chat" className="group block">
              <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:bg-card/60">
                <h2 className="text-3xl font-light mb-4 group-hover:text-primary transition-colors">
                  Begin a conversation
                </h2>
                <p className="text-muted-foreground text-sm tracking-wide uppercase font-light">Talk with your guide</p>
              </div>
            </Link>
          </motion.div>

          {[
            { title: "Reflect", subtitle: "Check in with yourself", href: "/reflect" },
            { title: "Journal", subtitle: "Write it down", href: "/journal" },
            { title: "Moments", subtitle: "Look back gently", href: "/moments" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
            >
              <Link href={item.href} className="group block">
                <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 h-48 flex flex-col items-center justify-center transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:bg-card/60">
                  <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-xs tracking-widest uppercase font-light">{item.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-24 text-center max-w-sm"
        >
          <p className="text-sm text-muted-foreground/40 font-light leading-relaxed">
            &ldquo;The quietest mind is often the most profound.&rdquo;
          </p>
        </motion.div>
      </main>

      <Navigation />
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
