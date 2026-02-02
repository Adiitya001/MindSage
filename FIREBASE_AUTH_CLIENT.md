# Firebase Authentication - Client-Side Usage Guide

This document provides examples for implementing Firebase Authentication on the client side.

## Setup

The Firebase client SDK is already configured in `lib/firebase/client.ts`. Use it in your React components.

## Example: Auth Context (Optional)

```typescript
// lib/contexts/AuthContext.tsx (create this file if needed)
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { onAuthStateChanged } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  getIdToken: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const getIdToken = async () => {
    if (!user) return null
    return await user.getIdToken()
  }

  return (
    <AuthContext.Provider value={{ user, loading, getIdToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

## Example: Sign Up with Email/Password

```typescript
"use client"

import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/client"

async function handleSignUp(email: string, password: string, name?: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Optionally update display name
    if (name) {
      await updateProfile(user, { displayName: name })
    }
    
    return user
  } catch (error: any) {
    console.error("Sign up error:", error)
    throw error
  }
}
```

## Example: Sign In with Email/Password

```typescript
"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/client"

async function handleSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    console.error("Sign in error:", error)
    throw error
  }
}
```

## Example: Sign In with Google

```typescript
"use client"

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase/client"

const googleProvider = new GoogleAuthProvider()

async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error: any) {
    console.error("Google sign in error:", error)
    throw error
  }
}
```

## Example: Making Authenticated API Calls

```typescript
"use client"

import { auth } from "@/lib/firebase/client"

async function callProtectedAPI() {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User not authenticated")
  }

  const idToken = await user.getIdToken()
  
  const response = await fetch("/api/me", {
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("API call failed")
  }

  return response.json()
}
```

## Example: Sign Out

```typescript
"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase/client"

async function handleSignOut() {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error("Sign out error:", error)
    throw error
  }
}
```

## Notes

- All authentication methods are handled by Firebase Auth
- User documents are automatically created in Firestore on first API call (see `lib/auth.ts`)
- ID tokens expire after 1 hour - Firebase handles automatic refresh
- For production, consider adding error handling and loading states
- Protect routes on the client side using auth state checks
