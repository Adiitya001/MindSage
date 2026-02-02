import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase/admin"

export async function GET(req: NextRequest) {
  try {
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

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      message: "Token verified successfully",
    })
  } catch (error: any) {
    console.error("Auth check error:", error)
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
