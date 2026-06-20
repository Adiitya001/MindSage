"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && user === null) {
      const redirectPath = pathname || "/"
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [loading, user, router, pathname])
  if (loading) return null
  if (user === null) return null
  return <>{children}</>
}