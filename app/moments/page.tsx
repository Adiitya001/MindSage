"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Sparkles } from "lucide-react"

interface JournalEntry {
  id: string
  date: Date
  content: string
  preview: string // First few lines for preview
}

const generateMockEntries = (): JournalEntry[] => {
  const entries: JournalEntry[] = []
  const today = new Date()
  
  const mockContents = [
    "Today I felt a mix of everything. Some moments of clarity, some moments of confusion. I'm learning that both can coexist, and that's okay.",
    
    "I've been reflecting on the idea of growth. It doesn't always feel like progress. Sometimes it feels like coming apart, only to rebuild differently.",
    
    "The weight feels a bit lighter today. Not gone, but manageable. I'm noticing small moments of peace throughout the day, and I'm trying to let myself receive them.",
    
    "Some days are harder than others. Today was one of those days. But I'm here, I'm writing, and that feels like something.",
    
    "I had a conversation today that made me realize how much I've been carrying alone. There's something about sharing the load that makes it feel more bearable.",
    
    "Today I practiced being kinder to myself. It's harder than it sounds, but I'm learning. Small steps, gentle reminders.",
    
    "The weather changed today, and it felt symbolic somehow. Like maybe change is possible, even when it doesn't feel like it.",
    
    "I'm noticing patterns in how I respond to stress. Some are helpful, some aren't. Awareness feels like the first step toward something different.",
    
    "Today was quiet. Not empty quiet, but peaceful quiet. I'm learning to appreciate these moments when they come.",
    
    "I wrote about gratitude today, and it surprised me how much I have to be grateful for, even in the midst of difficulty.",
  ]

  // Generate entries for the last 30 days (some days have entries, some don't)
  for (let i = 0; i < 30; i++) {
    if (Math.random() > 0.4) { // 60% chance of having an entry
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const content = mockContents[Math.floor(Math.random() * mockContents.length)]
      const preview = content.substring(0, 120) + (content.length > 120 ? "..." : "")
      
      entries.push({
        id: `entry-${i}`,
        date,
        content,
        preview,
      })
    }
  }

  // Sort by date (newest first)
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime())
}

function formatDate(date: Date): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const dateStr = date.toDateString()
  const todayStr = today.toDateString()
  const yesterdayStr = yesterday.toDateString()
  
  if (dateStr === todayStr) {
    return "Today"
  } else if (dateStr === yesterdayStr) {
    return "Yesterday"
  } else {
    // Format as "Monday, January 15" or "Jan 15" for older entries
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined })
    }
  }
}

function getDateGroupLabel(date: Date): string {
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return "This Week"
  if (diffDays < 30) return "This Month"
  if (diffDays < 365) return "Earlier This Year"
  return "Earlier"
}

export default function MomentsPage() {
  const [entries] = useState<JournalEntry[]>(generateMockEntries())
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [filter, setFilter] = useState<"all" | "week" | "month">("all")

  // Group entries by date category
  const groupedEntries = entries.reduce((acc, entry) => {
    const group = getDateGroupLabel(entry.date)
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(entry)
    return acc
  }, {} as Record<string, JournalEntry[]>)

  // Filter entries based on selected filter
  const filteredEntries = entries.filter((entry) => {
    const today = new Date()
    const diffTime = today.getTime() - entry.date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (filter === "week") return diffDays <= 7
    if (filter === "month") return diffDays <= 30
    return true
  })

  const filteredGroupedEntries = filteredEntries.reduce((acc, entry) => {
    const group = getDateGroupLabel(entry.date)
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(entry)
    return acc
  }, {} as Record<string, JournalEntry[]>)

  return (
    <div className="min-h-screen bg-background flex flex-col pb-32">
      <header className="p-8 flex justify-between items-center z-20 shrink-0">
        <MindSageLogo size={32} />
        <ThemeToggle />
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary/60" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Your Moments
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">
            Look back gently at your journey. These are the thoughts and reflections
            you&apos;ve captured along the way.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
              filter === "all"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-card/40 text-muted-foreground border border-border/50 hover:bg-card/60"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
              filter === "week"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-card/40 text-muted-foreground border border-border/50 hover:bg-card/60"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`px-4 py-2 rounded-full text-sm font-light transition-all ${
              filter === "month"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-card/40 text-muted-foreground border border-border/50 hover:bg-card/60"
            }`}
          >
            This Month
          </button>
        </motion.div>

        {/* Entries List */}
        {Object.keys(filteredGroupedEntries).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground font-light">
              No entries yet. Start writing in your journal to see your moments here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {Object.entries(filteredGroupedEntries).map(([group, groupEntries], groupIndex) => (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1, duration: 0.6 }}
                >
                  <h2 className="text-sm font-light text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {group}
                  </h2>
                  <div className="space-y-3">
                    {groupEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: groupIndex * 0.1 + index * 0.05, duration: 0.4 }}
                      >
                        <Card
                          className="bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-sm font-light text-muted-foreground">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <p className="text-base font-light leading-relaxed text-foreground whitespace-pre-wrap line-clamp-3">
                              {entry.preview}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Entry Detail Modal */}
      <Dialog
        open={!!selectedEntry}
        onOpenChange={(open) => !open && setSelectedEntry(null)}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-light flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  {formatDate(selectedEntry.date)}
                </DialogTitle>
                <DialogDescription className="font-light">
                  {selectedEntry.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="pt-4">
                <p className="text-base font-light leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedEntry.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Navigation />
    </div>
  )
}
