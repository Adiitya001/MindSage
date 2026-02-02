import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { createTherapistSchema } from "@/lib/validations"

export async function GET() {
  try {
    // Only return active therapists
    const therapistsSnapshot = await adminDb
      .collection("therapists")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get()

    const therapists = therapistsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        bio: data.bio,
        credentials: data.credentials || [],
        specialties: data.specialties || [],
        approach: data.approach,
        languages: data.languages || [],
        profileImage: data.profileImage || null,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
      }
    })

    return NextResponse.json(therapists)
  } catch (error: any) {
    console.error("Error fetching therapists:", error)
    // Return empty array on error instead of 500 to prevent UI breakage
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin(req)

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = createTherapistSchema.parse(body)

    const therapistData = {
      ...validatedData,
      isActive: validatedData.isActive ?? true,
      createdAt: new Date(),
    }

    const docRef = await adminDb.collection("therapists").add(therapistData)
    const doc = await docRef.get()
    const data = doc.data()

    return NextResponse.json(
      {
        id: doc.id,
        name: data?.name,
        bio: data?.bio,
        credentials: data?.credentials || [],
        specialties: data?.specialties || [],
        approach: data?.approach,
        languages: data?.languages || [],
        profileImage: data?.profileImage || null,
        isActive: data?.isActive ?? true,
        createdAt: data?.createdAt?.toDate?.() || data?.createdAt || null,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating therapist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
