"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MindSageLogo } from "@/components/mind-sage-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, loginWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signup(email, password, name || undefined)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async (e: React.MouseEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await loginWithGoogle()
      router.push("/dashboard")
    } catch (err: any) {
      // Handle popup-blocked error specifically
      if (err.code === "auth/popup-blocked" || err.message?.includes("popup-blocked")) {
        setError("Popup was blocked. Please allow popups for this site and try again.")
      } else if (err.code === "auth/popup-closed-by-user" || err.message?.includes("popup-closed")) {
        setError("Sign-up was cancelled.")
      } else {
        setError(err.message || "Google signup failed. Please try again.")
      }
    } finally {
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
            <h1 className="text-3xl font-light mt-8 mb-3 text-foreground tracking-tight">A new beginning</h1>
            <p className="text-muted-foreground font-light">Create your personal sanctuary.</p>
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
                  type="text"
                  placeholder="What shall we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="h-14 px-6 rounded-2xl bg-background/50 border-border focus:ring-primary/20 transition-all duration-300 font-light"
                />
              </div>
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
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="h-14 px-6 rounded-2xl bg-background/50 border-border focus:ring-primary/20 transition-all duration-300 font-light"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-light tracking-wide transition-all duration-500 hover:scale-[1.02]"
            >
              {loading ? "Creating your space..." : "Begin your journey"}
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
              onClick={(e) => handleGoogleSignup(e)}
              disabled={loading}
              className="w-full mt-6 h-14 rounded-2xl font-light"
            >
              Sign up with Google
            </Button>
          </div>

          <div className="mt-10 text-center border-t border-border/50 pt-8">
            <p className="text-sm text-muted-foreground font-light">
              Already have a space here?{" "}
              <Link href="/login" className="text-primary hover:underline underline-offset-4">
                Welcome back
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-muted-foreground/40 text-xs tracking-widest uppercase">
          Your space is private by design
        </div>
      </motion.div>
    </main>
  )
}
