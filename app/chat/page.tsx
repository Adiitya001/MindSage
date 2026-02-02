"use client"

import { ProtectedRoute } from "@/lib/components/ProtectedRoute"

const BOTPRESS_CHAT_URL = process.env.NEXT_PUBLIC_BOTPRESS_CHAT_URL

function ChatPageContent() {
  return (
    <div className="bg-background" style={{ height: "100vh" }}>
      <div className="mx-auto w-full" style={{ height: "100%" }}>
        {BOTPRESS_CHAT_URL ? (
          <iframe
            src={BOTPRESS_CHAT_URL}
            title="MindSage Chat"
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="microphone; clipboard-read; clipboard-write; fullscreen"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Chat is not configured. Set NEXT_PUBLIC_BOTPRESS_CHAT_URL.
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  )
}
