import { ProtectedRoute } from "@/lib/components/ProtectedRoute"

function ChatPageContent({ chatUrl }: { chatUrl: string | undefined }) {
  if (!chatUrl) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground"
        style={{ minHeight: "100vh" }}
      >
        Chat is not configured. Please restart your dev server after adding NEXT_PUBLIC_BOTPRESS_CHAT_URL to .env.local
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

export default function ChatPage() {
  const chatUrl = process.env.NEXT_PUBLIC_BOTPRESS_CHAT_URL
  return (
    <ProtectedRoute>
      <ChatPageContent chatUrl={chatUrl} />
    </ProtectedRoute>
  )
}
