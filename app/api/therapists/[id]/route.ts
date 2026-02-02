import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { updateTherapistSchema } from "@/lib/validations"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const therapistDoc = await adminDb.collection("therapists").doc(id).get()

    if (!therapistDoc.exists) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      )
    }

    const data = therapistDoc.data()
    if (!data?.isActive) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: therapistDoc.id,
      name: data.name,
      bio: data.bio,
      credentials: data.credentials || [],
      specialties: data.specialties || [],
      approach: data.approach,
      languages: data.languages || [],
      profileImage: data.profileImage || null,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
    })
  } catch (error) {
    console.error("Error fetching therapist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin(req)

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const validatedData = updateTherapistSchema.parse(body)

    const therapistRef = adminDb.collection("therapists").doc(id)
    const therapistDoc = await therapistRef.get()

    if (!therapistDoc.exists) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      )
    }

    await therapistRef.update(validatedData)

    const updatedDoc = await therapistRef.get()
    const data = updatedDoc.data()

    return NextResponse.json({
      id: updatedDoc.id,
      name: data?.name,
      bio: data?.bio,
      credentials: data?.credentials || [],
      specialties: data?.specialties || [],
      approach: data?.approach,
      languages: data?.languages || [],
      profileImage: data?.profileImage || null,
      isActive: data?.isActive ?? true,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt || null,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating therapist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
