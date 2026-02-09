"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import dynamic from "next/dynamic"

function ChatContent() {
  const [chatUrl, setChatUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    setMounted(true)
    const url = process.env.NEXT_PUBLIC_BOTPRESS_CHAT_URL
    setChatUrl(url || null)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Eon is getting ready…</p>
      </div>
    )
  }

  if (!chatUrl) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
        Chat is not configured. Please add NEXT_PUBLIC_BOTPRESS_CHAT_URL to your environment variables.
      </div>
    )
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <iframe
        src={chatUrl}
        className="h-full w-full border-0"
        style={{ display: "block", width: "100%", height: "100%" }}
        allow="microphone; clipboard-read; clipboard-write"
        allowFullScreen
        title="MindSage Chat"
        loading="eager"
      />
    </div>
  )
}

const ChatPageContent = dynamic(() => Promise.resolve(ChatContent), {
  ssr: false,
})

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  )
}
