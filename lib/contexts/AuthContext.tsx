"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, name?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Manages Firebase authentication state only
 * - Uses onAuthStateChanged to track user
 * - Exposes user and loading state
 * - Provides auth methods (signup, login, logout)
 * - Does NOT perform navigation
 * - Does NOT fetch profile data
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure auth is available before setting up listener
    if (!auth) {
      console.error("Firebase auth not initialized")
      setLoading(false)
      return
    }

    // Listen for auth state changes
    // onAuthStateChanged fires immediately with current user, then on every change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name })
      }
    } catch (error: any) {
      throw new Error(error.message || "Signup failed")
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      // Preserve Firebase error codes for better error handling
      const err = new Error(error.message || "Google login failed")
      ;(err as any).code = error.code
      throw err
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      throw new Error(error.message || "Logout failed")
    }
  }

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      try {
        return await user.getIdToken(true)
      } catch (error) {
        console.error("Error getting ID token:", error)
        return null
      }
    }

    // Fallback to auth.currentUser
    if (auth && auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken(true)
      } catch (error) {
        console.error("Error getting ID token from auth.currentUser:", error)
        return null
      }
    }

    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}