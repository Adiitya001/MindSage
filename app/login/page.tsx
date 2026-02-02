"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle, getIdToken } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      
      // TEST: Call auth-check endpoint to verify token works
      try {
        // Wait a bit for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500))
        const token = await getIdToken()
        if (token) {
          const response = await fetch("/api/auth-check", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          const data = await response.json()
          if (response.ok) {
            console.log("✅ AUTH CHECK SUCCESS:", data)
          } else {
            console.error("❌ AUTH CHECK FAILED:", data)
          }
        } else {
          console.warn("⚠️ No token available for auth check")
        }
      } catch (authCheckError) {
        console.error("❌ AUTH CHECK ERROR:", authCheckError)
      }
      
      // On success, redirect to home
      router.replace("/dashboard")
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await loginWithGoogle()
      
      // TEST: Call auth-check endpoint to verify token works
      try {
        // Wait a bit for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500))
        const token = await getIdToken()
        if (token) {
          const response = await fetch("/api/auth-check", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })
          const data = await response.json()
          if (response.ok) {
            console.log("✅ AUTH CHECK SUCCESS:", data)
          } else {
            console.error("❌ AUTH CHECK FAILED:", data)
          }
        } else {
          console.warn("⚠️ No token available for auth check")
        }
      } catch (authCheckError) {
        console.error("❌ AUTH CHECK ERROR:", authCheckError)
      }
      
      // On success, redirect to home
      router.replace("/dashboard")
    } catch (err: any) {
      // Handle popup-blocked error specifically
      if (err.code === "auth/popup-blocked" || err.message?.includes("popup-blocked")) {
        setError("Popup was blocked. Please allow popups for this site and try again.")
      } else if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed")) {
        setError("Sign-in was cancelled.")
      } else {
        setError(err.message || "Google login failed. Please try again.")
      }
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
        <MindSageLogo size={600} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-primary/5">
          <div className="flex flex-col items-center mb-10 text-center">
            <MindSageLogo size={64} />
            <h1 className="text-3xl font-light mt-8 mb-3 text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground font-light">Continue your journey of reflection.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg font-light">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 px-6 rounded-2xl bg-background/50 border-border focus:ring-primary/20 transition-all duration-300 font-light"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-14 px-6 rounded-2xl bg-background/50 border-border focus:ring-primary/20 transition-all duration-300 font-light"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-light tracking-wide transition-all duration-500 hover:scale-[1.02]"
            >
              {loading ? "Continuing..." : "Continue"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-2 text-muted-foreground font-light">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleGoogleLogin(e)}
              disabled={loading}
              className="w-full mt-6 h-14 rounded-2xl font-light"
            >
              Continue with Google
            </Button>
          </div>

          <div className="mt-10 text-center space-y-4">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground/60 hover:text-primary transition-colors font-light"
            >
              Take a moment to reset your password
            </Link>
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground font-light">
                Don&apos;t have a space here yet?{" "}
                <Link href="/signup" className="text-primary hover:underline underline-offset-4">
                  Begin gently
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-muted-foreground/40 text-xs tracking-widest uppercase">
          Private • Secure • Yours
        </div>
      </motion.div>
    </main>
  )
}
