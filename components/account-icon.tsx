"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { getAvatarById, DEFAULT_AVATAR_ID } from "@/lib/avatars"

export function AccountIcon() {
  const { user } = useAuth()
  const router = useRouter()
  if (!user) return null

  const avatar = getAvatarById(DEFAULT_AVATAR_ID)

  const handleClick = () => {
    router.push("/profile")
  }

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
      aria-label="Go to profile"
    >
      <span className="text-xl">{avatar.emoji}</span>
    </button>
  )
}