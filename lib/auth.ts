import { NextRequest } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role?: "user" | "admin"
}

export async function getCurrentUser(req?: NextRequest): Promise<SessionUser | null> {
  try {
    if (!req) return null
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null
    const idToken = authHeader.split("Bearer ")[1]
    if (!idToken) return null
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid
    const userRecord = await adminAuth.getUser(uid)
    return {
      id: uid,
      email: userRecord.email || decodedToken.email || "",
      name: userRecord.displayName || decodedToken.name || null,
      role: "user",
    }
  } catch (error: any) {
    console.error("Error verifying auth token:", error)
    return null
  }
}

export async function isAdmin(req?: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req)
  return user?.role === "admin"
}

export async function getIdTokenFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split("Bearer ")[1]
  }
  return null
}
