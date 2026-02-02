import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

/**
 * Simple auth check endpoint - verifies Firebase ID token only
 * NO profile creation, NO Firestore access, NO user data
 * Just token verification
 */
export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      )
    }

    const idToken = authHeader.split("Bearer ")[1]
    if (!idToken) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 401 }
      )
    }

    // Verify the Firebase ID token ONLY
    // This is the core auth check - no Firestore, no profile creation
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    // Return success with minimal info
    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      message: "Token verified successfully",
    })
  } catch (error: any) {
    console.error("Auth check error:", error)
    
    // Return specific error for debugging
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Token expired", code: error.code },
        { status: 401 }
      )
    }
    if (error.code === "auth/argument-error") {
      return NextResponse.json(
        { error: "Invalid token format", code: error.code },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: "Token verification failed", code: error.code || "unknown" },
      { status: 401 }
    )
  }
}
