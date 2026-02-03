"use client"

import { useEffect } from "react"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"

declare global {
  interface Window {
    botpress?: {
      init: (config: { botId: string; clientId: string; selector: string }) => void
    }
    __botpressInitialized?: boolean
  }
}

function ChatPageContent() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const initializeBotpress = () => {
      if (window.__botpressInitialized) return
      if (!window.botpress?.init) return
      window.__botpressInitialized = true
      window.botpress.init({
        botId: "0bbe0ab0-749d-4ac3-ac5c-6e9081b44487",
        clientId: "b47e11d5-ffa5-40c8-a7d0-8ee1f81d3bd2",
        selector: "#webchat",
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-botpress="webchat"]')

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        initializeBotpress()
      } else {
        existingScript.addEventListener("load", initializeBotpress, { once: true })
      }
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdn.botpress.cloud/webchat/v3.5/inject.js"
    script.async = true
    script.defer = true
    script.dataset.botpress = "webchat"
    script.addEventListener("load", () => {
      script.dataset.loaded = "true"
      initializeBotpress()
    })
    document.body.appendChild(script)
  }, [])

  return (
    <div className="bg-background" style={{ height: "100vh" }}>
      <div className="mx-auto w-full" style={{ height: "100%" }}>
        <div id="webchat" style={{ width: "100%", height: "100%" }} />
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
