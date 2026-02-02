import { NextRequest, NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { getCurrentUser } from "@/lib/auth"
import { createReactionSchema } from "@/lib/validations"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    const { id: postId } = await params
    const body = await req.json()
    const { type } = createReactionSchema.parse(body)
    const postDoc = await adminDb.collection("communityPosts").doc(postId).get()

    if (!postDoc.exists) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const postData = postDoc.data()
    if (!postData?.isApproved || postData?.isHidden) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }
    let reactionQuery = adminDb
      .collection("reactions")
      .where("postId", "==", postId)
      .where("type", "==", type)

    if (user) {
      reactionQuery = reactionQuery.where("userId", "==", user.id) as any
    } else {
      reactionQuery = reactionQuery.where("userId", "==", null) as any
    }

    const existingReactions = await reactionQuery.get()

    if (!existingReactions.empty) {
      // Reaction already exists - return it
      const existingReaction = existingReactions.docs[0]
      const allReactions = await adminDb
        .collection("reactions")
        .where("postId", "==", postId)
        .get()

      return NextResponse.json({
        reaction: {
          id: existingReaction.id,
          type: existingReaction.data().type,
          createdAt: existingReaction.data().createdAt?.toDate?.() || existingReaction.data().createdAt || null,
        },
        reactionsCount: allReactions.size,
      })
    }

    // Create new reaction
    const reactionData = {
      postId,
      userId: user?.id || null,
      type,
      createdAt: new Date(),
    }

    const reactionRef = await adminDb.collection("reactions").add(reactionData)
    const reactionDoc = await reactionRef.get()
    const reactionData_final = reactionDoc.data()

    // Get updated reaction count
    const allReactions = await adminDb
      .collection("reactions")
      .where("postId", "==", postId)
      .get()

    return NextResponse.json({
      reaction: {
        id: reactionDoc.id,
        type: reactionData_final?.type,
        createdAt: reactionData_final?.createdAt?.toDate?.() || reactionData_final?.createdAt || null,
      },
      reactionsCount: allReactions.size,
    })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating reaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
