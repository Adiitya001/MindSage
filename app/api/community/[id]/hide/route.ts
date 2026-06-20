import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser, isAdmin } from "@/lib/auth"

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

    const postRef = adminDb.collection("communityPosts").doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    await postRef.update({
      isHidden: true,
    })

    const updatedDoc = await postRef.get()
    const data = updatedDoc.data()

    return NextResponse.json({
      id: updatedDoc.id,
      title: data?.title || null,
      content: data?.content,
      tag: data?.tag,
      isAnonymous: data?.isAnonymous || false,
      isApproved: data?.isApproved || false,
      isHidden: data?.isHidden || false,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt || null,
    })
  } catch (error: any) {
    console.error("Error hiding post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
