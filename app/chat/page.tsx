"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import dynamic from "next/dynamic"

// Official Botpress embed scripts. `inject.js` must load first; the bot-specific
// config script then calls `botpress.init()` automatically and renders Eon into
// the element matching its `embeddedChatId` ("bp-embedded-webchat").
const BOTPRESS_INJECT_SRC = "https://cdn.botpress.cloud/webchat/v3.6/inject.js"
const BOTPRESS_CONFIG_SRC =
  "https://files.bpcontent.cloud/2026/01/06/05/20260106054815-L60AWWQE.js"

const EMBED_ID = "bp-embedded-webchat"

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve()
        return
      }
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)))
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => {
      script.dataset.loaded = "true"
      resolve()
    }
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

function ChatContent() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    if (typeof window === "undefined") return

    let active = true

    async function init() {
      try {
        // inject.js must be present before the config script runs. loadScript
        // dedupes by src, so re-running (e.g. React StrictMode) is safe.
        await loadScript(BOTPRESS_INJECT_SRC)
        await loadScript(BOTPRESS_CONFIG_SRC)
        if (active) setStatus("ready")
      } catch (err) {
        console.error("Error initializing Eon chat:", err)
        if (active) setStatus("error")
      }
    }

    init()

    return () => {
      active = false
    }
  }, [])

  if (status === "error") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
        Eon couldn&apos;t load right now. This can happen if a browser extension
        or ad blocker is blocking botpress.cloud. Please disable it for this site,
        then refresh.
      </div>
    )
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-background">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Eon is getting ready…</p>
        </div>
      )}
      {/* Botpress renders the embedded webchat into this element. */}
      <div id={EMBED_ID} className="h-full w-full" />
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
