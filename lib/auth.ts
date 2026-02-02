// Firebase Authentication utilities for server-side routes
import { NextRequest } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"
import { adminDb } from "@/lib/firebase/admin"
import { FieldValue } from "firebase-admin/firestore"

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role?: "user" | "admin"
}

/**
 * Get the current user from the Firebase auth token in the request headers.
 * Validates the token and returns user information from Firestore.
 * Automatically creates user document in Firestore if it doesn't exist.
 */
export async function getCurrentUser(req?: NextRequest): Promise<SessionUser | null> {
  try {
    if (!req) {
      return null
    }

    // Get the authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const idToken = authHeader.split("Bearer ")[1]
    if (!idToken) {
      return null
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // TEMPORARILY DISABLED: Firestore access and profile creation for auth isolation testing
    // Get user data from Firestore
    // const userDoc = await adminDb.collection("users").doc(uid).get()
    // 
    // if (!userDoc.exists) {
    //   // User doesn't exist in Firestore yet - create them
    //   const userRecord = await adminAuth.getUser(uid)
    //   const newUser = {
    //     id: uid,
    //     email: userRecord.email || decodedToken.email || "",
    //     name: userRecord.displayName || decodedToken.name || null,
    //     preferredMode: "none",
    //     role: "user",
    //     createdAt: FieldValue.serverTimestamp(),
    //   }
    //   
    //   await adminDb.collection("users").doc(uid).set(newUser)
    //   
    //   return {
    //     id: newUser.id,
    //     email: newUser.email,
    //     name: newUser.name,
    //     role: newUser.role,
    //   }
    // }
    //
    // const userData = userDoc.data()
    // return {
    //   id: uid,
    //   email: userData?.email || decodedToken.email || "",
    //   name: userData?.name || null,
    //   role: userData?.role || "user",
    // }

    // Return minimal user info from token only (no Firestore)
    const userRecord = await adminAuth.getUser(uid)
    return {
      id: uid,
      email: userRecord.email || decodedToken.email || "",
      name: userRecord.displayName || decodedToken.name || null,
      role: "user", // Default role, not from Firestore
    }
  } catch (error: any) {
    console.error("Error verifying auth token:", error)
    // Don't expose internal error details
    return null
  }
}

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(req?: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req)
  return user?.role === "admin"
}

/**
 * Get Firebase ID token from request (alternative method)
 */
export async function getIdTokenFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split("Bearer ")[1]
  }
  return null
}
