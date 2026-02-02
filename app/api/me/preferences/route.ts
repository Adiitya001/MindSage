import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser } from "@/lib/auth"
import { updateUserPreferencesSchema } from "@/lib/validations"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateUserPreferencesSchema.parse(body)

    // Update user document in Firestore
    const userRef = adminDb.collection("users").doc(user.id)
    await userRef.update(validatedData)

    // Fetch updated user
    const updatedDoc = await userRef.get()
    const userData = updatedDoc.data()

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
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating user preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
