import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // getCurrentUser already creates the user if it doesn't exist, so we can directly fetch
    const userDoc = await adminDb.collection("users").doc(user.id).get()

    if (!userDoc.exists) {
      // This should rarely happen since getCurrentUser creates the user, but handle it gracefully
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userData = userDoc.data()
    
    // Handle Firestore Timestamp serialization
    let createdAt = null
    if (userData?.createdAt) {
      if (userData.createdAt.toDate && typeof userData.createdAt.toDate === "function") {
        createdAt = userData.createdAt.toDate().toISOString()
      } else if (userData.createdAt instanceof Date) {
        createdAt = userData.createdAt.toISOString()
      } else if (typeof userData.createdAt === "string") {
        createdAt = userData.createdAt
      }
    }
    
    return NextResponse.json({
      id: user.id,
      email: userData?.email || "",
      name: userData?.name || null,
      preferredMode: userData?.preferredMode || "none",
      avatarId: userData?.avatarId || "avatar-1",
      createdAt,
    })
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
