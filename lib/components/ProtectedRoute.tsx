"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * ProtectedRoute - Single route guard for all protected pages
 * - Shows nothing while loading
 * - Redirects to /login if user is null after loading
 * - Renders children only when user exists
 * - Uses router.replace() to avoid polluting history
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect after loading is complete AND user is null
    if (!loading && user === null) {
      const redirectPath = pathname || "/"
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [loading, user, router, pathname])

  // Show nothing while loading
  if (loading) {
    return null
  }

  // Don't render children if no user (redirect will happen)
  if (user === null) {
    return null
  }

  // Render children only when user exists
  return <>{children}</>
}