"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/lib/components/ProtectedRoute"
import { Navigation } from "@/components/navigation"
import dynamic from "next/dynamic"

// Botpress webchat inject script.
const BOTPRESS_INJECT_SRC = "https://cdn.botpress.cloud/webchat/v3.6/inject.js"

// Eon's bot identifiers (from the published Botpress config).
const BOT_ID = "0bbe0ab0-749d-4ac3-ac5c-6e9081b44487"
const CLIENT_ID = "b47e11d5-ffa5-40c8-a7d0-8ee1f81d3bd2"

// Height (px) reserved at the bottom for the MindSage floating nav bar.
const NAV_RESERVE = 104

// MindSage dark palette (from globals.css, converted to hex). The webchat lives
// in a Shadow DOM, so this CSS is injected via `additionalStylesheet` — the only
// reliable way to theme + lay it out. Selectors target Botpress's bp* classes
// directly (no #id prefix needed inside the shadow root).
const EON_STYLESHEET = `
/* ---------- Full-page layout ---------- */
.bpFabContainer { display:none !important; }            /* no floating bubble   */
.bpHeaderContentActionsContainer { display:none !important; } /* no close/expand */
.bpWebchat {
  top:0 !important; bottom:auto !important; left:0 !important; right:0 !important;
  width:100vw !important; max-width:100vw !important;
  height:calc(100vh - ${NAV_RESERVE}px) !important;
  max-height:calc(100vh - ${NAV_RESERVE}px) !important;
  border-radius:0 !important; box-shadow:none !important; border:0 !important;
}
/* Hide the "⚡ by Botpress" footer link */
.bpContainer a[href*="botpress.com"],
.bpContainer a[href*="botpress"] { display:none !important; }

/* ---------- Theme ---------- */
.bpContainer { background:#020405 !important; color:#e2e5e8 !important; border:0 !important; }

.bpHeaderContainer {
  background:rgba(12,19,24,.6) !important;
  backdrop-filter:blur(16px) !important; -webkit-backdrop-filter:blur(16px) !important;
  border-bottom:1px solid #1b2228 !important; box-shadow:none !important;
}
.bpHeaderContentTitle { color:#e2e5e8 !important; font-weight:300 !important; }
.bpHeaderContentDescription { color:#7b8186 !important; }
.bpHeaderContentAvatarContainer, .bpHeaderContentAvatarFallback,
.bpMessageAvatarContainer, .bpMessageAvatarFallback {
  background:rgba(91,132,174,.18) !important; color:#5b84ae !important;
}

.bpMessageListContainer, .bpMessageListViewport { background:#020405 !important; }
.bpMessageListHeaderMessage { color:#7b8186 !important; font-weight:300 !important; }

.bpMessageBlocksBubble {
  background:#0f171f !important; color:#e2e5e8 !important;
  border:1px solid #1b2228 !important; border-radius:18px !important;
}
.bpMessageBlocksTextText { color:#e2e5e8 !important; line-height:1.6 !important; }
.bpMessageBlocksTextLink { color:#5b84ae !important; text-underline-offset:3px !important; }
.bpMessageBlocksTextBold { color:#e2e5e8 !important; font-weight:600 !important; }

/* User (outgoing) bubble — blue accent. */
[data-direction="outgoing"] .bpMessageBlocksBubble,
[data-author="user"] .bpMessageBlocksBubble {
  background:#5b84ae !important; color:#010407 !important; border-color:transparent !important;
}
[data-direction="outgoing"] .bpMessageBlocksTextText,
[data-author="user"] .bpMessageBlocksTextText { color:#010407 !important; }

.bpMessageBlocksButton {
  background:transparent !important; color:#5b84ae !important;
  border:1px solid rgba(91,132,174,.4) !important; border-radius:9999px !important;
}
.bpMessageBlocksButton:hover { background:rgba(91,132,174,.12) !important; border-color:#5b84ae !important; }

.bpComposerContainer, .bpComposerWrapper {
  background:rgba(12,19,24,.7) !important;
  backdrop-filter:blur(16px) !important; -webkit-backdrop-filter:blur(16px) !important;
  border-color:#1b2228 !important;
}
.bpComposerInputContainer { background:#0f171f !important; border:1px solid #1b2228 !important; border-radius:16px !important; }
.bpComposerInput { background:transparent !important; color:#e2e5e8 !important; }
.bpComposerInput::placeholder { color:#7b8186 !important; }
.bpComposerSendButton { background:#5b84ae !important; color:#010407 !important; border-radius:9999px !important; }
.bpComposerVoiceButton, .bpComposerUploadButton { color:#7b8186 !important; }
.bpComposerVoiceButton:hover, .bpComposerUploadButton:hover { color:#5b84ae !important; }

.bpMessageListScrollDownButton {
  background:#0c1318 !important; color:#e2e5e8 !important;
  border:1px solid #1b2228 !important; box-shadow:0 4px 16px rgba(0,0,0,.4) !important;
}
.bpTypingIndicatorLoader { color:#5b84ae !important; }
`

const BOTPRESS_CONFIG = {
  botId: BOT_ID,
  clientId: CLIENT_ID,
  configuration: {
    botName: "Eon",
    color: "#5b84ae",
    themeMode: "dark",
    variant: "soft",
    headerVariant: "glass",
    fontFamily: "inter",
    radius: 3,
    additionalStylesheet: EON_STYLESHEET,
  },
}

// Botpress injects a single global webchat instance into document.body. Track
// init across mounts so navigating away and back re-opens it instead of
// re-injecting a second instance.
let botpressInitialized = false

function loadInjectScript(): Promise<void> {  return new Promise((resolve, reject) => {
    if ((window as any).botpress) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${BOTPRESS_INJECT_SRC}"]`,
    )
    if (existing) {
      if (existing.dataset.loaded === "true" || (window as any).botpress) {
        resolve()
        return
      }
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Failed to load Botpress")))
      return
    }
    const script = document.createElement("script")
    script.src = BOTPRESS_INJECT_SRC
    script.async = true
    script.onload = () => {
      script.dataset.loaded = "true"
      resolve()
    }
    script.onerror = () => reject(new Error("Failed to load Botpress"))
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
        await loadInjectScript()
        if (!active) return

        const botpress = (window as any).botpress
        if (!botpress || typeof botpress.init !== "function") {
          throw new Error("Botpress failed to initialize")
        }

        const open = () => {
          try {
            botpress.open?.()
          } catch {
            /* no-op */
          }
        }

        // Initialize the singleton webchat only once for the whole app.
        if (!botpressInitialized) {
          botpress.init(BOTPRESS_CONFIG)
          botpressInitialized = true
          botpress.on?.("webchat:ready", () => open())
        }

        // Open it every time we land on this page.
        open()
        if (active) setStatus("ready")
        setTimeout(() => {
          if (active) {
            open()
            setStatus("ready")
          }
        }, 1000)
      } catch (err) {
        console.error("Error initializing Eon chat:", err)
        if (active) setStatus("error")
      }
    }

    init()

    return () => {
      active = false
      // The webchat lives in document.body (outside React), so close it when
      // leaving this page or it will overlap the next route.
      try {
        ;(window as any).botpress?.close?.()
      } catch {
        /* no-op */
      }
    }
  }, [])

  if (status === "error") {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="flex min-h-screen w-full items-center justify-center px-6 pb-28 text-center text-sm text-muted-foreground">
          Eon couldn&apos;t load right now. This can happen if a browser extension
          or ad blocker is blocking botpress.cloud. Please disable it for this
          site, then refresh.
        </div>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background">
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Eon is getting ready…</p>
        </div>
      )}
      {/* The Botpress webchat injects itself full-screen (see EON_STYLESHEET),
          stopping above this nav bar so the input clears it and the floating
          nav covers where the "by Botpress" footer used to be. */}
      <Navigation />
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
