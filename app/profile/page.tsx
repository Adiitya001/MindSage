"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Bell, LogOut, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountIcon } from "@/components/account-icon"
import { useAuth } from "@/lib/contexts/AuthContext"
import { apiGet, apiPatch } from "@/lib/api/client"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { AVATARS, getAvatarById, DEFAULT_AVATAR_ID, type AvatarId } from "@/lib/avatars"

interface UserProfile {
  id: string
  email: string
  name: string | null
  preferredMode: "gita" | "quran" | "bible" | "none"
  avatarId: AvatarId
  createdAt: string | null
}

function ProfilePageContent() {
  const { user, logout, getIdToken } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editName, setEditName] = useState("")
  const [editMode, setEditMode] = useState<"gita" | "quran" | "bible" | "none">("none")
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>(DEFAULT_AVATAR_ID)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setLoading(false)
      setProfile({
        id: user.uid,
        email: user.email || "",
        name: user.displayName || null,
        preferredMode: "none",
        avatarId: DEFAULT_AVATAR_ID,
        createdAt: null,
      })
      setEditName(user.displayName || "")
      setEditMode("none")
      setSelectedAvatarId(DEFAULT_AVATAR_ID)
    } else {
      setLoading(false)
    }
  }, [user])

  const handleSave = async () => {
    if (!user || !profile) return

    setSaving(true)
    setError("")

    try {
      const updates: { name?: string; preferredMode?: string; avatarId?: AvatarId } = {}
      if (editName !== (profile?.name || "")) {
        updates.name = editName
      }
      if (editMode !== profile?.preferredMode) {
        updates.preferredMode = editMode
      }
      if (selectedAvatarId !== profile?.avatarId) {
        updates.avatarId = selectedAvatarId
      }

      if (Object.keys(updates).length > 0) {
        if (updates.name) setEditName(updates.name)
        if (updates.preferredMode) setEditMode(updates.preferredMode)
        if (updates.avatarId) setSelectedAvatarId(updates.avatarId)
        if (profile) {
          setProfile({
            ...profile,
            ...updates,
          })
        }
      }
      setIsEditing(false)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile"
      const isUnauthorizedError = errorMessage.toLowerCase().includes("unauthorized")
      if (isUnauthorizedError) {
        setError("Could not save changes. Please try again.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.replace("/")
    } catch (err: any) {
      setError(err.message || "Failed to logout")
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground pb-24 flex items-center justify-center">
        <div className="text-muted-foreground font-light">Loading your space...</div>
      </main>
    )
  }

  const displayProfile: UserProfile = profile || {
    id: user?.uid || "",
    email: user?.email || "",
    name: user?.displayName || null,
    preferredMode: "none",
    avatarId: DEFAULT_AVATAR_ID,
    createdAt: null,
  }

  const displayAvatar = getAvatarById(displayProfile.avatarId || selectedAvatarId)

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <div className="fixed top-8 left-8 z-50">
        <MindSageLogo size={32} />
      </div>
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        <AccountIcon />
        <ThemeToggle />
      </div>
      <header className="pt-12 px-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 text-5xl">
          {displayAvatar.emoji}
        </div>
        <h1 className="text-2xl font-medium mb-1">Your Space</h1>
        <p className="text-muted-foreground text-sm">
          {displayProfile.createdAt ? `Member since ${formatDate(displayProfile.createdAt)}` : displayProfile.email}
        </p>
      </header>

      <section className="max-w-md mx-auto px-6 mt-12 space-y-4">
        {error && !error.toLowerCase().includes("unauthorized") && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg font-light">
            {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base font-normal">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-light text-muted-foreground mb-1 block">Email</label>
                    <p className="text-foreground font-light">{displayProfile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-light text-muted-foreground mb-1 block">Name</label>
                    <p className="text-foreground font-light">{displayProfile.name || "Not set"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-light text-muted-foreground mb-1 block">Wisdom Mode</label>
                    <p className="text-foreground font-light">
                      {displayProfile.preferredMode === "none" && "None (CBT-based guidance only)"}
                      {displayProfile.preferredMode === "gita" && "Bhagavad Gita (Hindu wisdom only)"}
                      {displayProfile.preferredMode === "quran" && "Quran (Islamic wisdom only)"}
                      {displayProfile.preferredMode === "bible" && "Bible (Christian wisdom only)"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-light text-muted-foreground mb-1 block">Avatar</label>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{displayAvatar.emoji}</span>
                      <span className="text-foreground font-light">{displayAvatar.name}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    Edit preferences
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="name" className="text-sm font-light text-muted-foreground mb-2 block">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      disabled={saving}
                      className="font-light"
                    />
                  </div>
                  <div>
                    <label htmlFor="mode" className="text-sm font-light text-muted-foreground mb-2 block">
                      Wisdom Mode
                    </label>
                      <select
                        id="mode"
                        value={editMode}
                        onChange={(e) => setEditMode(e.target.value as any)}
                        disabled={saving}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="none">None (CBT-based guidance only)</option>
                        <option value="gita">Bhagavad Gita (Hindu wisdom only)</option>
                        <option value="quran">Quran (Islamic wisdom only)</option>
                        <option value="bible">Bible (Christian wisdom only)</option>
                      </select>
                      <p className="text-xs text-muted-foreground font-light mt-2">
                        You can change this anytime. MindSage will respect your choice.
                      </p>
                  </div>
                  <div>
                    <label className="text-sm font-light text-muted-foreground mb-2 block">Avatar</label>
                    <div className="grid grid-cols-4 gap-3">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatarId(avatar.id)}
                          disabled={saving}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                            selectedAvatarId === avatar.id
                              ? "ring-2 ring-primary bg-primary/10 scale-110"
                              : "bg-muted/50 hover:bg-muted border border-border/50"
                          }`}
                        >
                          {avatar.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditing(false)
                        setEditName(displayProfile.name || "")
                        setEditMode(displayProfile.preferredMode)
                        setSelectedAvatarId(displayProfile.avatarId)
                        setError("")
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button variant="default" className="flex-1" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/privacy">
          <Card className="border-none bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-normal">Privacy & Data</CardTitle>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
          </Card>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link href="/reminders">
          <Card className="border-none bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-normal">Gentle Reminders</CardTitle>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
          </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8"
        >
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out gently
          </Button>
        </motion.div>
      </section>

      <Navigation />
    </main>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}